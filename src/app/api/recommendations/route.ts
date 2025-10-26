import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/env/server";
import type {
	RecommendationsRequest,
	RecommendationsResponse,
	TravelRecommendations,
} from "@/types/recommendations";

/**
 * POST /api/recommendations
 *
 * Accepts a conversation summary and sends it to Snowflake API
 * for travel recommendations (activities, hotels, restaurants)
 *
 * Request body:
 * {
 *   conversationSummary: string,
 *   userId?: string,
 *   conversationId?: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data?: TravelRecommendations,
 *   error?: string
 * }
 */
export async function POST(req: NextRequest) {
	try {
		// Authenticate the user
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse the request body
		const body: RecommendationsRequest = await req.json();
		const { conversationSummary } = body;

		if (!conversationSummary) {
			return NextResponse.json(
				{ success: false, error: "Conversation summary is required" },
				{ status: 400 }
			);
		}

		console.log("📝 Getting recommendations for summary:", conversationSummary);

		/**
		 * Call Google Gemini API to generate personalized recommendations
		 * based on the ElevenLabs conversation summary
		 *
		 * Gemini will analyze:
		 * - Destination mentioned in conversation
		 * - Budget discussed with the user
		 * - Activities/interests mentioned
		 * - Travel preferences
		 */
		const prompt = `You are a travel expert assistant. Based on this conversation summary from a student travel planning session, generate personalized travel recommendations.

Conversation Summary: "${conversationSummary}"

Please provide specific recommendations in JSON format with the following structure:
{
  "summary": "A brief overview of the trip plan",
  "activities": [
    {
      "id": "unique_id",
      "title": "Activity name",
      "description": "Detailed description",
      "category": "Tour/Culture/Food/Adventure/etc",
      "price": estimated_price_in_usd,
      "rating": 4.5,
      "location": "Specific location"
    }
  ],
  "hotels": [
    {
      "id": "unique_id",
      "name": "Hotel name",
      "description": "Hotel description",
      "pricePerNight": price_in_usd,
      "rating": 4.5,
      "location": "Area/neighborhood",
      "amenities": ["WiFi", "Breakfast", etc]
    }
  ],
  "restaurants": [
    {
      "id": "unique_id",
      "name": "Restaurant name",
      "description": "Restaurant description",
      "cuisine": "Cuisine type",
      "priceRange": "$/$$/$$$",
      "rating": 4.5,
      "location": "Area"
    }
  ]
}

Provide 5 activities, 3 hotels (including budget options), and 3 restaurants that match the user's budget and preferences mentioned in the conversation. Use realistic prices and ratings.`;

		const geminiResponse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
					generationConfig: {
						temperature: 0.7,
						topK: 40,
						topP: 0.95,
						maxOutputTokens: 2048,
					},
				}),
			}
		);

		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error("❌ Gemini API error:", errorText);
			throw new Error(
				`Gemini API returned ${geminiResponse.status}: ${errorText}`
			);
		}

		const geminiData = await geminiResponse.json();
		console.log("✅ Gemini API response received");

		// Extract the generated text from Gemini response
		const generatedText =
			geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

		// Parse the JSON from the generated text
		// Gemini sometimes wraps JSON in markdown code blocks, so we need to extract it
		const jsonMatch =
			generatedText.match(/```json\s*([\s\S]*?)\s*```/) ||
			generatedText.match(/\{[\s\S]*\}/);

		if (!jsonMatch) {
			throw new Error("Failed to extract JSON from Gemini response");
		}

		const jsonText = jsonMatch[1] || jsonMatch[0];
		const recommendations: TravelRecommendations = JSON.parse(jsonText);

		return NextResponse.json<RecommendationsResponse>({
			success: true,
			data: recommendations,
		});
	} catch (error) {
		console.error("❌ Error getting recommendations:", error);
		return NextResponse.json<RecommendationsResponse>(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to get recommendations",
			},
			{ status: 500 }
		);
	}
}
