# Webhook Troubleshooting Guide

## Problem
Conversations are not being saved to the database after completion. The ElevenLabs dashboard shows "No user ID" in the metadata.

## Root Cause
The userId was not being properly passed from the client through to the ElevenLabs webhook.

## Fixes Applied

### 1. Updated Widget Configuration (`/conversation/page.tsx`)
Changed from `conversation-metadata` to `client-metadata`:
```typescript
widget.setAttribute("client-metadata", JSON.stringify({ userId: userId }));
```

### 2. Updated Webhook Handler (`/api/agent/webhook/route.ts`)
Enhanced userId extraction to check multiple locations:
- `metadata.userId`
- `conversation_initiation_client_data.userId`
- `conversation_initiation_client_data.custom_llm_extra_body.userId`
- Other fallback locations

### 3. Updated Start Call API (`/api/agent/start-call/route.ts`)
Changed to pass metadata correctly for server-initiated calls.

## Testing the Fix

### Step 1: Check Webhook URL in ElevenLabs Dashboard
1. Go to https://elevenlabs.io/app/agents
2. Click on your Travel Guide agent
3. Go to Settings → Webhooks
4. Verify webhook URL is set to: `https://your-ngrok-url.ngrok.io/api/agent/webhook`
5. Make sure "Post-call transcription" is enabled

### Step 2: Test the Conversation Flow
1. Start your dev server: `pnpm dev`
2. Start ngrok: `ngrok http 3000`
3. Update webhook URL in ElevenLabs with your ngrok URL
4. Go to `/conversation` in your app
5. Start a conversation
6. Complete the conversation (hang up)
7. **Check your terminal logs** for:
   - `🔔 ElevenLabs webhook endpoint hit!`
   - `👤 User ID from webhook: [your-clerk-user-id]`
   - `✅ Conversation saved to database!`

### Step 3: Verify in Database
Visit the debug endpoint:
```
http://localhost:3000/api/debug/webhook-test
```

Or check dashboard:
```
http://localhost:3000/dashboard
```

## Common Issues

### Issue: "No user ID" in ElevenLabs Dashboard
**Solution**: The userId is now passed via `client-metadata` which ElevenLabs should include in the webhook payload under `conversation_initiation_client_data`.

### Issue: Webhook not being called
**Check**:
1. Webhook URL is correct in ElevenLabs dashboard
2. Ngrok is running and URL matches
3. Post-call transcription webhook is enabled in ElevenLabs

### Issue: Conversation saved with userId="unknown"
**Debug**:
1. Check terminal logs for the full webhook payload
2. Look for `📍 Conversation initiation data:` in logs
3. Verify the userId is in the payload somewhere
4. Update the webhook handler to extract from the correct location

## Debugging Commands

### Check recent conversations:
```bash
curl http://localhost:3000/api/debug/webhook-test
```

### Check webhook endpoint is responding:
```bash
curl http://localhost:3000/api/agent/webhook
```

### Monitor terminal logs:
Look for these emojis in your terminal:
- 🔔 = Webhook received
- 👤 = User ID extraction
- ✅ = Database save success
- ❌ = Error occurred
- ⚠️ = Warning

## Next Steps

1. Test with a new conversation
2. Verify userId appears in terminal logs
3. Check dashboard shows the conversation
4. If still failing, check the full webhook payload in terminal
5. Update extraction logic based on actual payload structure

## Important Notes

- ElevenLabs widget attribute is `client-metadata` (not `conversation-metadata`)
- The webhook payload structure may vary - check actual payload in logs
- Conversations are saved even with userId="unknown" for debugging
- Check ElevenLabs dashboard conversation history for additional details
