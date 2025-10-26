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

		// The body typically contains:
		// - conversation_id: unique ID for the conversation
		// - agent_id: your agent ID
		// - status: 'completed', 'failed', etc.
		// - transcript: array of messages
		// - metadata: any custom data you passed (including userId)
		// - analysis: sentiment, summary, etc. (if enabled)

		// Extract userId from multiple possible locations
		const userId =
			body.metadata?.userId ||
			body.custom_llm_extra_body?.userId ||
			body.user_id ||
			"unknown";
		console.log("👤 User ID from webhook:", userId);

		// Only save if we have a valid userId (not "unknown")
		if (userId === "unknown") {
			console.warn("⚠️ No userId found in webhook payload, skipping save");
			console.log("Full payload:", JSON.stringify(body, null, 2));
			return NextResponse.json({
				ok: true,
				warning: "No userId found, conversation not saved",
			});
		}

		// Generate a human-readable summary from the transcript
		let summary = "No summary available";
		if (body.transcript && Array.isArray(body.transcript)) {
			const userMessages = body.transcript
				.filter((msg: { role: string; message: string }) => msg.role === "user")
				.map((msg: { role: string; message: string }) => msg.message)
				.join(" ");
			summary = userMessages.substring(0, 500) || "Conversation completed";
		}

		// If analysis contains a summary, use that instead
		if (body.analysis?.summary) {
			summary = body.analysis.summary;
		}

		// Store the conversation data in the database
		await db.insert(conversationsTable).values({
			userId,
			conversationId: body.conversation_id,
			agentId: body.agent_id,
			status: body.status || "completed",
			transcript: body.transcript || [],
			analysis: body.analysis || {},
			summary,
		});

		console.log("✅ Conversation saved to database!");
		console.log("Conversation ID:", body.conversation_id);

		return NextResponse.json({ ok: true });
	} catch (e) {
		console.error("❌ Webhook error:", e);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
