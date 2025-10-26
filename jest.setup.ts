import "@testing-library/jest-dom";

// Mock environment variables for tests
process.env.GEMINI_API_KEY = "test-api-key";
process.env.DATABASE_URL = "test-db-url";
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
process.env.CLERK_SECRET_KEY = "test-clerk-secret";
