import Navbar from "@/components/Navbar";
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<Navbar />

			{/* Hero Section */}
			<main className="relative overflow-hidden">
				{/* Decorative Background Elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
				</div>

				<div className="container mx-auto px-4 py-20 relative">
					{/* Hero Content */}
					<div className="mx-auto max-w-5xl text-center mb-16">
						<div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
							<Sparkles className="h-4 w-4" />
							AI-Powered Travel Planning
						</div>

						<h1 className="mb-6 text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
							Your Perfect Student
							<br />
							Adventure Awaits
						</h1>

						<p className="mb-10 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
							Discover amazing destinations, hidden gems, and budget-friendly
							experiences tailored just for you. Let our AI travel assistant
							plan your dream trip in minutes.
						</p>

						<SignedOut>
							<div className="mb-12 flex flex-wrap justify-center gap-4">
								<Link href="/sign-in">
									<Button
										size="lg"
										className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
									>
										<Sparkles className="mr-2 h-5 w-5" />
										Start Planning Free
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/sign-up">
									<Button
										size="lg"
										variant="outline"
										className="px-10 py-7 text-lg font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-200"
									>
										Create Account
									</Button>
								</Link>
							</div>
						</SignedOut>

						<SignedIn>
							<div className="mb-12 flex flex-wrap justify-center gap-4">
								<Link href="/conversation">
									<Button
										size="lg"
										className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
									>
										<MessageSquarePlus className="mr-2 h-5 w-5" />
										Start New Chat
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/dashboard">
									<Button
										size="lg"
										variant="outline"
										className="px-8 py-7 text-lg font-semibold border-2 border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-200"
									>
										<LayoutDashboard className="mr-2 h-5 w-5" />
										My Conversations
									</Button>
								</Link>
								<Link href="/saved">
									<Button
										size="lg"
										variant="outline"
										className="px-8 py-7 text-lg font-semibold border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-600 shadow-md hover:shadow-lg transition-all duration-200"
									>
										<Heart className="mr-2 h-5 w-5" />
										Saved Items
									</Button>
								</Link>
							</div>
						</SignedIn>

						{/* Trust Indicators */}
						<div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-8">
							<div className="flex items-center gap-2">
								<Shield className="h-4 w-4 text-green-600" />
								<span>100% Free to Use</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4 text-blue-600" />
								<span>Trusted by Students</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-purple-600" />
								<span>Plan in Minutes</span>
							</div>
						</div>
					</div>

					{/* Feature Cards */}
					<div className="max-w-6xl mx-auto mt-24 grid gap-8 md:grid-cols-3 mb-20">
						<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
							<div className="absolute -top-6 left-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<MessageSquarePlus className="h-8 w-8" />
							</div>
							<div className="mt-8">
								<h3 className="mb-3 text-2xl font-bold text-gray-900">
									AI-Powered Conversations
								</h3>
								<p className="text-gray-600 leading-relaxed">
									Chat naturally with our intelligent travel assistant. Get
									personalized recommendations based on your preferences,
									budget, and travel style.
								</p>
							</div>
						</div>

						<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
							<div className="absolute -top-6 left-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<Wallet className="h-8 w-8" />
							</div>
							<div className="mt-8">
								<h3 className="mb-3 text-2xl font-bold text-gray-900">
									Student Budget Friendly
								</h3>
								<p className="text-gray-600 leading-relaxed">
									Discover amazing destinations that won&apos;t break the bank.
									Get affordable options for accommodation, activities, and
									dining.
								</p>
							</div>
						</div>

						<div className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
							<div className="absolute -top-6 left-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
								<Heart className="h-8 w-8" />
							</div>
							<div className="mt-8">
								<h3 className="mb-3 text-2xl font-bold text-gray-900">
									Save & Organize
								</h3>
								<p className="text-gray-600 leading-relaxed">
									Save your favorite recommendations and access all your
									conversations anytime. Build your perfect itinerary with ease.
								</p>
							</div>
						</div>
					</div>

					{/* How It Works Section */}
					<div className="max-w-6xl mx-auto mb-20">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
								How It Works
							</h2>
							<p className="text-xl text-gray-600">
								Start planning your dream trip in three simple steps
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							<div className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-6">
									1
								</div>
								<Compass className="h-12 w-12 mx-auto mb-4 text-blue-600" />
								<h3 className="text-xl font-semibold mb-3">
									Tell Us Your Preferences
								</h3>
								<p className="text-gray-600">
									Share your budget, interests, and travel dates with our AI
									assistant
								</p>
							</div>

							<div className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-6">
									2
								</div>
								<Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
								<h3 className="text-xl font-semibold mb-3">
									Get Personalized Recommendations
								</h3>
								<p className="text-gray-600">
									Receive curated suggestions for destinations, hotels, and
									activities
								</p>
							</div>

							<div className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 text-2xl font-bold mb-6">
									3
								</div>
								<Plane className="h-12 w-12 mx-auto mb-4 text-purple-600" />
								<h3 className="text-xl font-semibold mb-3">Plan Your Trip</h3>
								<p className="text-gray-600">
									Save your favorites and organize everything for your perfect
									adventure
								</p>
							</div>
						</div>
					</div>

					{/* Stats Section */}
					<div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl mb-20">
						<div className="grid md:grid-cols-3 gap-8 text-center">
							<div>
								<div className="flex items-center justify-center mb-3">
									<Globe className="h-8 w-8 mr-2" />
									<div className="text-4xl font-bold">100+</div>
								</div>
								<p className="text-blue-100 text-lg">Destinations Covered</p>
							</div>
							<div>
								<div className="flex items-center justify-center mb-3">
									<TrendingUp className="h-8 w-8 mr-2" />
									<div className="text-4xl font-bold">24/7</div>
								</div>
								<p className="text-blue-100 text-lg">AI Assistant Available</p>
							</div>
							<div>
								<div className="flex items-center justify-center mb-3">
									<MapPin className="h-8 w-8 mr-2" />
									<div className="text-4xl font-bold">1000+</div>
								</div>
								<p className="text-blue-100 text-lg">Places Recommended</p>
							</div>
						</div>
					</div>

					{/* CTA Section */}
					<SignedOut>
						<div className="max-w-4xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
							<h2 className="text-4xl font-bold text-gray-900 mb-4">
								Ready to Start Your Adventure?
							</h2>
							<p className="text-xl text-gray-600 mb-8">
								Join students worldwide who are discovering amazing travel
								experiences
							</p>
							<Link href="/sign-in">
								<Button
									size="lg"
									className="px-12 py-7 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
								>
									<Sparkles className="mr-2 h-5 w-5" />
									Get Started for Free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</SignedOut>
				</div>
			</main>
		</div>
	);
}
