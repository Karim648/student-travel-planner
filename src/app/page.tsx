import Navbar from "@/components/Navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	MessageSquarePlus,
	LayoutDashboard,
	Heart,
	Sparkles,
} from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main className="container mx-auto px-4 py-16">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 text-5xl font-bold text-gray-900">
						Plan Your Perfect Student Trip with AI
					</h1>
					<p className="mb-8 text-xl text-gray-600">
						Get personalized travel recommendations, budget tips, and
						destination suggestions from our AI-powered travel assistant.
					</p>

					<SignedOut>
						<div className="mb-12 flex flex-wrap justify-center gap-4">
							<Link href="/sign-in">
								<Button
									size="lg"
									className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
								>
									<Sparkles className="mr-2 h-5 w-5" />
									Get Started
								</Button>
							</Link>
							<Link href="/sign-up">
								<Button
									size="lg"
									variant="outline"
									className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
								>
									Sign Up Free
								</Button>
							</Link>
						</div>
					</SignedOut>

					<SignedIn>
						<div className="mb-12 flex flex-wrap justify-center gap-4">
							<Link href="/conversation">
								<Button
									size="lg"
									className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
								>
									<MessageSquarePlus className="mr-2 h-5 w-5" />
									Start New Chat
								</Button>
							</Link>
							<Link href="/dashboard">
								<Button
									size="lg"
									variant="outline"
									className="px-8 py-6 text-lg border-2"
								>
									<LayoutDashboard className="mr-2 h-5 w-5" />
									My Conversations
								</Button>
							</Link>
							<Link href="/saved">
								<Button
									size="lg"
									variant="outline"
									className="px-8 py-6 text-lg border-2 border-pink-600 text-pink-600 hover:bg-pink-50"
								>
									<Heart className="mr-2 h-5 w-5" />
									Saved Items
								</Button>
							</Link>
						</div>
					</SignedIn>

					<div className="mt-16 grid gap-8 md:grid-cols-3">
						<div className="rounded-lg bg-white p-6 shadow-md">
							<div className="mb-4 text-4xl">🤖</div>
							<h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
							<p className="text-gray-600">
								Chat with our intelligent travel assistant to get personalized
								recommendations
							</p>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-md">
							<div className="mb-4 text-4xl">💰</div>
							<h3 className="mb-2 text-xl font-semibold">Budget-Friendly</h3>
							<p className="text-gray-600">
								Get affordable travel options perfect for student budgets
							</p>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-md">
							<div className="mb-4 text-4xl">📝</div>
							<h3 className="mb-2 text-xl font-semibold">Save & Review</h3>
							<p className="text-gray-600">
								All your conversations are saved so you can review them anytime
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
