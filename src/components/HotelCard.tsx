"use client";

import { Hotel } from "@/types/recommendations";
import { MapPin, Star, DollarSign, CheckCircle, Heart } from "lucide-react";
import { useState } from "react";

interface HotelCardProps {
	hotel: Hotel;
	savedItemId?: number;
	onSave?: (hotel: Hotel) => Promise<void>;
	onUnsave?: (savedItemId: number) => Promise<void>;
}

/**
 * HotelCard Component
 *
 * Displays a single hotel recommendation
 * Shows: image, name, description, price, rating, location, amenities
 */
export function HotelCard({
	hotel,
	savedItemId,
	onSave,
	onUnsave,
}: HotelCardProps) {
	const [isSaved, setIsSaved] = useState(!!savedItemId);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleSave = async () => {
		setIsLoading(true);
		try {
			if (isSaved && savedItemId && onUnsave) {
				await onUnsave(savedItemId);
				setIsSaved(false);
			} else if (!isSaved && onSave) {
				await onSave(hotel);
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
				aria-label={isSaved ? "Unsave hotel" : "Save hotel"}
			>
				<Heart
					className={`h-5 w-5 transition-colors ${
						isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
					}`}
				/>
			</button>
			{/* Hotel Image */}
			{hotel.imageUrl && (
				<div className="aspect-video w-full overflow-hidden bg-gray-100">
					<img
						src={hotel.imageUrl}
						alt={hotel.name}
						className="h-full w-full object-cover"
					/>
				</div>
			)}

			{/* Hotel Content */}
			<div className="p-4">
				{/* Name */}
				<h3 className="mb-2 text-lg font-semibold text-gray-900">
					{hotel.name}
				</h3>

				{/* Description */}
				<p className="mb-3 text-sm text-gray-600 line-clamp-2">
					{hotel.description}
				</p>

				{/* Location & Rating */}
				<div className="mb-3 flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1 text-gray-600">
						<MapPin className="h-4 w-4" />
						<span>{hotel.location}</span>
					</div>

					{hotel.rating && (
						<div className="flex items-center gap-1 text-yellow-600">
							<Star className="h-4 w-4 fill-current" />
							<span className="font-medium">{hotel.rating}</span>
						</div>
					)}
				</div>

				{/* Amenities */}
				{hotel.amenities && hotel.amenities.length > 0 && (
					<div className="mb-3 flex flex-wrap gap-2">
						{hotel.amenities.slice(0, 3).map((amenity, index) => (
							<div
								key={index}
								className="flex items-center gap-1 text-xs text-green-700"
							>
								<CheckCircle className="h-3 w-3" />
								<span>{amenity}</span>
							</div>
						))}
					</div>
				)}

				{/* Price */}
				<div className="flex items-center justify-between border-t border-gray-100 pt-3">
					<span className="text-sm text-gray-600">Per night</span>
					<div className="flex items-center gap-1 text-lg font-bold text-green-600">
						<DollarSign className="h-5 w-5" />
						<span>{hotel.pricePerNight}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
