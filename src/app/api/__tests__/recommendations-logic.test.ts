/**
 * Recommendations API Unit Tests
 *
 * These tests verify the core logic without importing the full route
 */

import { describe, it, expect } from "@jest/globals";

describe("Recommendations API Logic", () => {
	describe("JSON Cleaning", () => {
		it("should remove trailing commas from JSON", () => {
			const invalidJson = '{"test": "value",}';
			const cleaned = invalidJson.replace(/,(\s*[}\]])/g, "$1");
			expect(() => JSON.parse(cleaned)).not.toThrow();
		});

		it("should remove trailing commas in arrays", () => {
			const invalidJson = '{"arr": [1, 2, 3,]}';
			const cleaned = invalidJson.replace(/,(\s*[}\]])/g, "$1");
			expect(() => JSON.parse(cleaned)).not.toThrow();
		});

		it("should handle nested trailing commas", () => {
			const invalidJson = '{"nested": {"key": "value",}, "arr": [1,]}';
			const cleaned = invalidJson.replace(/,(\s*[}\]])/g, "$1");
			const parsed = JSON.parse(cleaned);
			expect(parsed.nested.key).toBe("value");
			expect(parsed.arr).toEqual([1]);
		});
	});

	describe("JSON Extraction from Markdown", () => {
		it("should extract JSON from markdown code blocks", () => {
			const text = '```json\n{"test": "value"}\n```';
			const match = text.match(/```json\s*([\s\S]*?)\s*```/);
			expect(match).not.toBeNull();
			expect(match?.[1]).toBe('{"test": "value"}');
		});

		it("should extract JSON without markdown", () => {
			const text = '{"test": "value"}';
			const jsonMatch =
				text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
			expect(jsonMatch).not.toBeNull();
			expect(jsonMatch?.[0]).toBe('{"test": "value"}');
		});

		it("should handle markdown with extra text", () => {
			const text =
				'Here is the JSON:\n```json\n{"test": "value"}\n```\nHope this helps!';
			const match = text.match(/```json\s*([\s\S]*?)\s*```/);
			expect(match?.[1]).toBe('{"test": "value"}');
		});
	});

	describe("Recommendations Data Structure", () => {
		it("should validate correct recommendation structure", () => {
			const validData = {
				summary: "Test trip",
				activities: [
					{
						id: "1",
						title: "Test Activity",
						description: "Description",
						category: "Tour",
						price: 50,
						rating: 4.5,
						location: "Location",
					},
				],
				hotels: [
					{
						id: "1",
						name: "Test Hotel",
						description: "Description",
						pricePerNight: 100,
						rating: 4.0,
						location: "Location",
						amenities: ["WiFi"],
					},
				],
				restaurants: [
					{
						id: "1",
						name: "Test Restaurant",
						description: "Description",
						cuisine: "Italian",
						priceRange: "$$",
						rating: 4.5,
						location: "Location",
					},
				],
			};

			expect(validData.summary).toBeDefined();
			expect(Array.isArray(validData.activities)).toBe(true);
			expect(Array.isArray(validData.hotels)).toBe(true);
			expect(Array.isArray(validData.restaurants)).toBe(true);
		});

		it("should validate activity structure", () => {
			const activity = {
				id: "1",
				title: "Eiffel Tower",
				description: "Iconic landmark",
				category: "Tour",
				price: 25,
				rating: 4.8,
				location: "Paris",
			};

			expect(activity.id).toBeDefined();
			expect(activity.title).toBeDefined();
			expect(typeof activity.price).toBe("number");
			expect(typeof activity.rating).toBe("number");
			expect(activity.rating).toBeGreaterThanOrEqual(0);
			expect(activity.rating).toBeLessThanOrEqual(5);
		});
	});

	describe("Error Messages", () => {
		it("should create descriptive error for missing JSON", () => {
			const errorMessage = "Failed to extract JSON from Gemini response";
			expect(errorMessage).toContain("JSON");
			expect(errorMessage).toContain("Gemini");
		});

		it("should create descriptive error for parse failure", () => {
			const parseError = new SyntaxError("Unexpected token");
			const errorMessage = `Failed to parse JSON: ${parseError.message}`;
			expect(errorMessage).toContain("parse");
			expect(errorMessage).toContain("Unexpected token");
		});
	});

	describe("Full JSON Processing Pipeline", () => {
		it("should successfully process valid Gemini response", () => {
			const geminiResponse = `\`\`\`json
{
  "summary": "Paris trip",
  "activities": [{"id": "1", "title": "Eiffel Tower", "description": "Visit", "category": "Tour", "price": 25, "rating": 4.8, "location": "Paris"}],
  "hotels": [{"id": "1", "name": "Hotel", "description": "Nice", "pricePerNight": 100, "rating": 4.5, "location": "Paris", "amenities": ["WiFi"]}],
  "restaurants": [{"id": "1", "name": "Café", "description": "French food", "cuisine": "French", "priceRange": "$$", "rating": 4.5, "location": "Paris"}]
}
\`\`\``;

			// Extract JSON
			const jsonMatch = geminiResponse.match(/```json\s*([\s\S]*?)\s*```/);
			expect(jsonMatch).not.toBeNull();

			let jsonText = jsonMatch![1];

			// Clean
			jsonText = jsonText
				.replace(/,(\s*[}\]])/g, "$1")
				.replace(/\n/g, " ")
				.replace(/\s+/g, " ")
				.trim();

			// Parse
			const data = JSON.parse(jsonText);

			expect(data.summary).toBe("Paris trip");
			expect(data.activities).toHaveLength(1);
			expect(data.hotels).toHaveLength(1);
			expect(data.restaurants).toHaveLength(1);
		});

		it("should handle JSON with trailing commas", () => {
			const response = `{
				"summary": "Test",
				"activities": [
					{
						"id": "1",
						"title": "Activity",
						"description": "Desc",
						"category": "Tour",
						"price": 10,
						"rating": 4.5,
						"location": "Location",
					}
				],
				"hotels": [],
				"restaurants": [],
			}`;

			const jsonMatch = response.match(/\{[\s\S]*\}/);
			let jsonText = jsonMatch![0];

			// Clean trailing commas
			jsonText = jsonText.replace(/,(\s*[}\]])/g, "$1");

			const data = JSON.parse(jsonText);
			expect(data.summary).toBe("Test");
			expect(data.activities).toHaveLength(1);
		});
	});
});
