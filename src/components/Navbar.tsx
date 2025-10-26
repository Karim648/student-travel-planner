import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart, MessageSquarePlus, LayoutDashboard, Home } from "lucide-react";

export default function Navbar() {
	return (
		<nav className="border-b bg-linear-to-r from-blue-600 to-blue-500 shadow-lg">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-4">
					<div>
						<Link href="/" className="group">
							<div className="flex items-center gap-2">
								<Home className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
								<div>
									<h1 className="text-xl font-bold text-white transition-colors group-hover:text-blue-100">
										BudgetBuddy AI-Travel Planner
									</h1>
									<span className="text-xs text-blue-100">
										Student travel made simple
									</span>
								</div>
							</div>
						</Link>
					</div>
					<ul className="flex items-center gap-3">
						<SignedIn>
							<li>
								<Link href="/conversation">
									<Button
										variant="outline"
										className="border-white bg-white text-blue-600 hover:bg-blue-50"
									>
										<MessageSquarePlus className="mr-2 h-4 w-4" />
										New Chat
									</Button>
								</Link>
							</li>
							<li>
								<Link href="/dashboard">
									<Button
										variant="outline"
										className="border-white bg-white text-blue-600 hover:bg-blue-50"
									>
										<LayoutDashboard className="mr-2 h-4 w-4" />
										Dashboard
									</Button>
								</Link>
							</li>
							<li>
								<Link href="/saved">
									<Button
										variant="outline"
										className="border-white bg-white text-blue-600 hover:bg-blue-50"
									>
										<Heart className="mr-2 h-4 w-4" />
										Saved
									</Button>
								</Link>
							</li>
							<li className="ml-2">
								<UserButton />
							</li>
						</SignedIn>
						<SignedOut>
							<li>
								<Button
									asChild
									variant="outline"
									className="border-white bg-white text-blue-600 hover:bg-blue-50"
								>
									<SignInButton />
								</Button>
							</li>
							<li>
								<Button asChild className="bg-blue-700 hover:bg-blue-800">
									<SignUpButton />
								</Button>
							</li>
						</SignedOut>
					</ul>
				</div>
			</div>
		</nav>
	);
}
