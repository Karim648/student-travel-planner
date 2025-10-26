import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
	try {
		// Check if user is authenticated
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("🔍 Fetching conversations for userId:", userId);

		// Fetch all conversations for this user
		const conversations = await db
			.select()
			.from(conversationsTable)
			.where(eq(conversationsTable.userId, userId))
			.orderBy(desc(conversationsTable.createdAt));

		console.log("📊 Found conversations:", conversations.length);
		console.log("Conversations:", JSON.stringify(conversations, null, 2));

		return NextResponse.json({
			success: true,
			conversations,
		});
	} catch (error) {
		console.error("Error fetching conversations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch conversations" },
			{ status: 500 }
		);
	}
}
