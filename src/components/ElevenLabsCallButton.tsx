"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ElevenLabsCallButton() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [callUrl, setCallUrl] = useState<string | null>(null);

	const startCall = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/agent/start-call", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phoneNumber: "+1234567890", // Replace with actual phone number
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to start call");
			}

			const data = await response.json();
			setCallUrl(data.signedUrl);

			// Open the signed URL in a new window for web-based conversation
			if (data.signedUrl) {
				window.open(data.signedUrl, "_blank");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Button onClick={startCall} disabled={loading}>
				{loading ? "Starting Call..." : "Start AI Call"}
			</Button>

			{error && <p className="text-sm text-red-500">{error}</p>}

			{callUrl && (
				<div className="text-sm text-green-600">
					Call started! Check the new window.
				</div>
			)}
		</div>
	);
}
