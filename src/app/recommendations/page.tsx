"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { HotelCard } from "@/components/HotelCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import type {
	TravelRecommendations,
	RecommendationsResponse,
	Activity,
	Hotel,
	Restaurant,
} from "@/types/recommendations";
import {
	Loader2,
	AlertCircle,
	ArrowLeft,
	Heart,
	MessageSquarePlus,
	Search,
	Calendar,
	SlidersHorizontal,
} from "lucide-react";

/**
 * Recommendations Page Content Component
 * Separated to wrap in Suspense boundary for useSearchParams()
 */
function RecommendationsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [recommendations, setRecommendations] =
		useState<TravelRecommendations | null>(null);

	// UI-only filter state
	const [destination, setDestination] = useState<string>("");
	const [dateRange, setDateRange] = useState<string>("Any dates");
	const [priceMax, setPriceMax] = useState<number>(500);
	const [experiences, setExperiences] = useState<string[]>([]);

	const toggleExperience = (exp: string) => {
		setExperiences((prev) =>
			prev.includes(exp) ? prev.filter((p) => p !== exp) : [...prev, exp]
		);
	};

	const clearAllFilters = () => {
		setDestination("");
		setDateRange("Any dates");
		setPriceMax(500);
		setExperiences([]);
	};

	// Get params from URL
	const conversationId = searchParams.get("conversationId");
	const summaryParam = searchParams.get("summary");

	/**
	 * Save an item to the user's saved list
	 */
	const handleSaveItem = async (
		itemType: "activity" | "hotel" | "restaurant",
		itemData: Activity | Hotel | Restaurant
	) => {
		try {
			const response = await fetch("/api/saved-items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					itemType,
					itemData,
					conversationId: conversationId || undefined,
				}),
			});

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Failed to save item");
			}

			console.log("✅ Item saved successfully");
		} catch (err) {
			console.error("Error saving item:", err);
			throw err;
		}
	};

	/**
	 * Remove an item from the user's saved list
	 */
	const handleUnsaveItem = async (savedItemId: number) => {
		try {
			const response = await fetch("/api/saved-items", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: savedItemId,
				}),
			});

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Failed to remove item");
			}

			console.log("✅ Item removed successfully");
		} catch (err) {
			console.error("Error removing item:", err);
			throw err;
		}
	};

	/**
	 * Fetch recommendations from our API
	 * This calls /api/recommendations which in turn calls Snowflake
	 */
	const fetchRecommendations = async (summary: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/recommendations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					conversationSummary: summary,
					conversationId: conversationId || undefined,
				}),
			});

			const data: RecommendationsResponse = await response.json();

			if (!data.success || !data.data) {
				throw new Error(data.error || "Failed to get recommendations");
			}

			setRecommendations(data.data);
		} catch (err) {
			console.error("Error fetching recommendations:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load recommendations"
			);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handle the "Get Recommendations" button click
	 * In a real scenario, you might get the summary from the conversation API first
	 */
	const handleGetRecommendations = () => {
		// If we have a summary in URL params, use it directly
		if (summaryParam) {
			fetchRecommendations(summaryParam);
			return;
		}

		// Otherwise, use a default summary for demo
		// In production, you would fetch the actual conversation summary here
		const defaultSummary =
			"User wants to travel to Paris with a budget of $1500 for activities and accommodation";
		fetchRecommendations(defaultSummary);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="mx-auto max-w-7xl">
				{/* Header with Navigation */}
				<div className="mb-8">
					<div className="mb-4">
						<div>
							<h1 className="text-4xl font-bold text-gray-900">
								Travel Recommendations
							</h1>
							<p className="mt-2 text-gray-600">
								Personalized suggestions based on your conversation
							</p>
						</div>

						{/* Search + Filters (UI only) */}
						<div className="mt-6 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
							<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div className="flex flex-1 items-center gap-3">
									<Search className="h-5 w-5 text-gray-500" />
									<input
										type="text"
										placeholder="Destination (city, region, or country)"
										value={destination}
										onChange={(e) => setDestination(e.target.value)}
										className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200"
									/>
								</div>

								<div className="mt-3 flex items-center gap-3 md:mt-0">
									<button className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm" onClick={() => setDateRange("Select dates") }>
										<Calendar className="h-4 w-4 text-gray-600" />
										{dateRange}
									</button>
									<div className="flex items-center gap-2">
										<label className="text-sm text-gray-600">Max price</label>
										<input 
											type="range" 
											min={0} 
											max={2000} 
											value={priceMax} 
											onChange={(e)=>setPriceMax(Number(e.target.value))} 
											className="h-1 w-36 accent-black appearance-none bg-gray-200 rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black cursor-pointer" 
										/>
										<span className="ml-2 text-sm text-gray-700">${priceMax}</span>
									</div>
								</div>
							</div>

							{/* Experience chips + Clear */}
							<div className="mt-4 flex flex-wrap items-center gap-2">
								<button className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#DDF95C]">
									<SlidersHorizontal className="h-4 w-4 text-black" />
								</button>
								{["All","Eats","Nature","Workshops","Music","Sports","Culture" ].map((c) => (
									<button key={c} onClick={() => toggleExperience(c.toLowerCase())} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${experiences.includes(c.toLowerCase()) ? "bg-[#DDF95C] text-black" : "bg-white border border-gray-200 text-[#626772]"}`}>
										{c}
									</button>
								))}
								<button onClick={clearAllFilters} className="ml-auto text-sm text-gray-500 underline">Clear All</button>
							</div>
						</div>
					</div>

					{/* Get Recommendations button removed — replaced by floating FAB (chat icon) */}
					{/* Floating Get Recommendations FAB (matches saved page style) - shows when no recommendations yet */}
					{!loading && !recommendations && !error && (
						<button
							aria-label="Get Recommendations"
							onClick={handleGetRecommendations}
							className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 inline-flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#DDF95C] shadow-lg ring-2 ring-black"
						>
							{/* chatbox SVG to trigger recommendations */}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" className="h-16 w-16">
								<rect x="3" y="3" width="18" height="14" rx="2" />
								<path d="M8 21l3-3h6" />
							</svg>
						</button>
					)}
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex items-center justify-center py-12">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 animate-spin text-blue-600" />
							<p className="text-lg text-gray-600">
								Generating your personalized recommendations...
							</p>
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 p-6">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-6 w-6 text-red-600" />
							<div>
								<h3 className="font-semibold text-red-900">Error</h3>
								<p className="mt-1 text-red-700">{error}</p>
								<Button
									onClick={handleGetRecommendations}
									variant="outline"
									className="mt-4"
								>
									Try Again
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Recommendations Content */}
				{!loading && recommendations && (
					<div className="space-y-12">
						{/* Summary */}
						{recommendations.summary && (
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
								<h2 className="mb-2 text-lg font-semibold text-blue-900">
									About Your Trip
								</h2>
								<p className="text-blue-800">{recommendations.summary}</p>
							</div>
						)}

						{/* Floating New Chat FAB (120x120) - moved left to avoid overlap with Get Recommendations FAB */}
						<button
							aria-label="New Chat"
							onClick={() => router.push("/conversation")}
							className="fixed bottom-6 right-[160px] md:bottom-8 md:right-[200px] z-50 inline-flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#DDF95C] shadow-lg ring-2 ring-black"
						>
							{/* inline black-lined chatbox SVG */}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" className="h-16 w-16">
								<rect x="3" y="3" width="18" height="14" rx="2" />
								<path d="M8 21l3-3h6" />
							</svg>
						</button>

						{/* Activities Section */}
						{recommendations.activities &&
							recommendations.activities.length > 0 && (
								<div>
									<h2 className="mb-6 text-2xl font-bold text-gray-900">
										Recommended Activities
										<span className="ml-3 text-sm font-normal text-gray-500">
											({recommendations.activities.length} suggestions)
										</span>
									</h2>
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{recommendations.activities.map((activity) => (
											<ActivityCard
												key={activity.id}
												activity={activity}
												onSave={async (item) =>
													handleSaveItem("activity", item)
												}
												onUnsave={handleUnsaveItem}
											/>
										))}
									</div>
								</div>
							)}

						{/* Hotels Section */}
						{recommendations.hotels && recommendations.hotels.length > 0 && (
							<div>
								<h2 className="mb-6 text-2xl font-bold text-gray-900">
									Recommended Hotels
									<span className="ml-3 text-sm font-normal text-gray-500">
										({recommendations.hotels.length} options)
									</span>
								</h2>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{recommendations.hotels.map((hotel) => (
										<HotelCard
											key={hotel.id}
											hotel={hotel}
											onSave={async (item) => handleSaveItem("hotel", item)}
											onUnsave={handleUnsaveItem}
										/>
									))}
								</div>
							</div>
						)}

						{/* Restaurants Section */}
						{recommendations.restaurants &&
							recommendations.restaurants.length > 0 && (
								<div>
									<h2 className="mb-6 text-2xl font-bold text-gray-900">
										Recommended Restaurants
										<span className="ml-3 text-sm font-normal text-gray-500">
											({recommendations.restaurants.length} places)
										</span>
									</h2>
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{recommendations.restaurants.map((restaurant) => (
											<RestaurantCard
												key={restaurant.id}
												restaurant={restaurant}
												onSave={async (item) =>
													handleSaveItem("restaurant", item)
												}
												onUnsave={handleUnsaveItem}
											/>
										))}
									</div>
								</div>
							)}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Recommendations Page
 *
 * This page:
 * 1. Accepts a conversationId or summary via URL params
 * 2. Calls the /api/recommendations endpoint
 * 3. Displays the results in a grid layout with different card components
 *
 * URL params:
 * - conversationId: ID of the conversation to get recommendations for
 * - summary: Direct conversation summary text (alternative to conversationId)
 *
 * Wrapped in Suspense boundary to handle useSearchParams() correctly
 */
export default function RecommendationsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-gray-50">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="h-12 w-12 animate-spin text-blue-600" />
						<p className="text-lg text-gray-600">Loading recommendations...</p>
					</div>
				</div>
			}
		>
			<RecommendationsContent />
		</Suspense>
	);
}
