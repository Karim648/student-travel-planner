"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
	Loader2,
	MessageSquare,
	Calendar,
	CheckCircle,
	XCircle,
	Clock,
	Sparkles,
	ArrowRight,
} from "lucide-react";

interface TranscriptMessage {
	role: string;
	message: string;
}

interface ConversationAnalysis {
	sentiment?: string;
	summary?: string;
	[key: string]: unknown;
}

interface Conversation {
	id: number;
	userId: string;
	conversationId: string;
	agentId: string;
	status: string;
	transcript: TranscriptMessage[] | null;
	analysis: ConversationAnalysis | null;
	summary: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Dashboard Page
 *
 * Displays all user conversations with:
 * - Conversation status
 * - Date created
 * - Summary/analysis
 * - Action buttons to view recommendations
 */
export default function DashboardPage() {
	const router = useRouter();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchConversations();
	}, []);

	const fetchConversations = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/conversations");

			if (!response.ok) {
				throw new Error("Failed to fetch conversations");
			}

			const data = await response.json();

			if (data.success) {
				setConversations(data.conversations);
			} else {
				throw new Error(data.error || "Failed to load conversations");
			}
		} catch (err) {
			console.error("Error fetching conversations:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load conversations"
			);
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "failed":
				return <XCircle className="h-5 w-5 text-red-500" />;
			case "in-progress":
				return <Clock className="h-5 w-5 text-yellow-500" />;
			default:
				return <MessageSquare className="h-5 w-5 text-gray-500" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getSummaryText = (conversation: Conversation): string => {
		// Try to get summary from different sources
		if (conversation.summary) {
			return conversation.summary;
		}

		if (conversation.analysis && typeof conversation.analysis === "object") {
			if ("summary" in conversation.analysis) {
				return conversation.analysis.summary as string;
			}
		}

		// Fallback: create a basic summary from transcript
		if (conversation.transcript && Array.isArray(conversation.transcript)) {
			const userMessages = conversation.transcript.filter(
				(msg: TranscriptMessage) => msg.role === "user"
			);
			if (userMessages.length > 0) {
				return `Conversation with ${userMessages.length} user message(s)`;
			}
		}

		return "No summary available";
	};

	const handleViewRecommendations = (conversation: Conversation) => {
		const summary = getSummaryText(conversation);
		router.push(
			`/recommendations?conversationId=${
				conversation.conversationId
			}&summary=${encodeURIComponent(summary)}`
		);
	};

	const handleStartNewConversation = () => {
		router.push("/conversation");
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
					<p className="mt-4 text-lg text-gray-600">
						Loading your conversations...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="rounded-lg bg-white p-8 shadow-lg">
					<div className="mb-4 text-center">
						<XCircle className="mx-auto h-12 w-12 text-red-500" />
					</div>
					<h2 className="mb-2 text-xl font-semibold text-gray-900">
						Error Loading Conversations
					</h2>
					<p className="mb-6 text-gray-600">{error}</p>
					<Button onClick={fetchConversations} className="w-full">
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
			<Breadcrumb />
			<div className="p-8">
				<div className="mx-auto max-w-7xl">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-4xl font-bold text-gray-900">
									My Conversations
								</h1>
								<p className="mt-2 text-lg text-gray-600">
									View and manage your travel planning conversations
								</p>
							</div>
							<Button
								onClick={handleStartNewConversation}
								size="lg"
								className="bg-blue-600 hover:bg-blue-700"
							>
								<MessageSquare className="mr-2 h-5 w-5" />
								New Conversation
							</Button>
						</div>
					</div>

					{/* Stats Bar */}
					<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										Total Conversations
									</p>
									<p className="mt-2 text-3xl font-bold text-gray-900">
										{conversations.length}
									</p>
								</div>
								<MessageSquare className="h-10 w-10 text-blue-500" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Completed</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{
											conversations.filter(
												(c) => c.status.toLowerCase() === "completed"
											).length
										}
									</p>
								</div>
								<CheckCircle className="h-10 w-10 text-green-500" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">
										In Progress
									</p>
									<p className="mt-2 text-3xl font-bold text-yellow-600">
										{
											conversations.filter(
												(c) => c.status.toLowerCase() === "in-progress"
											).length
										}
									</p>
								</div>
								<Clock className="h-10 w-10 text-yellow-500" />
							</div>
						</div>
					</div>

					{/* Conversations List */}
					{conversations.length === 0 ? (
						<div className="rounded-lg bg-white p-12 text-center shadow-lg">
							<MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
							<h2 className="mb-2 text-2xl font-semibold text-gray-900">
								No conversations yet
							</h2>
							<p className="mb-6 text-gray-600">
								Start your first conversation with our AI travel assistant
							</p>
							<Button
								onClick={handleStartNewConversation}
								size="lg"
								className="bg-blue-600 hover:bg-blue-700"
							>
								<Sparkles className="mr-2 h-5 w-5" />
								Start Planning Your Trip
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{conversations.map((conversation) => (
								<div
									key={conversation.id}
									className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
								>
									{/* Card Header */}
									<div className="border-b border-gray-200 bg-linear-to-r from-blue-500 to-indigo-600 p-6">
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												{getStatusIcon(conversation.status)}
												<div>
													<h3 className="text-lg font-semibold text-white">
														Conversation
													</h3>
													<p className="text-sm text-blue-100">
														ID: {conversation.conversationId.substring(0, 12)}
														...
													</p>
												</div>
											</div>
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
													conversation.status
												)}`}
											>
												{conversation.status}
											</span>
										</div>
									</div>

									{/* Card Body */}
									<div className="p-6">
										{/* Date */}
										<div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
											<Calendar className="h-4 w-4" />
											<span>{formatDate(conversation.createdAt)}</span>
										</div>

										{/* Summary */}
										<div className="mb-6">
											<h4 className="mb-2 text-sm font-semibold text-gray-700">
												Summary
											</h4>
											<p className="text-gray-600 line-clamp-3">
												{getSummaryText(conversation)}
											</p>
										</div>

										{/* Sentiment Badge (if available) */}
										{conversation.analysis &&
											typeof conversation.analysis === "object" &&
											"sentiment" in conversation.analysis && (
												<div className="mb-4">
													<span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
														<Sparkles className="mr-1 h-3 w-3" />
														Sentiment:{" "}
														{String(
															conversation.analysis.sentiment
														).toUpperCase()}
													</span>
												</div>
											)}

										{/* Action Buttons */}
										<div className="flex gap-3">
											<Button
												onClick={() => handleViewRecommendations(conversation)}
												disabled={
													conversation.status.toLowerCase() !== "completed"
												}
												className="flex-1 bg-blue-600 hover:bg-blue-700"
											>
												<Sparkles className="mr-2 h-4 w-4" />
												View Recommendations
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</div>

										{conversation.status.toLowerCase() !== "completed" && (
											<p className="mt-3 text-center text-xs text-gray-500">
												Recommendations available when conversation is completed
											</p>
										)}
									</div>

									{/* Transcript Preview */}
									{conversation.transcript &&
										Array.isArray(conversation.transcript) &&
										conversation.transcript.length > 0 && (
											<div className="border-t border-gray-200 bg-gray-50 p-4">
												<p className="text-xs font-semibold text-gray-600">
													Transcript Preview
												</p>
												<div className="mt-2 space-y-1 text-xs text-gray-600">
													{conversation.transcript
														.slice(0, 2)
														.map((msg: TranscriptMessage, idx: number) => (
															<div key={idx} className="line-clamp-1">
																<span className="font-semibold capitalize">
																	{msg.role}:
																</span>{" "}
																{msg.message}
															</div>
														))}
													{conversation.transcript.length > 2 && (
														<p className="text-gray-500">
															+{conversation.transcript.length - 2} more
															messages...
														</p>
													)}
												</div>
											</div>
										)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
