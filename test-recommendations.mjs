#!/usr/bin/env node

/**
 * Quick test script for the recommendations API
 * Run with: node test-recommendations.mjs
 */

const conversationSummary =
	"Student planning a budget trip to Paris with $1500 for 5 days";

async function testRecommendations() {
	console.log("🧪 Testing Recommendations API...\n");
	console.log("Summary:", conversationSummary, "\n");

	try {
		const response = await fetch("http://localhost:3000/api/recommendations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				conversationSummary,
			}),
		});

		console.log("Status:", response.status);

		const data = await response.json();

		console.log("\n✅ Response received:");
		console.log("Success:", data.success);

		if (data.error) {
			console.log("⚠️ Error:", data.error);
		}

		if (data.data) {
			console.log("\n📊 Recommendations:");
			console.log("Summary:", data.data.summary);
			console.log("Activities:", data.data.activities?.length || 0);
			console.log("Hotels:", data.data.hotels?.length || 0);
			console.log("Restaurants:", data.data.restaurants?.length || 0);

			if (data.data.activities?.length > 0) {
				console.log("\nFirst Activity:");
				console.log(" -", data.data.activities[0].title);
				console.log(" -", data.data.activities[0].description);
				console.log(" - Price: $" + data.data.activities[0].price);
			}
		}
	} catch (error) {
		console.error("❌ Test failed:", error.message);
	}
}

testRecommendations();
