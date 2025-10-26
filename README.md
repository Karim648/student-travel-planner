# 🌍 BudgetBuddy - AI Travel Planner for StudentsThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A Next.js-powered travel planning application that uses AI to help students plan budget-friendly trips. Features conversational AI for natural planning discussions and AI-generated personalized recommendations.## Getting Started



![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)First, run the development server:

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)```bash

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)npm run dev

# or

## ✨ Featuresyarn dev

# or

- 🎙️ **Conversational AI Planning** - Talk to an AI assistant about your travel plans using ElevenLabs voice AIpnpm dev

- 🤖 **AI-Powered Recommendations** - Get personalized activity, hotel, and restaurant suggestions using Google Gemini# or

- 💾 **Conversation History** - All conversations are saved and accessible from your dashboardbun dev

- 📊 **Analytics Dashboard** - View all your past conversations with status tracking and summaries```

- 🔐 **Secure Authentication** - User authentication powered by Clerk

- 💳 **Budget-Focused** - Recommendations tailored for student budgetsOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## 🚀 Tech StackYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



- **Framework:** Next.js 15 (App Router)This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Language:** TypeScript

- **Database:** PostgreSQL (Neon)## Learn More

- **ORM:** Drizzle ORM

- **Authentication:** ClerkTo learn more about Next.js, take a look at the following resources:

- **AI Services:**

  - ElevenLabs Conversational AI (voice conversations)- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

  - Google Gemini API (personalized recommendations)- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Styling:** Tailwind CSS + shadcn/ui

- **Deployment:** Vercel-readyYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



## 📋 Prerequisites## Deploy on Vercel



Before you begin, ensure you have:The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



- Node.js 18+ installedCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- pnpm installed (`npm install -g pnpm`)
- A PostgreSQL database (Neon recommended)
- API keys for:
  - Clerk (authentication)
  - ElevenLabs (conversational AI)
  - Google Gemini (AI recommendations)

## 🛠️ Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd student-travel-planner
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your credentials in `.env.local`:

\`\`\`env
# Database
DATABASE_URL=your_neon_postgres_url

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx

# ElevenLabs Conversational AI
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
ELEVEN_WEBHOOK_SECRET=optional_webhook_secret

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 4. Run Database Migrations

\`\`\`bash
pnpm db:generate
pnpm db:migrate
\`\`\`

### 5. Start the Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Getting API Keys

### Clerk (Authentication)
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your API keys from the dashboard
4. Configure webhook endpoint: `/api/webhooks/clerk`

### ElevenLabs (Conversational AI)
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Navigate to Conversational AI section
3. Create a new agent with the prompt:
   > "You are a helpful travel planning assistant for students. Help them plan affordable trips, suggest destinations, and provide budget-friendly recommendations."
4. Copy your API key and Agent ID
5. Configure webhook URL: `https://your-domain.com/api/agent/webhook`

### Google Gemini (AI Recommendations)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your environment variables

## 📁 Project Structure

\`\`\`
├── drizzle/              # Database migrations
├── src/
│   ├── app/
│   │   ├── (auth)/       # Authentication pages
│   │   ├── api/          # API routes
│   │   ├── conversation/ # Voice AI conversation page
│   │   ├── dashboard/    # User dashboard
│   │   └── recommendations/ # AI recommendations display
│   ├── components/       # React components
│   ├── db/              # Database schema and config
│   ├── env/             # Environment variable validation
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
└── public/              # Static assets
\`\`\`

## 🎯 User Flow

1. **Sign Up/Sign In** - User creates an account or logs in
2. **Start Conversation** - Navigate to `/conversation` and talk to the AI assistant about travel plans
3. **AI Processes** - Conversation is saved to database via webhook
4. **View Dashboard** - See all past conversations on `/dashboard`
5. **Get Recommendations** - Click "View Recommendations" on any completed conversation
6. **Browse Suggestions** - View AI-generated activities, hotels, and restaurants

## 🔐 Webhooks Setup

### Clerk Webhook (User Sync)
Configure in Clerk Dashboard:
- **Endpoint:** `https://your-domain.com/api/webhooks/clerk`
- **Events:** `user.created`, `user.updated`, `user.deleted`

### ElevenLabs Webhook (Conversation Data)
Configure in ElevenLabs Dashboard:
- **Endpoint:** `https://your-domain.com/api/agent/webhook`
- **Events:** Conversation completed

**For local testing**, use [ngrok](https://ngrok.com):
\`\`\`bash
ngrok http 3000
# Use the ngrok URL as your webhook endpoint
\`\`\`

## 🧪 Testing

### Create a Demo Conversation
\`\`\`bash
curl -X POST http://localhost:3000/api/create-demo-conversation
\`\`\`

### Test Webhook Manually
\`\`\`bash
curl -X POST http://localhost:3000/api/agent/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversation_id": "test_123",
    "agent_id": "agent_test",
    "status": "completed",
    "metadata": {"userId": "user_xxx"},
    "transcript": [
      {"role": "user", "message": "I want to travel to Paris"},
      {"role": "agent", "message": "Great! What is your budget?"}
    ],
    "analysis": {
      "sentiment": "positive",
      "summary": "User wants to travel to Paris"
    }
  }'
\`\`\`

## 📚 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!
5. Update webhook URLs with your production domain

### Environment Variables for Production
Make sure to add all environment variables from `.env.example` in your Vercel project settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io) for conversational AI
- [Google Gemini](https://ai.google.dev/) for AI recommendations
- [Clerk](https://clerk.com) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Vercel](https://vercel.com) for hosting

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for students who love to travel on a budget**
