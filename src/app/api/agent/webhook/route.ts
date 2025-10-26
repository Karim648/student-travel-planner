import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";

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

		// Temporarily disable auth verification for debugging
		// TODO: Re-enable with proper HMAC verification
		// const auth = req.headers.get("authorization");
		// console.log("Auth header:", auth ? "Present" : "Missing");
		//
		// if (
		// 	env.ELEVEN_WEBHOOK_SECRET &&
		// 	auth !== `Bearer ${env.ELEVEN_WEBHOOK_SECRET}`
		// ) {
		// 	console.log("❌ Webhook auth failed");
		// 	return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		// }

		const body = await req.json();

		// Log the webhook payload for debugging
		console.log(
			"📦 ElevenLabs webhook received:",
			JSON.stringify(body, null, 2)
		);

		// Extract data from the webhook payload structure
		// Based on ElevenLabs docs: https://elevenlabs.io/docs/product-guides/administration/webhooks
		const webhookData = body.data; // The actual event data is in the 'data' field

		if (!webhookData) {
			console.error("❌ No data field in webhook payload");
			return NextResponse.json(
				{ error: "Invalid webhook payload" },
				{ status: 400 }
			);
		}

		// Extract userId from conversation_initiation_client_data.custom_llm_extra_body
		let userId =
			webhookData.conversation_initiation_client_data?.custom_llm_extra_body
				?.userId || null;

		// Fallback: check other possible locations
		if (!userId) {
			userId =
				webhookData.metadata?.userId ||
				webhookData.user_id ||
				webhookData.conversation_initiation_client_data?.dynamic_variables
					?.userId ||
				null;
		}

		console.log("👤 User ID from webhook:", userId || "NOT FOUND");

		// If no userId, log the full payload for debugging but still save with "unknown"
		if (!userId) {
			console.warn("⚠️ No userId found in webhook payload");
			console.log("Available fields in data:", Object.keys(webhookData));
			console.log(
				"conversation_initiation_client_data:",
				JSON.stringify(webhookData.conversation_initiation_client_data, null, 2)
			);
			userId = "unknown";
		}

		// Generate a human-readable summary from the transcript
		let summary = "No summary available";
		if (webhookData.transcript && Array.isArray(webhookData.transcript)) {
			const userMessages = webhookData.transcript
				.filter((msg: { role: string; message: string }) => msg.role === "user")
				.map((msg: { role: string; message: string }) => msg.message)
				.join(" ");
			summary = userMessages.substring(0, 500) || "Conversation completed";
		}

		// If analysis contains a summary, use that instead
		if (webhookData.analysis?.transcript_summary) {
			summary = webhookData.analysis.transcript_summary;
		}

		// Store the conversation data in the database
		await db.insert(conversationsTable).values({
			userId,
			conversationId: webhookData.conversation_id,
			agentId: webhookData.agent_id,
			status: webhookData.status || "completed",
			transcript: webhookData.transcript || [],
			analysis: webhookData.analysis || {},
			summary,
		});

		console.log("✅ Conversation saved to database!");
		console.log("Conversation ID:", webhookData.conversation_id);
		console.log("User ID:", userId);

		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error("❌ Webhook error:", e);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
