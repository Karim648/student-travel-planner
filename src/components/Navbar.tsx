import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between bg-blue-500 p-4">
			<div>
				<Link href="/">
					<h1 className="cursor-pointer text-xl font-bold text-white">
						BudgetBuddy AI-Travel Planner
					</h1>
					<span className="text-sm text-blue-100">
						Student travel made simple
					</span>
				</Link>
			</div>
			<ul className="flex items-center gap-4">
				<SignedIn>
					<li>
						<Link href="/conversation">
							<Button variant="outline" className="bg-white">
								New Conversation
							</Button>
						</Link>
					</li>
					<li>
						<Link href="/dashboard">
							<Button variant="outline" className="bg-white">
								My Conversations
							</Button>
						</Link>
					</li>
					<li>
						<Link href="/saved">
							<Button variant="outline" className="bg-white">
								<Heart className="mr-2 h-4 w-4" />
								Saved Items
							</Button>
						</Link>
					</li>
					<li>
						<UserButton />
					</li>
				</SignedIn>
				<SignedOut>
					<li>
						<Button asChild>
							<SignInButton />
						</Button>
					</li>
					<li>
						<Button asChild>
							<SignUpButton />
						</Button>
					</li>
				</SignedOut>
			</ul>
		</nav>
	);
}
