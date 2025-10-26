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
} from "@/types/recommendations";
import { Loader2, AlertCircle, Home } from "lucide-react";

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

	// Get params from URL
	const conversationId = searchParams.get("conversationId");
	const summaryParam = searchParams.get("summary");

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
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-gray-900">
								Travel Recommendations
							</h1>
							<p className="mt-2 text-gray-600">
								Personalized suggestions based on your conversation
							</p>
						</div>
						<Button
							onClick={() => router.push("/dashboard")}
							variant="outline"
							size="lg"
						>
							<Home className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Button>
					</div>

					{/* Get Recommendations Button - shows if no recommendations yet */}
					{!loading && !recommendations && !error && (
						<Button onClick={handleGetRecommendations} size="lg">
							Get Recommendations
						</Button>
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
											<ActivityCard key={activity.id} activity={activity} />
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
										<HotelCard key={hotel.id} hotel={hotel} />
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
