# ElevenLabs Conversational AI Integration

This guide explains how to integrate ElevenLabs conversational AI calls into your student travel planner app.

## Setup Steps

### 1. Get ElevenLabs Credentials

1. Go to [ElevenLabs](https://elevenlabs.io) and create an account
2. Navigate to your [API keys](https://elevenlabs.io/app/settings/api-keys)
3. Create a new API key and copy it
4. Go to [Conversational AI](https://elevenlabs.io/app/conversational-ai)
5. Create a new agent or use an existing one
6. Copy the Agent ID from the agent settings

### 2. Add Environment Variables

Add these to your `.env.local` file:

```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_AGENT_ID=your_agent_id_here
ELEVEN_WEBHOOK_SECRET=optional_webhook_secret_here
```

### 3. Configure Your Agent

In the ElevenLabs dashboard:

1. **System Prompt**: Configure what your agent should help with (e.g., "You are a helpful travel planning assistant for students")
2. **Knowledge Base**: Upload relevant documents about destinations, travel tips, etc.
3. **Tools/Functions**: Add custom tools if needed (e.g., search flights, book hotels)
4. **Webhook URL**: Set to `https://yourdomain.com/api/agent/webhook` to receive conversation data

### 4. Package Installation

The SDK is already installed:

```bash
pnpm add @elevenlabs/elevenlabs-js
```

## API Routes

### Start a Call: `/api/agent/start-call`

**POST** request that creates a signed URL for a conversation:

```typescript
// Request
{
  "phoneNumber": "+1234567890"  // Optional for web-based calls
}

// Response
{
  "success": true,
  "signedUrl": "https://..."
}
```

### Webhook: `/api/agent/webhook`

Receives conversation data after a call completes. Payload includes:

- `conversation_id`: Unique conversation identifier
- `agent_id`: Your agent ID
- `status`: Call status (completed, failed, etc.)
- `transcript`: Full conversation transcript
- `analysis`: Sentiment, summary (if enabled)

## Usage in Your App

### Basic Example

```tsx
import { ElevenLabsCallButton } from "@/components/ElevenLabsCallButton";

export default function TravelPlanPage() {
	return (
		<div>
			<h1>Plan Your Trip</h1>
			<ElevenLabsCallButton />
		</div>
	);
}
```

### Advanced: Custom Integration

```typescript
const startCall = async (userPhoneNumber: string) => {
	const response = await fetch("/api/agent/start-call", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ phoneNumber: userPhoneNumber }),
	});

	const { signedUrl } = await response.json();

	// Open in new window for web-based conversation
	window.open(signedUrl, "_blank");
};
```

## Testing

1. Start your dev server: `pnpm dev`
2. Navigate to a page with the call button
3. Click "Start AI Call"
4. A new window will open with the conversational AI interface
5. Talk to the agent using your microphone

## Webhook Testing

Use a tool like [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 3000
```

Then set your webhook URL in ElevenLabs to:

```
https://your-ngrok-url.ngrok.io/api/agent/webhook
```

## Production Deployment

1. Deploy your Next.js app (Vercel, Railway, etc.)
2. Update the webhook URL in ElevenLabs to your production domain
3. Ensure environment variables are set in your hosting platform
4. Test the integration end-to-end

## Troubleshooting

### "Unauthorized" Error

- Check that `ELEVENLABS_API_KEY` is set correctly
- Verify the API key is active in the ElevenLabs dashboard

### "Agent not found" Error

- Confirm `ELEVENLABS_AGENT_ID` matches your agent in the dashboard
- Ensure the agent is published and active

### Webhook Not Receiving Data

- Verify the webhook URL is publicly accessible
- Check that `ELEVEN_WEBHOOK_SECRET` matches in both places
- Look at your server logs for incoming requests

### No Audio in Call

- Ensure microphone permissions are granted in the browser
- Check that the agent has voice settings configured
- Test with a different browser if issues persist

## Additional Features

### Phone Calls (Requires Phone Number Add-on)

If you have ElevenLabs phone calling enabled, you can initiate actual phone calls:

```typescript
// In your API route
const call = await fetch("https://api.elevenlabs.io/v1/convai/phone/call", {
	method: "POST",
	headers: {
		"xi-api-key": env.ELEVENLABS_API_KEY,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		agent_id: env.ELEVENLABS_AGENT_ID,
		phone_number: phoneNumber,
	}),
});
```

### Custom Variables

Pass custom data to your agent:

```typescript
// When getting signed URL, add query params
const signedUrl = `${baseUrl}?userId=${userId}&tripType=international`;
```

## Resources

- [ElevenLabs Docs](https://elevenlabs.io/docs/conversational-ai/overview)
- [API Reference](https://elevenlabs.io/docs/api-reference/conversational-ai)
- [Agent Configuration Guide](https://elevenlabs.io/docs/conversational-ai/guides/agent-configuration)
