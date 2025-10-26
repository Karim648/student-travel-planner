import { NextResponse } from "next/server";
import { env } from "@/env/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
	try {
		// Check if user is authenticated
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Verify environment variables are set
		if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_AGENT_ID) {
			console.error("Missing ElevenLabs credentials");
			return NextResponse.json(
				{
					error:
						"ElevenLabs is not configured. Please add ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID to your .env.local file",
				},
				{ status: 500 }
			);
		}

		// Get a signed URL for the conversational AI agent
		//  We pass custom_llm_extra_body with userId which will be included in the webhook payload
		const response = await fetch(
			`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url`,
			{
				method: "POST",
				headers: {
					"xi-api-key": env.ELEVENLABS_API_KEY,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					agent_id: env.ELEVENLABS_AGENT_ID,
					// This will be available in webhook as conversation_initiation_client_data.custom_llm_extra_body
					overrides: {
						custom_llm_extra_body: {
							userId: userId,
						},
					},
				}),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("ElevenLabs API error:", response.status, errorText);
			throw new Error(
				`ElevenLabs API error: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();

		return NextResponse.json({
			success: true,
			signedUrl: data.signed_url,
		});
	} catch (error) {
		console.error("ElevenLabs error:", error);
		return NextResponse.json(
			{ error: "Failed to start call" },
			{ status: 500 }
		);
	}
}
