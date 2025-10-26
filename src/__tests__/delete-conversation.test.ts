/**
 * Delete Conversation Tests
 *
 * Tests the DELETE /api/conversations/[id] endpoint
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { DELETE } from "@/app/api/conversations/[id]/route";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Mock modules
jest.mock("@clerk/nextjs/server");
jest.mock("@/db", () => ({
	db: {
		delete: jest.fn(),
	},
}));

describe("DELETE /api/conversations/[id]", () => {
	let mockRequest: Request;
	const mockUserId = "user_test123";
	const mockConversationId = "42";

	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest = new Request("http://localhost:3000/api/conversations/42", {
			method: "DELETE",
		});
	});

	it("should delete a conversation successfully", async () => {
		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

		// Mock database delete
		const mockDeleteChain = {
			where: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([
				{
					id: 42,
					userId: mockUserId,
					conversationId: "conv_123",
					agentId: "agent_456",
					status: "completed",
					transcript: null,
					analysis: null,
					summary: "Test conversation",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]),
		};

		(db.delete as jest.Mock).mockReturnValue(mockDeleteChain);

		// Call the DELETE handler
		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: mockConversationId }),
		});

		// Assert response
		expect(response).toBeInstanceOf(NextResponse);
		const data = await response.json();
		expect(data).toEqual({
			success: true,
			message: "Conversation deleted successfully",
		});

		// Verify database was called correctly
		expect(db.delete).toHaveBeenCalledWith(conversationsTable);
		expect(mockDeleteChain.where).toHaveBeenCalledWith(
			and(
				eq(conversationsTable.id, 42),
				eq(conversationsTable.userId, mockUserId)
			)
		);
	});

	it("should return 401 if user is not authenticated", async () => {
		// Mock unauthenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: null });

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: mockConversationId }),
		});

		expect(response.status).toBe(401);
		const data = await response.json();
		expect(data).toEqual({ error: "Unauthorized" });
	});

	it("should return 400 for invalid conversation ID", async () => {
		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: "invalid" }),
		});

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data).toEqual({ error: "Invalid conversation ID" });
	});

	it("should return 404 if conversation not found or unauthorized", async () => {
		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

		// Mock database delete returning empty array (no conversation found)
		const mockDeleteChain = {
			where: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([]),
		};

		(db.delete as jest.Mock).mockReturnValue(mockDeleteChain);

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: mockConversationId }),
		});

		expect(response.status).toBe(404);
		const data = await response.json();
		expect(data).toEqual({
			error: "Conversation not found or unauthorized",
		});
	});

	it("should only delete conversations belonging to the current user", async () => {
		const currentUserId = "user_123";
		const conversationId = 42;

		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: currentUserId });

		// Mock database delete
		const mockDeleteChain = {
			where: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([
				{
					id: conversationId,
					userId: currentUserId,
					conversationId: "conv_123",
					agentId: "agent_456",
					status: "completed",
					transcript: null,
					analysis: null,
					summary: "Test conversation",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]),
		};

		(db.delete as jest.Mock).mockReturnValue(mockDeleteChain);

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: conversationId.toString() }),
		});

		// Verify the where clause includes both conversation ID and user ID
		expect(mockDeleteChain.where).toHaveBeenCalledWith(
			and(
				eq(conversationsTable.id, conversationId),
				eq(conversationsTable.userId, currentUserId)
			)
		);

		const data = await response.json();
		expect(data.success).toBe(true);
	});

	it("should return 500 on database error", async () => {
		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

		// Mock database error
		const mockDeleteChain = {
			where: jest.fn().mockReturnThis(),
			returning: jest.fn().mockRejectedValue(new Error("Database error")),
		};

		(db.delete as jest.Mock).mockReturnValue(mockDeleteChain);

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: mockConversationId }),
		});

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data).toEqual({ error: "Failed to delete conversation" });
	});

	it("should handle numeric conversation IDs correctly", async () => {
		// Mock authenticated user
		(auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

		// Mock database delete
		const mockDeleteChain = {
			where: jest.fn().mockReturnThis(),
			returning: jest.fn().mockResolvedValue([
				{
					id: 999,
					userId: mockUserId,
					conversationId: "conv_999",
					agentId: "agent_999",
					status: "completed",
					transcript: null,
					analysis: null,
					summary: "Numeric ID test",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]),
		};

		(db.delete as jest.Mock).mockReturnValue(mockDeleteChain);

		const response = await DELETE(mockRequest, {
			params: Promise.resolve({ id: "999" }),
		});

		// Verify the ID was parsed correctly
		expect(mockDeleteChain.where).toHaveBeenCalledWith(
			and(
				eq(conversationsTable.id, 999),
				eq(conversationsTable.userId, mockUserId)
			)
		);

		const data = await response.json();
		expect(data.success).toBe(true);
	});
});
