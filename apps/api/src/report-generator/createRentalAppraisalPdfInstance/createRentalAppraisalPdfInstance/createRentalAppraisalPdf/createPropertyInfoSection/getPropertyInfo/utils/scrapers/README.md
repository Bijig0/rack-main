# Scraper Tests

This directory contains web scrapers for various property data sources with comprehensive test coverage.

## Test Types

### Unit/Fast Tests (`.test.ts`)
These tests run with `bun test:fast` and use Puppeteer with mocked HTTP responses. They are fast and don't require external dependencies.

**Currently Covered:**
- ✅ **Property.com** - Full scraping flow with mocked responses
- ✅ **RealEstate.com** - Full scraping flow with mocked responses
- ✅ **PropertyValue.com.au** - Full scraping flow with mocked responses

### Integration Tests (`.integration.test.ts`)
These tests are more comprehensive integration tests with full scraper functionality. They are **skipped** during fast tests.

**Currently Available:**
- Domain.com - Requires additional setup
- MicroBurbs.com - Requires additional setup
- CoreLogic - Requires authentication credentials

## Running Tests

### Fast Tests (Recommended)
```bash
bun test:fast
```
Runs all unit tests including the Puppeteer-based scraper tests. **Does not require Node.js.**

### Integration Tests
```bash
bun test:integration
```
Runs full integration tests. May require:
- Real API credentials (for CoreLogic)
- Network access
- Longer execution time

## Effect-TS Implementation

All scrapers now use Effect-TS for:
- **Either monad** for explicit success/failure handling
- **Effect generators** for composable async operations
- **Resource management** with `Effect.ensuring` for cleanup
- **Type-safe error handling**

### Example

```typescript
const result = await scrapePropertyDotComHtml({ address, page, browser });

if (Either.isRight(result)) {
  const html = result.right.html;
  // Process successful result
} else {
  // Handle error
  console.error("Scraping failed:", result.left);
}
```

## Adding New Scrapers

When adding a new scraper:

1. Implement the scraper using Effect-TS patterns (see existing scrapers)
2. Create fixtures in a `fixtures/` directory
3. Add a `.test.ts` file with Puppeteer + mocked responses
4. Optionally add a `.integration.test.ts` for full integration testing

## Playwright Tests (Legacy)

The old `.playwright.test.ts` files have been converted to `.integration.test.ts` files using Puppeteer.

**Note:** These integration tests require more setup and are skipped during fast tests. The fast tests provide equivalent coverage with mocked responses.
