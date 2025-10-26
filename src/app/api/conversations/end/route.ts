import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";

/**
 * POST /api/conversations/end
 *
 * Manually save a conversation when it ends
 * This provides a way to persist conversations without relying solely on webhooks
 *
 * Request body:
 * {
 *   conversationId: string,
 *   agentId: string,
 *   transcript?: array,
 *   summary?: string,
 *   status?: string
 * }
 */
export async function POST(req: NextRequest) {
	try {
		// Authenticate the user
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse the request body
		const body = await req.json();
		const { conversationId, agentId, transcript, summary, status } = body;

		if (!conversationId || !agentId) {
			return NextResponse.json(
				{
					success: false,
					error: "conversationId and agentId are required",
				},
				{ status: 400 }
			);
		}

		console.log("💾 Saving conversation for userId:", userId);
		console.log("Conversation ID:", conversationId);

		// Generate a summary if not provided
		let finalSummary = summary || "Conversation completed";
		if (!summary && transcript && Array.isArray(transcript)) {
			const userMessages = transcript
				.filter((msg: { role: string; message: string }) => msg.role === "user")
				.map((msg: { role: string; message: string }) => msg.message)
				.join(" ");
			finalSummary = userMessages.substring(0, 500) || "Conversation completed";
		}

		// Insert conversation into database
		await db.insert(conversationsTable).values({
			userId,
			conversationId,
			agentId,
			status: status || "completed",
			transcript: transcript || [],
			analysis: {},
			summary: finalSummary,
		});

		console.log("✅ Conversation saved successfully!");

		return NextResponse.json({
			success: true,
			message: "Conversation saved successfully",
		});
	} catch (error) {
		console.error("❌ Error saving conversation:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to save conversation",
			},
			{ status: 500 }
		);
	}
}
