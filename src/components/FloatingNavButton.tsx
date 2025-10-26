"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
	MessageSquarePlus,
	LayoutDashboard,
	Heart,
	Home,
	Menu,
	X,
} from "lucide-react";

/**
 * Floating Action Button for Quick Navigation
 *
 * Provides a sticky floating button with quick access to main pages
 */
export function FloatingNavButton() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const navItems = [
		{
			icon: Home,
			label: "Home",
			path: "/",
			color: "bg-gray-600 hover:bg-gray-700",
		},
		{
			icon: MessageSquarePlus,
			label: "New Chat",
			path: "/conversation",
			color: "bg-blue-600 hover:bg-blue-700",
		},
		{
			icon: LayoutDashboard,
			label: "Dashboard",
			path: "/dashboard",
			color: "bg-indigo-600 hover:bg-indigo-700",
		},
		{
			icon: Heart,
			label: "Saved",
			path: "/saved",
			color: "bg-pink-600 hover:bg-pink-700",
		},
	];

	return (
		<div className="fixed bottom-6 left-6 z-50">
			{/* Navigation Menu */}
			{isOpen && (
				<div className="mb-4 flex flex-col gap-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						return (
							<Button
								key={item.path}
								onClick={() => {
									router.push(item.path);
									setIsOpen(false);
								}}
								className={`${item.color} shadow-lg transition-all hover:scale-105`}
								size="lg"
							>
								<Icon className="mr-2 h-5 w-5" />
								{item.label}
							</Button>
						);
					})}
				</div>
			)}

			{/* Toggle Button */}
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="h-14 w-14 rounded-full bg-blue-600 shadow-lg transition-all hover:scale-110 hover:bg-blue-700"
				size="icon"
			>
				{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
			</Button>
		</div>
	);
}
