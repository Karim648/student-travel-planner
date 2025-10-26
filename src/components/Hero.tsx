"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, MessageSquarePlus } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="grid md:grid-cols-2 items-center gap-8">
          {/* Left column - text */}
          <div className="mx-auto md:ml-0 max-w-2xl text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black leading-tight">
              Discover Hidden Gems Without Breaking the Bank.
            </h1>
            <h2 className="mt-3 text-lg font-semibold text-black">While keeping your sanity!</h2>
            <p className="mt-4 text-base text-gray-600">
              Explore authentic, budget-friendly experiences curated for student
              travellers — from hiking to clubbing — discover yours in one
              conversation.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4">
              <SignedOut>
                <div className="w-full flex justify-start">
                  <div className="w-full sm:w-[560px]">
                    <Link href="/sign-in" className="inline-block w-full">
                      <Button
                        size="lg"
                        className="w-full rounded-full px-8 py-3 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ background: "linear-gradient(90deg,#DDF95C,#FFD872)" }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          <span>Start Exploring</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      </Button>
                    </Link>

                    <div className="mt-3 text-center">
                      <Link
                        href="/sign-in"
                        className="text-sm text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                      >
                        Log in to unlock personalized picks
                      </Link>
                    </div>
                  </div>
                </div>
              </SignedOut>

              <SignedIn>
                <Link href="/conversation" className="w-full sm:w-[560px]">
                  <Button
                    size="lg"
                    className="w-full rounded-full px-8 py-3 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ background: "linear-gradient(90deg,#DDF95C,#FFD872)" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <MessageSquarePlus className="h-5 w-5" />
                      <span>Start New Chat</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Right column - background image */}
          <div
            className="h-[600px] md:h-[820px] lg:h-[620px] bg-right bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/Mascot.png')" }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
