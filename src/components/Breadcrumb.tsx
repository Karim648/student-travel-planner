"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb Navigation Component
 *
 * Displays the current page location in a hierarchy
 */
export function Breadcrumb() {
	const pathname = usePathname();

	// Don't show breadcrumb on home page
	if (pathname === "/") {
		return null;
	}

	const pathSegments = pathname.split("/").filter(Boolean);

	const breadcrumbMap: Record<string, string> = {
		conversation: "New Conversation",
		dashboard: "My Conversations",
		saved: "Saved Items",
		recommendations: "Travel Recommendations",
		"sign-in": "Sign In",
		"sign-up": "Sign Up",
	};

	return (
		<nav className="container mx-auto px-4 py-3">
			<ol className="flex items-center gap-2 text-sm text-gray-600">
				<li>
					<Link
						href="/"
						className="flex items-center hover:text-blue-600 transition-colors"
					>
						<Home className="h-4 w-4" />
					</Link>
				</li>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
					const isLast = index === pathSegments.length - 1;
					const label = breadcrumbMap[segment] || segment;

					return (
						<li key={href} className="flex items-center gap-2">
							<ChevronRight className="h-4 w-4 text-gray-400" />
							{isLast ? (
								<span className="font-medium text-gray-900">{label}</span>
							) : (
								<Link
									href={href}
									className="hover:text-blue-600 transition-colors"
								>
									{label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
