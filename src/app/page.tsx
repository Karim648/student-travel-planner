import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	MessageSquarePlus,
	LayoutDashboard,
	Heart,
	Sparkles,
	MapPin,
	Compass,
	Plane,
	Users,
	TrendingUp,
	Shield,
	Clock,
	Wallet,
	Globe,
	ArrowRight,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			<Navbar />

			{/* Hero Section */}
			<main className="relative overflow-hidden">
				<Hero />

				{/* Feature Cards */}
				<div className="max-w-6xl mx-auto mt-24 grid gap-8 md:grid-cols-3 mb-20">
					<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
						<div className="absolute -top-6 left-8 bg-gradient-to-r from-[#DDF95C] to-[#FFD872] text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<MessageSquarePlus className="h-8 w-8" />
						</div>
						<div className="mt-8">
							<h3 className="mb-3 text-2xl font-bold text-gray-900">AI-Powered Conversations</h3>
							<p className="text-gray-600 leading-relaxed">
								Chat naturally with our intelligent travel assistant. Get
								personalized recommendations based on your preferences, budget,
								and travel style.
							</p>
						</div>
					</div>

					<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
						<div className="absolute -top-6 left-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<Wallet className="h-8 w-8" />
						</div>
						<div className="mt-8">
							<h3 className="mb-3 text-2xl font-bold text-gray-900">Student Budget Friendly</h3>
							<p className="text-gray-600 leading-relaxed">
								Discover amazing destinations that won&apos;t break the bank. Get
								affordable options for accommodation, activities, and dining.
							</p>
						</div>
					</div>

					<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
						<div className="absolute -top-6 left-8 bg-gradient-to-r from-[#DDF95C] to-[#FFD872] text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
							<Heart className="h-8 w-8" />
						</div>
						<div className="mt-8">
							<h3 className="mb-3 text-2xl font-bold text-gray-900">Save & Organize</h3>
							<p className="text-gray-600 leading-relaxed">
								Save your favorite recommendations and access all your conversations
								anytime. Build your perfect itinerary with ease.
							</p>
						</div>
					</div>
				</div>

				{/* How It Works Section */}
				<div className="max-w-6xl mx-auto mb-20">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
						<p className="text-xl text-gray-600">Start planning your dream trip in three simple steps</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-[#DDF95C] text-2xl font-bold mb-6">1</div>
							<Compass className="h-12 w-12 mx-auto mb-4 text-[#DDF95C]" />
							<h3 className="text-xl font-semibold mb-3">Tell Us Your Preferences</h3>
							<p className="text-gray-600">Share your budget, interests, and travel dates with our AI assistant</p>
						</div>

						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-[#DDF95C] text-2xl font-bold mb-6">2</div>
							<Sparkles className="h-12 w-12 mx-auto mb-4 text-[#DDF95C]" />
							<h3 className="text-xl font-semibold mb-3">Get Personalized Recommendations</h3>
							<p className="text-gray-600">Receive curated suggestions for destinations, hotels, and activities</p>
						</div>

						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-[#DDF95C] text-2xl font-bold mb-6">3</div>
							<Plane className="h-12 w-12 mx-auto mb-4 text-[#DDF95C]" />
							<h3 className="text-xl font-semibold mb-3">Plan Your Trip</h3>
							<p className="text-gray-600">Save your favorites and organize everything for your perfect adventure</p>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="max-w-4xl mx-auto bg-gradient-to-r from-[#DDF95C] to-[#FFD872] rounded-3xl p-12 text-white shadow-2xl mb-20">
					<div className="grid md:grid-cols-3 gap-8 text-center">
						<div>
							<div className="flex items-center justify-center mb-3">
								<Globe className="h-8 w-8 mr-2" />
								<div className="text-4xl font-bold">100+</div>
							</div>
							<p className="text-amber-100 text-lg">Destinations Covered</p>
						</div>
						<div>
							<div className="flex items-center justify-center mb-3">
								<TrendingUp className="h-8 w-8 mr-2" />
								<div className="text-4xl font-bold">24/7</div>
							</div>
							<p className="text-amber-100 text-lg">AI Assistant Available</p>
						</div>
						<div>
							<div className="flex items-center justify-center mb-3">
								<MapPin className="h-8 w-8 mr-2" />
								<div className="text-4xl font-bold">1000+</div>
							</div>
							<p className="text-amber-100 text-lg">Places Recommended</p>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<SignedOut>
					<div className="max-w-4xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Adventure?</h2>
						<p className="text-xl text-gray-600 mb-8">Join students worldwide who are discovering amazing travel experiences</p>
						<Link href="/sign-in">
							<Button size="lg" className="px-12 py-7 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
								<Sparkles className="mr-2 h-5 w-5" />
								Get Started for Free
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
					</div>
				</SignedOut>
			</main>
		</div>
	);

}
