"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { HotelCard } from "@/components/HotelCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Activity, Hotel, Restaurant } from "@/types/recommendations";
import {
	Loader2,
	AlertCircle,
	Heart,
	ListFilter,
	MessageSquarePlus,
	LayoutDashboard,
} from "lucide-react";

interface SavedItem {
	id: number;
	userId: string;
	itemType: "activity" | "hotel" | "restaurant";
	itemData: Activity | Hotel | Restaurant;
	conversationId: string | null;
	createdAt: string;
}

export default function SavedItemsPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
	const [filter, setFilter] = useState<
		"all" | "activity" | "hotel" | "restaurant"
	>("all");

	useEffect(() => {
		fetchSavedItems();
	}, []);

	const fetchSavedItems = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/saved-items");
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Failed to fetch saved items");
			}

			setSavedItems(data.data || []);
		} catch (err) {
			console.error("Error fetching saved items:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load saved items"
			);
		} finally {
			setLoading(false);
		}
	};

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

			// Remove from local state
			setSavedItems((prev) => prev.filter((item) => item.id !== savedItemId));
		} catch (err) {
			console.error("Error removing item:", err);
			throw err;
		}
	};

	const filteredItems =
		filter === "all"
			? savedItems
			: savedItems.filter((item) => item.itemType === filter);

	const stats = {
		total: savedItems.length,
		activities: savedItems.filter((item) => item.itemType === "activity")
			.length,
		hotels: savedItems.filter((item) => item.itemType === "hotel").length,
		restaurants: savedItems.filter((item) => item.itemType === "restaurant")
			.length,
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="mx-auto max-w-7xl">
				{/* Header with Navigation */}
				<div className="mb-8">
					<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
						<div>
							<div className="flex items-center gap-3">
								<Heart className="h-8 w-8 fill-red-500 text-red-500" />
								<h1 className="text-4xl font-bold text-gray-900">
									Saved Items
								</h1>
							</div>
							<p className="mt-2 text-gray-600">
								Your favorite activities, hotels, and restaurants
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								onClick={() => router.push("/dashboard")}
								variant="outline"
								size="lg"
							>
								<LayoutDashboard className="mr-2 h-4 w-4" />
								Dashboard
							</Button>
							<Button
								onClick={() => router.push("/conversation")}
								size="lg"
								className="bg-blue-600 hover:bg-blue-700"
							>
								<MessageSquarePlus className="mr-2 h-4 w-4" />
								New Chat
							</Button>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-4 gap-4">
						<div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
							<div className="text-2xl font-bold text-gray-900">
								{stats.total}
							</div>
							<div className="text-sm text-gray-600">Total Saved</div>
						</div>
						<div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
							<div className="text-2xl font-bold text-blue-600">
								{stats.activities}
							</div>
							<div className="text-sm text-gray-600">Activities</div>
						</div>
						<div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
							<div className="text-2xl font-bold text-green-600">
								{stats.hotels}
							</div>
							<div className="text-sm text-gray-600">Hotels</div>
						</div>
						<div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
							<div className="text-2xl font-bold text-orange-600">
								{stats.restaurants}
							</div>
							<div className="text-sm text-gray-600">Restaurants</div>
						</div>
					</div>

					{/* Filters */}
					<div className="mt-6 flex items-center gap-3">
						<ListFilter className="h-5 w-5 text-gray-600" />
						<div className="flex gap-2">
							<Button
								variant={filter === "all" ? "default" : "outline"}
								onClick={() => setFilter("all")}
								size="sm"
							>
								All ({stats.total})
							</Button>
							<Button
								variant={filter === "activity" ? "default" : "outline"}
								onClick={() => setFilter("activity")}
								size="sm"
							>
								Activities ({stats.activities})
							</Button>
							<Button
								variant={filter === "hotel" ? "default" : "outline"}
								onClick={() => setFilter("hotel")}
								size="sm"
							>
								Hotels ({stats.hotels})
							</Button>
							<Button
								variant={filter === "restaurant" ? "default" : "outline"}
								onClick={() => setFilter("restaurant")}
								size="sm"
							>
								Restaurants ({stats.restaurants})
							</Button>
						</div>
					</div>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex items-center justify-center py-12">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 animate-spin text-blue-600" />
							<p className="text-lg text-gray-600">
								Loading your saved items...
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
									onClick={fetchSavedItems}
									variant="outline"
									className="mt-4"
								>
									Try Again
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Empty State */}
				{!loading && !error && filteredItems.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16">
						<Heart className="h-16 w-16 text-gray-300 mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No saved items yet
						</h3>
						<p className="text-gray-600 mb-6">
							Start saving your favorite activities, hotels, and restaurants!
						</p>
						<Button onClick={() => router.push("/recommendations")}>
							Browse Recommendations
						</Button>
					</div>
				)}

				{/* Saved Items Grid */}
				{!loading && !error && filteredItems.length > 0 && (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredItems.map((item) => {
							if (item.itemType === "activity") {
								return (
									<ActivityCard
										key={item.id}
										activity={item.itemData as Activity}
										savedItemId={item.id}
										onUnsave={handleUnsaveItem}
									/>
								);
							} else if (item.itemType === "hotel") {
								return (
									<HotelCard
										key={item.id}
										hotel={item.itemData as Hotel}
										savedItemId={item.id}
										onUnsave={handleUnsaveItem}
									/>
								);
							} else if (item.itemType === "restaurant") {
								return (
									<RestaurantCard
										key={item.id}
										restaurant={item.itemData as Restaurant}
										savedItemId={item.id}
										onUnsave={handleUnsaveItem}
									/>
								);
							}
							return null;
						})}
					</div>
				)}
			</div>
		</div>
	);
}
