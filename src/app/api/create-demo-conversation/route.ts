import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { conversationsTable } from "@/db/schema";

export async function POST() {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Create a demo conversation for testing
		const demoConversation = {
			userId,
			conversationId: `demo_${Date.now()}`,
			agentId: "demo_agent",
			status: "completed",
			transcript: [
				{
					role: "user",
					message:
						"Hi! I'm a student looking to plan a trip to Europe on a budget of $1500.",
				},
				{
					role: "assistant",
					message:
						"Great choice! Europe has many budget-friendly options for students. I'd recommend considering Eastern European cities like Prague, Budapest, or Krakow. These cities offer rich culture, beautiful architecture, and are very affordable. Would you like specific recommendations for accommodations and activities?",
				},
				{
					role: "user",
					message:
						"Yes! I'm particularly interested in Prague. What can you tell me about it?",
				},
				{
					role: "assistant",
					message:
						"Prague is perfect for student travelers! You can find hostels for $15-25/night, enjoy free walking tours, visit Prague Castle (tickets around $15), and explore the beautiful Old Town Square at no cost. Street food like trdelník is cheap and delicious. I'd budget about $40-50/day including accommodation. For a week-long trip, you'd spend around $350-400, leaving plenty of room in your $1500 budget for flights and other cities!",
				},
			],
			analysis: {
				sentiment: "positive",
				summary:
					"Student planning a European trip with $1500 budget, interested in Prague",
			},
			summary:
				"Student is planning a budget trip to Europe with $1500. Discussed Prague as an affordable destination with hostel accommodations ($15-25/night), free activities, and estimated daily budget of $40-50. Total week-long trip cost estimated at $350-400.",
		};

		await db.insert(conversationsTable).values(demoConversation);

		return NextResponse.json({
			success: true,
			message: "Demo conversation created!",
		});
	} catch (error) {
		console.error("Error creating demo:", error);
		return NextResponse.json(
			{ error: "Failed to create demo conversation" },
			{ status: 500 }
		);
	}
}
