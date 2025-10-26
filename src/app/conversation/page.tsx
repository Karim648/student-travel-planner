"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Heart, Home } from "lucide-react";

export default function ConversationPage() {
	const [agentId, setAgentId] = useState<string>("");
	const [userName, setUserName] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		// Load the ElevenLabs Convai widget script
		const loadWidget = async () => {
			try {
				// Fetch the agent ID from our API
				const response = await fetch("/api/agent/config");
				if (response.ok) {
					const data = await response.json();
					setAgentId(data.agentId);
					setUserName(data.userName);
					setUserId(data.userId);
				}

				// Load the ElevenLabs script
				const script = document.createElement("script");
				script.src = "https://elevenlabs.io/convai-widget/index.js";
				script.async = true;
				script.onload = () => {
					console.log("ElevenLabs widget loaded");
				};
				document.body.appendChild(script);
			} catch (err) {
				console.error("Failed to load widget:", err);
			}
		};

		loadWidget();
	}, []);

	useEffect(() => {
		// Initialize the widget when agent ID is available
		if (agentId && userName && userId) {
			const widgetContainer = document.getElementById(
				"convai-widget-container"
			);
			if (widgetContainer && !widgetContainer.hasChildNodes()) {
				const widget = document.createElement("elevenlabs-convai");
				widget.setAttribute("agent-id", agentId);

				// Pass dynamic variables including user name
				widget.setAttribute(
					"override-agent-settings",
					JSON.stringify({
						first_message: `Hey ${userName}! I'm your student travel planner. Tell me where you're headed and how much you'd like to spend on fun stuff — I'll find activities, food spots, and experiences that fit your budget.`,
					})
				);

				// IMPORTANT: Pass userId in client-metadata
				// This will be available in the webhook as conversation_initiation_client_data
				const clientMetadata = {
					userId: userId,
				};
				widget.setAttribute("client-metadata", JSON.stringify(clientMetadata));

				console.log(
					"🔧 Widget configured with client-metadata:",
					clientMetadata
				);
				console.log("🆔 Agent ID:", agentId);
				console.log("👤 User ID:", userId);

				widgetContainer.appendChild(widget);
			}
		}
	}, [agentId, userName, userId]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-8">
			<div className="w-full max-w-4xl space-y-8 rounded-lg bg-white p-8 shadow-xl">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900">
						Travel Planning Assistant
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Talk to our AI travel assistant to plan your perfect student trip
					</p>
				</div>

				<div className="space-y-6">
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
						<h2 className="mb-4 text-xl font-semibold text-gray-800">
							How it works:
						</h2>
						<ul className="space-y-3 text-gray-700">
							<li className="flex items-start">
								<span className="mr-2 text-blue-600">1.</span>
								<span>Click &quot;Start a call&quot; in the widget below</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-600">2.</span>
								<span>Allow microphone access when prompted</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-600">3.</span>
								<span>
									Talk about your travel plans, budget, and preferences
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 text-blue-600">4.</span>
								<span>
									When done, end the call and check your dashboard for the
									summary
								</span>
							</li>
						</ul>
					</div>

					{/* ElevenLabs Widget Container */}
					<div
						id="convai-widget-container"
						className="flex justify-center"
					></div>

					<div className="flex flex-col gap-3 sm:flex-row">
						<Button
							onClick={() => router.push("/")}
							variant="outline"
							size="lg"
							className="flex-1 text-lg"
						>
							<Home className="mr-2 h-5 w-5" />
							Home
						</Button>
						<Button
							onClick={() => router.push("/dashboard")}
							variant="outline"
							size="lg"
							className="flex-1 text-lg"
						>
							<LayoutDashboard className="mr-2 h-5 w-5" />
							My Conversations
						</Button>
						<Button
							onClick={() => router.push("/saved")}
							size="lg"
							className="flex-1 bg-pink-600 text-lg hover:bg-pink-700"
						>
							<Heart className="mr-2 h-5 w-5" />
							Saved Items
						</Button>
					</div>

					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
						<strong>Tip:</strong> Make sure your microphone is enabled and
						you&apos;re in a quiet environment. The conversation will be saved
						automatically to your dashboard.
					</div>
				</div>
			</div>
		</div>
	);
}
