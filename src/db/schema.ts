import {
	integer,
	pgTable,
	varchar,
	text,
	timestamp,
	jsonb,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	clerkId: varchar({ length: 255 }).notNull().unique(), // Clerk user ID
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar({ length: 255 }),
	lastName: varchar({ length: 255 }),
	imageUrl: text(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

export const conversationsTable = pgTable("conversations", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar({ length: 255 }).notNull(), // Clerk user ID
	conversationId: varchar({ length: 255 }).notNull().unique(),
	agentId: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 50 }).notNull(), // 'completed', 'failed', 'in-progress'
	transcript: jsonb(), // Array of conversation messages
	analysis: jsonb(), // Sentiment, summary, etc.
	summary: text(), // Human-readable summary
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

export const savedItemsTable = pgTable("saved_items", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: varchar({ length: 255 }).notNull(), // Clerk user ID
	itemType: varchar({ length: 50 }).notNull(), // 'activity', 'hotel', 'restaurant'
	itemData: jsonb().notNull(), // Full item data (title, description, price, etc.)
	conversationId: varchar({ length: 255 }), // Optional: link to the conversation where it was found
	createdAt: timestamp().defaultNow().notNull(),
});
