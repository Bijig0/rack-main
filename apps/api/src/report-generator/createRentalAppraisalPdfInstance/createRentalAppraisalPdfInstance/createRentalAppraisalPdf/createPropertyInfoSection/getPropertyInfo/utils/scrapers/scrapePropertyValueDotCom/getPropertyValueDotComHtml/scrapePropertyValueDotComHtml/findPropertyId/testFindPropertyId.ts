/**
 * Test script to verify the property ID finder works
 * Run with: bun run testFindPropertyId.ts
 */

import { connect } from "puppeteer-real-browser";
import { Address } from "../../../../../../../../../../../../shared/types";
import { findPropertyId } from "./findPropertyId";

async function testFindPropertyId() {
  console.log("🚀 Testing PropertyValue.com.au property ID finder...\n");

  const { browser, page } = await connect({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    customConfig: {},
    turnstile: true,
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  try {
    // Test with 7 English Place, Kew
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    console.log(`Testing address: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}\n`);

    const { propertyId } = await findPropertyId({ address, page });

    if (propertyId) {
      console.log(`\n✅ SUCCESS! Found property ID: ${propertyId}`);
      console.log(`📎 Full URL: https://www.propertyvalue.com.au/property/7-english-place-kew-vic-3101/${propertyId}`);
    } else {
      console.log("\n❌ FAILED: Could not find property ID");
    }

  } catch (error) {
    console.error("\n❌ ERROR:", error);
  } finally {
    await browser.close();
  }
}

if (import.meta.main) {
  testFindPropertyId();
}
