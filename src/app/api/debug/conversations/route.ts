import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

// Temporary debug endpoint to see all conversations
// TODO: Remove this in production
export async function GET() {
	try {
		// Fetch ALL conversations (no user filter)
		const conversations = await db
			.select()
			.from(conversationsTable)
			.orderBy(desc(conversationsTable.createdAt));

		return NextResponse.json({
			success: true,
			total: conversations.length,
			conversations: conversations.map((conv) => ({
				id: conv.id,
				userId: conv.userId,
				conversationId: conv.conversationId,
				status: conv.status,
				summary: conv.summary,
				createdAt: conv.createdAt,
			})),
		});
	} catch (error) {
		console.error("Error fetching all conversations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch conversations" },
			{ status: 500 }
		);
	}
}
