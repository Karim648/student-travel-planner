# Testing Guide

## Running Tests

This project uses Jest for testing. Tests verify the core logic of the application without requiring manual testing.

### Test Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Current Test Coverage

#### Recommendations API (`recommendations-logic.test.ts`)

Tests the core JSON processing logic for the Gemini API integration:

✅ **JSON Cleaning**

- Removes trailing commas from objects and arrays
- Handles nested structures
- Fixes common LLM-generated JSON issues

✅ **JSON Extraction**

- Extracts JSON from markdown code blocks
- Handles plain JSON responses
- Works with extra text around JSON

✅ **Data Structure Validation**

- Validates recommendation structure
- Checks activity/hotel/restaurant formats
- Ensures rating ranges (0-5)

✅ **Full Processing Pipeline**

- End-to-end JSON processing
- Handles Gemini responses with markdown
- Processes responses with trailing commas

### Test Strategy

Instead of manually clicking "Try Again" on the recommendations page, you can:

1. **Run tests after making changes:**

   ```bash
   pnpm test
   ```

2. **Use watch mode during development:**

   ```bash
   pnpm test:watch
   ```

   This will automatically rerun tests when you save files.

3. **Check coverage to find untested code:**
   ```bash
   pnpm test:coverage
   ```

### Adding New Tests

To add tests for new features:

1. Create a new test file in `src/app/api/__tests__/`
2. Name it `*.test.ts` or `*.test.tsx`
3. Import testing utilities:

   ```typescript
   import { describe, it, expect } from "@jest/globals";
   ```

4. Write your tests:
   ```typescript
   describe("My Feature", () => {
   	it("should do something", () => {
   		// Arrange
   		const input = "test";

   		// Act
   		const result = processInput(input);

   		// Assert
   		expect(result).toBe("expected");
   	});
   });
   ```

### Benefits of Automated Testing

- ✅ **Faster feedback** - No need to manually test after each change
- ✅ **Catch regressions** - Ensure old features still work
- ✅ **Better code quality** - Writing testable code leads to better design
- ✅ **Documentation** - Tests show how code should be used
- ✅ **Confidence** - Deploy with confidence knowing tests pass

### Current Test Results

All 28 tests passing! ✅

```
Test Suites: 2 passed, 2 total
Tests:       28 passed, 28 total
```

### Troubleshooting

If tests fail:

1. Read the error message carefully
2. Check the test file to understand what's being tested
3. Fix the bug in your code
4. Re-run tests to verify the fix

If you see "Unexpected end of JSON input" in production but tests pass:

- Tests validate the JSON cleaning logic
- Check server logs for what Gemini actually returned
- The cleaning logic should handle most cases, but LLMs can be unpredictable
