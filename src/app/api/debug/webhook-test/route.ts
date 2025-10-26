import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

/**
 * GET /api/debug/webhook-test
 *
 * Debug endpoint to check:
 * 1. Recent webhook calls
 * 2. Recent conversations in DB
 * 3. Webhook configuration status
 */
export async function GET() {
	try {
		// Fetch the last 5 conversations from the database
		const recentConversations = await db
			.select()
			.from(conversationsTable)
			.orderBy(desc(conversationsTable.createdAt))
			.limit(5);

		return NextResponse.json({
			success: true,
			data: {
				recentConversations,
				totalConversations: recentConversations.length,
				info: {
					message: "Check your terminal logs for webhook activity",
					webhookUrl: `${
						process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
					}/api/agent/webhook`,
					instructions: [
						"1. Start a conversation in the app",
						"2. Complete the conversation",
						"3. Check terminal for webhook logs (🔔 ElevenLabs webhook endpoint hit!)",
						"4. Refresh this endpoint to see if conversation was saved",
					],
				},
			},
		});
	} catch (error) {
		console.error("Debug endpoint error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
