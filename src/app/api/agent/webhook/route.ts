import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env/server";
import { createHmac, timingSafeEqual } from "crypto";

export async function GET() {
	return NextResponse.json({
		status: "ok",
		message: "ElevenLabs webhook endpoint is running",
		timestamp: new Date().toISOString(),
	});
}

export async function POST(req: NextRequest) {
	try {
		console.log("🔔 ElevenLabs webhook endpoint hit!");

		// Log all headers for debugging
		const headers = Object.fromEntries(req.headers.entries());
		console.log("📋 Headers:", JSON.stringify(headers, null, 2));

		// Proper HMAC verification using raw body and signature header
		const rawBody = await req.text();
		const sigHeader =
			req.headers.get("x-elevenlabs-signature") ||
			req.headers.get("x-eleven-signature") ||
			req.headers.get("x-signature");

		if (!sigHeader) {
			console.log("❌ Missing signature header");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		try {
			const computed = createHmac("sha256", env.ELEVEN_WEBHOOK_SECRET)
				.update(rawBody)
				.digest("hex");

			const provided = sigHeader.trim().toLowerCase();
			const expected = computed.toLowerCase();

			// Constant-time compare
			const valid =
				provided.length === expected.length &&
				timingSafeEqual(Buffer.from(provided), Buffer.from(expected));

			if (!valid) {
				console.log("❌ Invalid webhook signature");
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		} catch (verr) {
			console.error("❌ Error verifying signature:", verr);
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = JSON.parse(rawBody);

		// Log the webhook payload for debugging
		console.log(
			"📦 ElevenLabs webhook received:",
			JSON.stringify(body, null, 2)
		);

		// Check if this is a post_call_transcription event
		if (body.type !== "post_call_transcription") {
			console.log("ℹ️ Ignoring non-transcription event:", body.type);
			return NextResponse.json({ ok: true });
		}

		// Extract the data field from webhook payload
		const webhookData = body.data;
		if (!webhookData) {
			console.error("❌ No data field in webhook payload");
			return NextResponse.json(
				{ error: "Invalid webhook payload" },
				{ status: 400 }
			);
		}

		// Extract userId from various possible locations in the webhook payload
		// Priority order:
		// 1. metadata.userId (from API start-call)
		// 2. conversation_initiation_client_data (from widget client-metadata)
		// 3. Other fallback locations
		let userId = webhookData.metadata?.userId || null;

		// Check conversation_initiation_client_data for client-metadata from widget
		if (!userId && webhookData.conversation_initiation_client_data) {
			const clientData = webhookData.conversation_initiation_client_data;
			userId =
				clientData.userId ||
				clientData.custom_llm_extra_body?.userId ||
				clientData.metadata?.userId ||
				clientData.dynamic_variables?.userId ||
				null;
		}

		// Last resort: check top-level fields
		if (!userId) {
			userId = webhookData.user_id || null;
		}

		console.log("👤 User ID from webhook:", userId || "NOT FOUND");
		console.log(
			"📍 Full metadata:",
			JSON.stringify(webhookData.metadata, null, 2)
		);
		console.log(
			"📍 Conversation initiation data:",
			JSON.stringify(webhookData.conversation_initiation_client_data, null, 2)
		);

		// If no userId, log for debugging but still save with "unknown"
		if (!userId) {
			console.warn("⚠️ No userId found in webhook payload");
			console.log("Available fields in data:", Object.keys(webhookData));
			console.warn(
				"⚠️ Please check that client-metadata is properly set in the widget or metadata in the API call"
			);
			userId = "unknown";
		} // Generate a human-readable summary from the transcript
		let summary = "No summary available";
		if (webhookData.transcript && Array.isArray(webhookData.transcript)) {
			const userMessages = webhookData.transcript
				.filter((msg: { role: string; message: string }) => msg.role === "user")
				.map((msg: { role: string; message: string }) => msg.message)
				.join(" ");
			summary = userMessages.substring(0, 500) || "Conversation completed";
		}

		// If analysis contains a summary, use that instead (note: it's transcript_summary in the docs)
		if (webhookData.analysis?.transcript_summary) {
			summary = webhookData.analysis.transcript_summary;
		} else if (webhookData.analysis?.summary) {
			summary = webhookData.analysis.summary;
		}

		// Store the conversation data in the database
		try {
			// Use onConflictDoUpdate to handle duplicate conversationId
			// This will update the existing record if conversationId already exists
			const result = await db
				.insert(conversationsTable)
				.values({
					userId,
					conversationId: webhookData.conversation_id,
					agentId: webhookData.agent_id,
					status: webhookData.status || "completed",
					transcript: webhookData.transcript || [],
					analysis: webhookData.analysis || {},
					summary,
				})
				.onConflictDoUpdate({
					target: conversationsTable.conversationId,
					set: {
						userId,
						agentId: webhookData.agent_id,
						status: webhookData.status || "completed",
						transcript: webhookData.transcript || [],
						analysis: webhookData.analysis || {},
						summary,
						updatedAt: new Date(),
					},
				})
				.returning();

			console.log("✅ Conversation saved to database!");
			console.log("Database result:", JSON.stringify(result, null, 2));
			console.log("Conversation ID:", webhookData.conversation_id);
			console.log("User ID:", userId);
			console.log("Summary:", summary);
		} catch (dbError) {
			console.error("❌ Database insert error:", dbError);
			throw dbError;
		}

		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error("❌ Webhook error:", e);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
