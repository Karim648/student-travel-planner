/**
 * Types for Snowflake API recommendations
 * Update these if the Snowflake API schema changes
 */

export interface Activity {
	id: string;
	title: string;
	description: string;
	category: string;
	price?: number;
	rating?: number;
	location?: string;
	imageUrl?: string;
}

export interface Hotel {
	id: string;
	name: string;
	description: string;
	pricePerNight: number;
	rating?: number;
	location: string;
	amenities?: string[];
	imageUrl?: string;
}

export interface Restaurant {
	id: string;
	name: string;
	description: string;
	cuisine: string;
	priceRange: string; // e.g., "$", "$$", "$$$"
	rating?: number;
	location?: string;
	imageUrl?: string;
}

export interface TravelRecommendations {
	activities: Activity[];
	hotels: Hotel[];
	restaurants?: Restaurant[];
	summary?: string;
}

export interface RecommendationsRequest {
	conversationSummary: string;
	userId?: string;
	conversationId?: string;
}

export interface RecommendationsResponse {
	success: boolean;
	data?: TravelRecommendations;
	error?: string;
}
