"use client";

import { Activity } from "@/types/recommendations";
import { MapPin, Star, DollarSign, Heart } from "lucide-react";
import { useState } from "react";

interface ActivityCardProps {
	activity: Activity;
	savedItemId?: number; // If already saved, pass the saved item ID
	onSave?: (activity: Activity) => Promise<void>;
	onUnsave?: (savedItemId: number) => Promise<void>;
}

/**
 * ActivityCard Component
 *
 * Displays a single activity recommendation
 * Shows: image, title, description, category, price, rating, location
 * Allows saving/unsaving the activity
 */
export function ActivityCard({
	activity,
	savedItemId,
	onSave,
	onUnsave,
}: ActivityCardProps) {
	const [isSaved, setIsSaved] = useState(!!savedItemId);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleSave = async () => {
		setIsLoading(true);
		try {
			if (isSaved && savedItemId && onUnsave) {
				await onUnsave(savedItemId);
				setIsSaved(false);
			} else if (!isSaved && onSave) {
				await onSave(activity);
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
				aria-label={isSaved ? "Unsave activity" : "Save activity"}
			>
				<Heart
					className={`h-5 w-5 transition-colors ${
						isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
					}`}
				/>
			</button>
			{/* Activity Image */}
			{activity.imageUrl && (
				<div className="aspect-video w-full overflow-hidden bg-gray-100">
					<img
						src={activity.imageUrl}
						alt={activity.title}
						className="h-full w-full object-cover"
					/>
				</div>
			)}

			{/* Activity Content */}
			<div className="p-4">
				{/* Category Badge */}
				<div className="mb-2">
					<span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
						{activity.category}
					</span>
				</div>

				{/* Title */}
				<h3 className="mb-2 text-lg font-semibold text-gray-900">
					{activity.title}
				</h3>

				{/* Description */}
				<p className="mb-4 text-sm text-gray-600 line-clamp-2">
					{activity.description}
				</p>

				{/* Details Row */}
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-4">
						{/* Rating */}
						{activity.rating && (
							<div className="flex items-center gap-1 text-yellow-600">
								<Star className="h-4 w-4 fill-current" />
								<span className="font-medium">{activity.rating}</span>
							</div>
						)}

						{/* Location */}
						{activity.location && (
							<div className="flex items-center gap-1 text-gray-600">
								<MapPin className="h-4 w-4" />
								<span>{activity.location}</span>
							</div>
						)}
					</div>

					{/* Price */}
					{activity.price && (
						<div className="flex items-center gap-1 text-green-600">
							<DollarSign className="h-4 w-4" />
							<span className="font-semibold">{activity.price}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
