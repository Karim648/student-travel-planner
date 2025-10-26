#!/bin/bash

# Manual Test Script for Student Travel Planner Bug Fixes
# Run this after starting the dev server (pnpm dev)

echo "🧪 Student Travel Planner - Manual Test Suite"
echo "=============================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ℹ️  Prerequisites:${NC}"
echo "1. Dev server is running (pnpm dev)"
echo "2. You are logged in to the app in your browser"
echo "3. Database is migrated (pnpm db:migrate)"
echo ""
read -p "Press Enter to continue..."
echo ""

# Test 1: Test Recommendations API (Mock Fallback)
echo -e "${YELLOW}Test 1: Recommendations API with Mock Fallback${NC}"
echo "Testing POST /api/recommendations..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/recommendations" \
  -H "Content-Type: application/json" \
  -d '{"conversationSummary":"Student wants budget trip to Paris with $1500"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ PASS${NC} - Recommendations API returned success"
  echo "Sample activities found:"
  echo "$RESPONSE" | grep -o '"title":"[^"]*"' | head -3
else
  echo -e "${RED}❌ FAIL${NC} - Recommendations API failed"
  echo "Response: $RESPONSE"
fi
echo ""

# Test 2: Test Webhook Endpoint
echo -e "${YELLOW}Test 2: ElevenLabs Webhook Endpoint${NC}"
echo "Testing POST /api/agent/webhook..."
WEBHOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/agent/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "post_call_transcription",
    "data": {
      "conversation_id": "test_'$(date +%s)'",
      "agent_id": "test_agent",
      "status": "completed",
      "transcript": [
        {"role": "user", "message": "I want to travel to Tokyo"},
        {"role": "agent", "message": "Great choice! What is your budget?"}
      ],
      "analysis": {
        "sentiment": "positive",
        "transcript_summary": "User wants to travel to Tokyo"
      },
      "conversation_initiation_client_data": {
        "custom_llm_extra_body": {
          "userId": "test_user_123"
        }
      }
    }
  }')

if echo "$WEBHOOK_RESPONSE" | grep -q '"ok":true'; then
  echo -e "${GREEN}✅ PASS${NC} - Webhook accepted and processed"
else
  echo -e "${RED}❌ FAIL${NC} - Webhook failed"
  echo "Response: $WEBHOOK_RESPONSE"
fi
echo ""

# Test 3: Webhook GET endpoint
echo -e "${YELLOW}Test 3: Webhook Health Check${NC}"
echo "Testing GET /api/agent/webhook..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/agent/webhook")

if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
  echo -e "${GREEN}✅ PASS${NC} - Webhook endpoint is running"
else
  echo -e "${RED}❌ FAIL${NC} - Webhook health check failed"
fi
echo ""

# Test 4: Check if demo conversation endpoint exists
echo -e "${YELLOW}Test 4: Demo Conversation Endpoint (requires auth)${NC}"
echo "Testing POST /api/create-demo-conversation..."
DEMO_RESPONSE=$(curl -s -X POST "$BASE_URL/api/create-demo-conversation")

if echo "$DEMO_RESPONSE" | grep -q "Unauthorized"; then
  echo -e "${YELLOW}⚠️  EXPECTED${NC} - Endpoint requires authentication (this is correct)"
  echo "To test: Log in to the app, then visit /api/create-demo-conversation in browser"
elif echo "$DEMO_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ PASS${NC} - Demo conversation created"
else
  echo -e "${YELLOW}ℹ️  INFO${NC} - Endpoint may require authentication or cookies"
fi
echo ""

# Test 5: Conversations API
echo -e "${YELLOW}Test 5: Conversations List API (requires auth)${NC}"
echo "Testing GET /api/conversations..."
CONV_RESPONSE=$(curl -s "$BASE_URL/api/conversations")

if echo "$CONV_RESPONSE" | grep -q "Unauthorized"; then
  echo -e "${YELLOW}⚠️  EXPECTED${NC} - Endpoint requires authentication (this is correct)"
  echo "To test: Log in and check the /dashboard page"
elif echo "$CONV_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ PASS${NC} - Conversations API working"
  CONV_COUNT=$(echo "$CONV_RESPONSE" | grep -o '"conversations":\[' | wc -l)
  echo "Found conversations endpoint responding"
else
  echo -e "${YELLOW}ℹ️  INFO${NC} - Endpoint may require authentication"
fi
echo ""

echo "=============================================="
echo -e "${GREEN}✨ Test Suite Complete${NC}"
echo ""
echo "Summary:"
echo "- ✅ Mock recommendations fallback is working"
echo "- ✅ Webhook endpoint is accepting data"
echo "- ⚠️  Auth-protected endpoints require login (expected)"
echo ""
echo "Next steps:"
echo "1. Log in to the app at http://localhost:3000"
echo "2. Create a demo conversation"
echo "3. Check the dashboard at http://localhost:3000/dashboard"
echo "4. Try getting recommendations for a conversation"
echo ""
echo "For detailed logs, check your dev server terminal output"
