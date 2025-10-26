import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { savedItemsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/saved-items
 * Fetch all saved items for the authenticated user
 *
 * Query params:
 * - type: 'activity' | 'hotel' | 'restaurant' (optional, filters by type)
 */
export async function GET(req: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(req.url);
		const itemType = searchParams.get("type");

		// Build the where condition
		const whereConditions = itemType
			? and(
					eq(savedItemsTable.userId, userId),
					eq(savedItemsTable.itemType, itemType)
			  )
			: eq(savedItemsTable.userId, userId);

		const savedItems = await db
			.select()
			.from(savedItemsTable)
			.where(whereConditions);

		return NextResponse.json({
			success: true,
			data: savedItems,
		});
	} catch (error) {
		console.error("❌ Error fetching saved items:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch saved items",
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/saved-items
 * Save a new item (activity, hotel, or restaurant)
 *
 * Request body:
 * {
 *   itemType: 'activity' | 'hotel' | 'restaurant',
 *   itemData: object,
 *   conversationId?: string
 * }
 */
export async function POST(req: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { itemType, itemData, conversationId } = body;

		if (!itemType || !itemData) {
			return NextResponse.json(
				{ success: false, error: "itemType and itemData are required" },
				{ status: 400 }
			);
		}

		if (!["activity", "hotel", "restaurant"].includes(itemType)) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid itemType. Must be activity, hotel, or restaurant",
				},
				{ status: 400 }
			);
		}

		// Insert the saved item
		const [savedItem] = await db
			.insert(savedItemsTable)
			.values({
				userId,
				itemType,
				itemData,
				conversationId,
			})
			.returning();

		return NextResponse.json({
			success: true,
			data: savedItem,
		});
	} catch (error) {
		console.error("❌ Error saving item:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to save item",
			},
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/saved-items
 * Remove a saved item
 *
 * Request body:
 * {
 *   id: number
 * }
 */
export async function DELETE(req: NextRequest) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { id } = body;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "id is required" },
				{ status: 400 }
			);
		}

		// Delete only if it belongs to the user
		const deleted = await db
			.delete(savedItemsTable)
			.where(
				and(eq(savedItemsTable.id, id), eq(savedItemsTable.userId, userId))
			)
			.returning();

		if (deleted.length === 0) {
			return NextResponse.json(
				{ success: false, error: "Item not found or unauthorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Item removed from saved list",
		});
	} catch (error) {
		console.error("❌ Error deleting saved item:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to delete item",
			},
			{ status: 500 }
		);
	}
}
