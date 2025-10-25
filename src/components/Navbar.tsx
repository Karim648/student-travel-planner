import {
	SignedIn,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Navbar() {
	return (
		<nav className="bg-blue-500 flex justify-between p-4 items-center">
			<div>
				<h1>BudgetBuddy AI-Travel Planner</h1>
				<span>Student travel made simple</span>
			</div>
			<ul className="flex gap-4">
				<Button asChild>
					<SignInButton />
				</Button>
				<Button asChild>
					<SignUpButton />
				</Button>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</ul>
		</nav>
	);
}
