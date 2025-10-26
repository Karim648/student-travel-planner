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

		// Fetch all conversations for this user
		const conversations = await db
			.select()
			.from(conversationsTable)
			.where(eq(conversationsTable.userId, userId))
			.orderBy(desc(conversationsTable.createdAt));

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
