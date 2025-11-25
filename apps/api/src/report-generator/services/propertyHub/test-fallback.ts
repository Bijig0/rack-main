/**
 * Test script for fallback scraper integration
 *
 * Run with: bun run src/report-generator/services/propertyHub/test-fallback.ts
 */

import { PropertyHubService, initializeFallbackScrapers } from "./index";

async function testFallbackScrapers() {
  console.log("🧪 Testing Fallback Scraper Integration\n");
  console.log("=".repeat(60));

  // Step 1: Initialize fallback scrapers
  console.log("\n📝 Step 1: Initializing fallback scrapers...\n");
  initializeFallbackScrapers({
    // propertyId: "11097147", // Uncomment if you want to test Property.com
  });

  // Step 2: Test with a real address
  const testAddress = "7 English Place, Kew, VIC 3101";
  console.log(`\n📍 Step 2: Testing with address: ${testAddress}\n`);
  console.log("=".repeat(60));

  try {
    // Fetch property data with fallbacks enabled
    const propertyData = await PropertyHubService.getPropertyData(testAddress, {
      enableFallbacks: true,
      maxFallbacks: 3,
      // forceRefresh: true, // Uncomment to bypass cache
    });

    console.log("\n" + "=".repeat(60));
    console.log("📊 Final Results:");
    console.log("=".repeat(60));
    console.log(JSON.stringify(propertyData, null, 2));

    // Check which fields were filled
    console.log("\n" + "=".repeat(60));
    console.log("✅ Fields Present:");
    console.log("=".repeat(60));

    const fieldsToCheck = [
      "yearBuilt",
      "floorArea",
      "landArea",
      "propertyType",
      "council",
      "distanceFromCBD",
      "nearbySchools",
      "appraisalSummary",
      "estimatedValueRange",
    ] as const;

    for (const field of fieldsToCheck) {
      const value = propertyData[field];
      const hasValue = value !== null && value !== undefined && value !== "";
      console.log(`  ${hasValue ? "✅" : "❌"} ${field}: ${hasValue ? "Present" : "Missing"}`);
    }
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Test completed!");
  console.log("=".repeat(60));
}

// Run test if this file is executed directly
if (import.meta.main) {
  testFallbackScrapers().catch(console.error);
}

export { testFallbackScrapers };
