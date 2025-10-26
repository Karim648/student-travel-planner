"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Globe, Heart } from "lucide-react";

function MaterialPersonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2"
      {...props}
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function MaterialPersonAddIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-2"
      {...props}
    >
      <path d="M15 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9 8v-1c0-2.21 4.03-3.5 6-3.5s6 1.29 6 3.5v1H6zm9-6h2v2h2v2h-2v2h-2v-2h-2v-2h2v-2z" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Right: Links + Auth */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex items-center gap-4 mr-4">
            <Link
              href="/browse"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Globe className="w-5 h-5" />
              Browse
            </Link>
            <Link
              href="/saved"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Heart className="w-5 h-5" />
              Saved
            </Link>
          </div>

          {/* Auth Buttons */}
          <ul className="flex gap-3 items-center">
            <SignedOut>
              <Button
                asChild
                className="rounded-full bg-[#DDF95C] text-black hover:bg-[#cfe84a] px-4 py-2 flex items-center"
              >
                <SignInButton>
                  <span className="flex items-center">
                    <MaterialPersonIcon />
                    Log in
                  </span>
                </SignInButton>
              </Button>

              <Button
                asChild
                className="rounded-full bg-[#DDF95C] text-black hover:bg-[#cfe84a] px-4 py-2 flex items-center"
              >
                <SignUpButton>
                  <span className="flex items-center">
                    <MaterialPersonAddIcon />
                    Sign up
                  </span>
                </SignUpButton>
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
          </ul>
        </div>
      </div>
    </nav>
  );
}
