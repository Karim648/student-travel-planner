import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	// Get the headers
	const headerPayload = await headers();
	const svixId = headerPayload.get("svix-id");
	const svixTimestamp = headerPayload.get("svix-timestamp");
	const svixSignature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svixId || !svixTimestamp || !svixSignature) {
		return NextResponse.json(
			{ error: "Missing svix headers" },
			{ status: 400 }
		);
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Get the webhook secret from environment variables
	const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

	if (!webhookSecret) {
		return NextResponse.json(
			{ error: "Webhook secret not configured" },
			{ status: 500 }
		);
	}

	// Create a new Svix instance with your webhook secret
	const wh = new Webhook(webhookSecret);

	let evt: WebhookEvent;

	// Verify the webhook
	try {
		evt = wh.verify(body, {
			"svix-id": svixId,
			"svix-timestamp": svixTimestamp,
			"svix-signature": svixSignature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return NextResponse.json(
			{ error: "Invalid webhook signature" },
			{ status: 400 }
		);
	}

	// Handle the webhook
	const eventType = evt.type;

	console.log(`Clerk webhook received: ${eventType}`);

	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, email_addresses, first_name, last_name, image_url } = evt.data;

		const email = email_addresses[0]?.email_address || "";

		try {
			// Check if user already exists
			const existingUser = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.clerkId, id))
				.limit(1);

			if (existingUser.length > 0) {
				// Update existing user
				await db
					.update(usersTable)
					.set({
						email,
						firstName: first_name || null,
						lastName: last_name || null,
						imageUrl: image_url || null,
						updatedAt: new Date(),
					})
					.where(eq(usersTable.clerkId, id));

				console.log(`User updated: ${id}`);
			} else {
				// Create new user
				await db.insert(usersTable).values({
					clerkId: id,
					email,
					firstName: first_name || null,
					lastName: last_name || null,
					imageUrl: image_url || null,
				});

				console.log(`User created: ${id}`);
			}
		} catch (error) {
			console.error("Error syncing user to database:", error);
			return NextResponse.json(
				{ error: "Failed to sync user" },
				{ status: 500 }
			);
		}
	}

	if (eventType === "user.deleted") {
		const { id } = evt.data;

		try {
			await db.delete(usersTable).where(eq(usersTable.clerkId, id!));
			console.log(`User deleted: ${id}`);
		} catch (error) {
			console.error("Error deleting user from database:", error);
			return NextResponse.json(
				{ error: "Failed to delete user" },
				{ status: 500 }
			);
		}
	}

	return NextResponse.json({ ok: true });
}
