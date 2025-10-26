# Quick Fix: Setting Up ElevenLabs Credentials

## The Problem

You're getting "Failed to start conversation" because the ElevenLabs API credentials are not configured.

## The Solution

### Step 1: Get Your ElevenLabs Credentials

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app)
2. Sign up or log in
3. Get your API Key:

   - Go to Settings → API Keys
   - Copy your API key

4. Create an Agent:
   - Go to Conversational AI section
   - Click "Create New Agent" (or use an existing one)
   - Configure your agent with:
     - Name: "Travel Planning Assistant"
     - System Prompt: "You are a helpful travel planning assistant for students. Help them plan affordable trips, suggest destinations, and provide budget-friendly recommendations."
   - Copy the Agent ID from the agent settings

### Step 2: Create `.env.local` File

In your project root (`/Users/karimyoussef/Documents/GitHub/fullstack-practice/student-travel-planner/`), create a file called `.env.local`:

```env
# Database (you should already have this)
DATABASE_URL=your_database_url_here

# Clerk (you should already have these)
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# ElevenLabs - ADD THESE NEW ONES
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_AGENT_ID=your_agent_id_here

# Optional: for webhook security
ELEVEN_WEBHOOK_SECRET=any_random_secret_string
```

### Step 3: Restart Your Dev Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart it
pnpm dev
```

### Step 4: Test Again

1. Go to http://localhost:3000/conversation
2. Click "Start AI Conversation"
3. It should now open the ElevenLabs conversation interface!

## Troubleshooting

### "ElevenLabs is not configured" Error

- Make sure you created `.env.local` in the project root (not in `src/`)
- Restart your dev server after adding the file
- Check that there are no typos in the variable names

### "Unauthorized" or "Invalid API Key" Error

- Verify your API key is correct
- Make sure you copied the entire key
- Check that your ElevenLabs account is active

### "Agent not found" Error

- Verify your Agent ID is correct
- Make sure the agent is published/active in ElevenLabs dashboard

### Still Having Issues?

Check the terminal where `pnpm dev` is running - it will show detailed error messages that can help diagnose the problem.

## What Happens Next

Once configured correctly:

1. User clicks "Start AI Conversation"
2. App creates a signed URL from ElevenLabs
3. User is redirected to ElevenLabs interface
4. User talks with the AI assistant
5. When done, the conversation is saved to your database
6. User can view it on the dashboard

## Need Help?

If you don't have an ElevenLabs account or need help setting up the agent, let me know and I can guide you through it!
