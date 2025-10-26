import { Activity } from "@/types/recommendations";
import { MapPin, Star, DollarSign } from "lucide-react";

interface ActivityCardProps {
	activity: Activity;
}

/**
 * ActivityCard Component
 *
 * Displays a single activity recommendation
 * Shows: image, title, description, category, price, rating, location
 */
export function ActivityCard({ activity }: ActivityCardProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
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
