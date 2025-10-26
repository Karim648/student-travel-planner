# AI Conversation & Dashboard Feature

This document explains the new conversation and dashboard features for the Student Travel Planner app.

## Overview

You can now have AI-powered conversations about travel planning, and all conversations are automatically saved to your dashboard for later review.

## Features Implemented

### 1. **Conversation Page** (`/conversation`)

- Protected route (requires authentication)
- Simple interface to start an AI conversation
- Opens ElevenLabs conversational AI in a new window
- Passes user ID automatically for tracking

### 2. **Dashboard Page** (`/dashboard`)

- Protected route (requires authentication)
- Displays all your past conversations
- Shows conversation summaries, status, and timestamps
- Click any conversation to view full details including transcript
- Modal view for detailed conversation review

### 3. **Database Integration**

- New `conversations` table stores all conversation data
- Automatically populated via webhook when conversations complete
- Linked to user via Clerk userId

### 4. **API Routes**

#### `/api/agent/start-call` (POST)

- Creates a signed URL for ElevenLabs conversation
- Requires authentication
- Appends userId to metadata for tracking

#### `/api/agent/webhook` (POST)

- Receives conversation data from ElevenLabs
- Stores in database with summary, transcript, and analysis
- Protected by optional webhook secret

#### `/api/conversations` (GET)

- Fetches all conversations for authenticated user
- Returns conversations sorted by newest first

### 5. **Navigation**

- Updated Navbar with links to conversation and dashboard pages
- Shows different options for signed-in vs signed-out users
- Home page with call-to-action buttons

## Database Schema

### `conversations` Table

```typescript
{
  id: integer (primary key, auto-increment)
  userId: varchar(255) - Clerk user ID
  conversationId: varchar(255) - ElevenLabs conversation ID (unique)
  agentId: varchar(255) - ElevenLabs agent ID
  status: varchar(50) - 'completed', 'failed', 'in-progress'
  transcript: jsonb - Array of conversation messages
  analysis: jsonb - Sentiment, summary from ElevenLabs
  summary: text - Human-readable summary
  createdAt: timestamp - When conversation was created
  updatedAt: timestamp - Last update time
}
```

## User Flow

1. **Start Conversation**:

   - User navigates to `/conversation`
   - Clicks "Start AI Conversation"
   - App calls `/api/agent/start-call`
   - User is redirected to ElevenLabs interface
   - User has conversation with AI travel assistant

2. **Conversation Complete**:

   - ElevenLabs sends webhook to `/api/agent/webhook`
   - Webhook stores conversation data in database
   - Summary is automatically generated from transcript

3. **Review Conversations**:
   - User navigates to `/dashboard`
   - Sees all past conversations as cards
   - Clicks a card to view full transcript and details

## Environment Variables Required

Add these to your `.env.local`:

```env
# Database
DATABASE_URL=your_postgres_url

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
ELEVEN_WEBHOOK_SECRET=your_webhook_secret (optional)
```

## Protected Routes

Both `/conversation` and `/dashboard` are in the `(protected)` folder, which means:

- Users must be signed in to access them
- Clerk middleware automatically redirects unauthenticated users to sign-in
- API routes check authentication before processing

## How to Test

1. **Start the dev server**:

   ```bash
   pnpm dev
   ```

2. **Sign in** to your account

3. **Start a conversation**:

   - Go to http://localhost:3000/conversation
   - Click "Start AI Conversation"
   - Talk to the AI assistant

4. **View dashboard**:
   - After conversation, go to http://localhost:3000/dashboard
   - (For testing, you may need to manually trigger the webhook or wait for ElevenLabs to send it)

## Webhook Testing

To test the webhook locally:

1. Use ngrok to expose your local server:

   ```bash
   ngrok http 3000
   ```

2. In ElevenLabs dashboard, set webhook URL to:

   ```
   https://your-ngrok-url.ngrok.io/api/agent/webhook
   ```

3. If using `ELEVEN_WEBHOOK_SECRET`, set it in both:
   - ElevenLabs dashboard (as Bearer token)
   - Your `.env.local` file

## Database Migration

The conversations table was created with:

```bash
pnpm db:generate  # Generate migration
pnpm db:migrate   # Apply migration
```

If you need to reset or recreate the database, run these commands again.

## Future Enhancements

Potential improvements:

- Search/filter conversations on dashboard
- Export conversation summaries as PDF
- Share conversations with friends
- AI-generated trip itineraries from conversations
- Integration with booking APIs
- Voice-to-text transcript improvements
- Real-time conversation updates

## Troubleshooting

### "Unauthorized" when starting conversation

- Make sure you're signed in
- Check that Clerk is properly configured

### Conversations not appearing on dashboard

- Verify webhook is configured correctly in ElevenLabs
- Check server logs for webhook errors
- Ensure `ELEVENLABS_AGENT_ID` matches your agent

### Database errors

- Run `pnpm db:migrate` to ensure schema is up to date
- Check `DATABASE_URL` is set correctly
- Verify database connection

### TypeScript errors

- Run `pnpm build` to check for compilation errors
- Ensure all dependencies are installed with `pnpm install`
