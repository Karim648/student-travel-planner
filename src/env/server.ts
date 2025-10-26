import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
		ELEVENLABS_API_KEY: z.string().min(1),
		ELEVENLABS_AGENT_ID: z.string().min(1),
		CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
		// Optional: for webhook security
		ELEVEN_WEBHOOK_SECRET: z.string().optional(),
		// Google Gemini API for generating travel recommendations
		GEMINI_API_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: process.env,
});
