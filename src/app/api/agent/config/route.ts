import { NextResponse } from "next/server";
import { env } from "@/env/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Get the current user's information
	const user = await currentUser();

	// Extract the user's first name, or use a default
	const userName = user?.firstName || user?.username || "there";

	return NextResponse.json({
		agentId: env.ELEVENLABS_AGENT_ID,
		userName,
		userId, // Include userId so we can pass it to the widget
	});
}
