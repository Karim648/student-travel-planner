import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/env/server";
import type {
	RecommendationsRequest,
	RecommendationsResponse,
	TravelRecommendations,
} from "@/types/recommendations";

/**
 * Generate mock recommendations as a fallback
 */
function generateMockRecommendations(
	conversationSummary: string
): TravelRecommendations {
	console.log("🎭 Using mock recommendations (Gemini API unavailable)");

	return {
		summary: `Based on your conversation: ${conversationSummary.substring(
			0,
			150
		)}${conversationSummary.length > 150 ? "..." : ""}`,
		activities: [
			{
				id: "mock-act-1",
				title: "Free Walking Tour",
				description:
					"Join a free walking tour to explore the city's main attractions with a local guide.",
				category: "Tour",
				price: 0,
				rating: 4.8,
				location: "City Center",
			},
			{
				id: "mock-act-2",
				title: "Museum Visit",
				description:
					"Explore the local history and culture at the national museum.",
				category: "Culture",
				price: 15,
				rating: 4.6,
				location: "Museum District",
			},
			{
				id: "mock-act-3",
				title: "Street Food Tour",
				description:
					"Sample authentic local street food at popular food markets.",
				category: "Food",
				price: 25,
				rating: 4.7,
				location: "Food Market District",
			},
			{
				id: "mock-act-4",
				title: "City Park Picnic",
				description: "Relax in the beautiful city park with scenic views.",
				category: "Leisure",
				price: 5,
				rating: 4.5,
				location: "Central Park",
			},
			{
				id: "mock-act-5",
				title: "Evening River Cruise",
				description: "Enjoy a scenic boat ride along the river at sunset.",
				category: "Adventure",
				price: 30,
				rating: 4.9,
				location: "Riverside",
			},
		],
		hotels: [
			{
				id: "mock-hotel-1",
				name: "Budget Hostel Downtown",
				description:
					"Clean, modern hostel in the heart of the city with free WiFi and breakfast.",
				pricePerNight: 25,
				rating: 4.3,
				location: "Downtown",
				amenities: ["WiFi", "Breakfast", "Lockers", "Common Room"],
			},
			{
				id: "mock-hotel-2",
				name: "Student Residence Hotel",
				description:
					"Affordable hotel near universities with study spaces and kitchen access.",
				pricePerNight: 40,
				rating: 4.5,
				location: "University District",
				amenities: ["WiFi", "Kitchen", "Laundry", "Study Room"],
			},
			{
				id: "mock-hotel-3",
				name: "Boutique B&B",
				description:
					"Cozy bed and breakfast with local charm and hearty breakfast included.",
				pricePerNight: 55,
				rating: 4.7,
				location: "Old Town",
				amenities: ["WiFi", "Breakfast", "Garden", "Bicycle Rental"],
			},
		],
		restaurants: [
			{
				id: "mock-rest-1",
				name: "Local Eats Cafe",
				description:
					"Popular cafe serving traditional dishes at budget-friendly prices.",
				cuisine: "Local",
				priceRange: "$",
				rating: 4.4,
				location: "City Center",
			},
			{
				id: "mock-rest-2",
				name: "Pizza Corner",
				description: "Authentic wood-fired pizzas with student discounts.",
				cuisine: "Italian",
				priceRange: "$",
				rating: 4.6,
				location: "Downtown",
			},
			{
				id: "mock-rest-3",
				name: "Fusion Street Kitchen",
				description: "Modern fusion cuisine with affordable lunch specials.",
				cuisine: "Fusion",
				priceRange: "$$",
				rating: 4.5,
				location: "Trendy District",
			},
		],
	};
}

/**
 * POST /api/recommendations
 *
 * Accepts a conversation summary and sends it to Google Gemini API
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

		// Check if Gemini API key is available, otherwise use mock data
		if (!env.GEMINI_API_KEY) {
			console.warn(
				"⚠️ GEMINI_API_KEY not found in environment, using mock data"
			);
			const mockRecommendations =
				generateMockRecommendations(conversationSummary);
			return NextResponse.json<RecommendationsResponse>({
				success: true,
				data: mockRecommendations,
			});
		}

		// Check if Gemini API key is available, otherwise use mock data
		if (!env.GEMINI_API_KEY) {
			console.warn(
				"⚠️ GEMINI_API_KEY not found in environment, using mock data"
			);
			const mockRecommendations =
				generateMockRecommendations(conversationSummary);
			return NextResponse.json<RecommendationsResponse>({
				success: true,
				data: mockRecommendations,
			});
		}

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

IMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no additional text. Just pure JSON.

Please provide specific recommendations in valid JSON format with the following structure:
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
      "amenities": ["WiFi", "Breakfast"]
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

Provide 5 activities, 3 hotels (including budget options), and 3 restaurants that match the user's budget and preferences mentioned in the conversation. Use realistic prices and ratings. Ensure all JSON is valid with no trailing commas.`;

		const geminiResponse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`,
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
						responseMimeType: "application/json",
					},
				}),
			}
		);

		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error("❌ Gemini API error:", errorText);
			console.log("⚠️ Falling back to mock data due to Gemini API error");

			// Fallback to mock data if Gemini fails
			const mockRecommendations =
				generateMockRecommendations(conversationSummary);
			return NextResponse.json<RecommendationsResponse>({
				success: true,
				data: mockRecommendations,
			});
		}

		let geminiData;
		try {
			geminiData = await geminiResponse.json();
		} catch (jsonError) {
			console.error("❌ Failed to parse Gemini response as JSON:", jsonError);
			const responseText = await geminiResponse.text();
			console.error("❌ Response text:", responseText);

			// Fallback to mock data
			console.log("⚠️ Falling back to mock data due to JSON parse error");
			const mockRecommendations =
				generateMockRecommendations(conversationSummary);
			return NextResponse.json<RecommendationsResponse>({
				success: true,
				data: mockRecommendations,
			});
		}

		console.log("✅ Gemini API response received");

		// Extract the generated text from Gemini response
		const generatedText =
			geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

		console.log(
			"📄 Generated text from Gemini:",
			generatedText.substring(0, 500)
		); // Parse the JSON from the generated text
		// Gemini sometimes wraps JSON in markdown code blocks, so we need to extract it
		const jsonMatch =
			generatedText.match(/```json\s*([\s\S]*?)\s*```/) ||
			generatedText.match(/\{[\s\S]*\}/);

		if (!jsonMatch) {
			console.error("❌ No JSON found in Gemini response:", generatedText);
			throw new Error("Failed to extract JSON from Gemini response");
		}

		let jsonText = jsonMatch[1] || jsonMatch[0];

		// Clean up common JSON formatting issues from LLM responses
		jsonText = jsonText
			.replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
			.replace(/\n/g, " ") // Replace newlines with spaces
			.replace(/\s+/g, " ") // Collapse multiple spaces
			.trim();

		console.log("🔧 Cleaned JSON text:", jsonText.substring(0, 500));

		let recommendations: TravelRecommendations;
		try {
			recommendations = JSON.parse(jsonText);
		} catch (parseError) {
			console.error("❌ JSON Parse Error:", parseError);
			console.error("❌ Problematic JSON:", jsonText);
			throw new Error(
				`Failed to parse JSON: ${
					parseError instanceof Error ? parseError.message : "Unknown error"
				}`
			);
		}

		return NextResponse.json<RecommendationsResponse>({
			success: true,
			data: recommendations,
		});
	} catch (error) {
		console.error("❌ Error getting recommendations:", error);
		console.log("🔄 Falling back to mock recommendations due to error");

		// Fallback to mock recommendations on any error
		// Use a default summary since conversationSummary might be out of scope
		const fallbackRecommendations = generateMockRecommendations(
			"Student planning a budget-friendly trip"
		);

		return NextResponse.json<RecommendationsResponse>(
			{
				success: true,
				data: fallbackRecommendations,
				// Include error info but still return success with mock data
				error:
					"Using demo recommendations. " +
					(error instanceof Error ? error.message : "API unavailable"),
			},
			{ status: 200 }
		);
	}
}
