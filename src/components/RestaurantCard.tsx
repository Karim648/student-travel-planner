"use client";

import { Restaurant } from "@/types/recommendations";
import { MapPin, Star, Utensils, Heart } from "lucide-react";
import { useState } from "react";

interface RestaurantCardProps {
	restaurant: Restaurant;
	savedItemId?: number;
	onSave?: (restaurant: Restaurant) => Promise<void>;
	onUnsave?: (savedItemId: number) => Promise<void>;
}

/**
 * RestaurantCard Component
 *
 * Displays a single restaurant recommendation
 * Shows: image, name, description, cuisine, price range, rating, location
 */
export function RestaurantCard({
	restaurant,
	savedItemId,
	onSave,
	onUnsave,
}: RestaurantCardProps) {
	const [isSaved, setIsSaved] = useState(!!savedItemId);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleSave = async () => {
		setIsLoading(true);
		try {
			if (isSaved && savedItemId && onUnsave) {
				await onUnsave(savedItemId);
				setIsSaved(false);
			} else if (!isSaved && onSave) {
				await onSave(restaurant);
				setIsSaved(true);
			}
		} catch (error) {
			console.error("Error toggling save:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md relative">
			{/* Save Heart Icon */}
			<button
				onClick={handleToggleSave}
				disabled={isLoading}
				className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:scale-110 disabled:opacity-50"
				aria-label={isSaved ? "Unsave restaurant" : "Save restaurant"}
			>
				<Heart
					className={`h-5 w-5 transition-colors ${
						isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
					}`}
				/>
			</button>
			{/* Restaurant Image */}
			{restaurant.imageUrl && (
				<div className="aspect-video w-full overflow-hidden bg-gray-100">
					<img
						src={restaurant.imageUrl}
						alt={restaurant.name}
						className="h-full w-full object-cover"
					/>
				</div>
			)}

			{/* Restaurant Content */}
			<div className="p-4">
				{/* Cuisine Badge */}
				<div className="mb-2">
					<span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
						{restaurant.cuisine}
					</span>
				</div>

				{/* Name */}
				<h3 className="mb-2 text-lg font-semibold text-gray-900">
					{restaurant.name}
				</h3>

				{/* Description */}
				<p className="mb-4 text-sm text-gray-600 line-clamp-2">
					{restaurant.description}
				</p>

				{/* Details Row */}
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-4">
						{/* Rating */}
						{restaurant.rating && (
							<div className="flex items-center gap-1 text-yellow-600">
								<Star className="h-4 w-4 fill-current" />
								<span className="font-medium">{restaurant.rating}</span>
							</div>
						)}

						{/* Location */}
						{restaurant.location && (
							<div className="flex items-center gap-1 text-gray-600">
								<MapPin className="h-4 w-4" />
								<span>{restaurant.location}</span>
							</div>
						)}
					</div>

					{/* Price Range */}
					<div className="flex items-center gap-1 text-green-600">
						<Utensils className="h-4 w-4" />
						<span className="font-semibold">{restaurant.priceRange}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
