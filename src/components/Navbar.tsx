"use client";

import { useState } from "react";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, Globe, User } from "lucide-react";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="bg-white">
			<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top navigation">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<Link href="/" className="-m-1.5 flex items-center">
							<span className="sr-only">BudgetBuddy home</span>
							<Image
								src="/logo (1).png"
								alt="BudgetBuddy logo"
								width={140}
								height={40}
								className="h-8 w-auto"
								priority
							/>
						</Link>
					</div>

					{/* Desktop links */}
							<div className="hidden md:flex md:items-center md:gap-6">
								<Link
									href="/recommendations"
									className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
								>
									<Globe className="h-4 w-4 text-gray-600" aria-hidden />
									<span>Browse</span>
								</Link>

						<Link
							href="/saved"
							className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
						>
							<Heart className="h-4 w-4 text-gray-600" aria-hidden />
							<span>Saved</span>
						</Link>

									<SignedOut>
										<div>
											<Button
												asChild
												className="rounded-full bg-[#DDF95C] text-black px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDF95C] hover:bg-[#DDF95C]"
											>
												<SignInButton>
													<span className="flex items-center gap-2">
														<User className="h-4 w-4 text-black" aria-hidden />
														<span>Log in</span>
													</span>
												</SignInButton>
											</Button>
										</div>
									</SignedOut>

						<SignedIn>
							<div className="flex items-center gap-3">
								<UserButton />
							</div>
						</SignedIn>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							type="button"
							aria-label="Toggle menu"
							aria-expanded={open}
							onClick={() => setOpen((s) => !s)}
							className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
						>
							{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>

				{/* Mobile menu panel */}
				{open && (
					<div className="md:hidden mt-2 space-y-2 pb-4">
									<Link
										href="/recommendations"
										onClick={() => setOpen(false)}
										className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
									>
										<Globe className="h-4 w-4 text-gray-600" aria-hidden />
										<span>Browse</span>
									</Link>

						<Link
							href="/saved"
							onClick={() => setOpen(false)}
							className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
						>
							<Heart className="h-4 w-4 text-gray-600" aria-hidden />
							<span>Saved</span>
						</Link>

									<SignedOut>
										<div className="px-3">
											<Button
												asChild
												className="w-full rounded-full bg-[#DDF95C] text-black px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDF95C] hover:bg-[#DDF95C]"
											>
												<SignInButton>
													<span className="flex items-center justify-center gap-2">
														<User className="h-4 w-4 text-black" aria-hidden />
														<span>Log in</span>
													</span>
												</SignInButton>
											</Button>
										</div>
									</SignedOut>

						<SignedIn>
							<div className="px-3">
								<UserButton />
							</div>
						</SignedIn>
					</div>
				)}
			</nav>
		</header>
	);
}
