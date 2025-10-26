import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
	request: Request,
	props: { params: Promise<{ id: string }> }
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const params = await props.params;
		const conversationId = parseInt(params.id);

		if (isNaN(conversationId)) {
			return NextResponse.json(
				{ error: "Invalid conversation ID" },
				{ status: 400 }
			);
		}

		// Delete the conversation only if it belongs to the current user
		const result = await db
			.delete(conversationsTable)
			.where(
				and(
					eq(conversationsTable.id, conversationId),
					eq(conversationsTable.userId, userId)
				)
			)
			.returning();

		if (result.length === 0) {
			return NextResponse.json(
				{ error: "Conversation not found or unauthorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Conversation deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting conversation:", error);
		return NextResponse.json(
			{ error: "Failed to delete conversation" },
			{ status: 500 }
		);
	}
}
