/**
 * Test script for searchAndNavigate function
 * Run with: bun run testSearchAndNavigate.ts
 */

import { connect } from "puppeteer-real-browser";
import { Address } from "../../../../../../../../../../../shared/types";
import { searchAndNavigate } from "./searchAndNavigate";

async function testSearchAndNavigate() {
  console.log("🚀 Testing PropertyValue.com.au search and navigate...\n");

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
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    console.log(
      `Testing address: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}\n`
    );

    await searchAndNavigate({ address, page });

    console.log("\n✅ SUCCESS! Successfully navigated to property page");
    console.log(`📍 Current URL: ${page.url()}`);

    // Take a screenshot
    await page.screenshot({ path: "propertyvalue-test.png", fullPage: true });
    console.log("📸 Screenshot saved to propertyvalue-test.png");
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    await page.screenshot({ path: "propertyvalue-error.png", fullPage: true });
    console.log("📸 Error screenshot saved to propertyvalue-error.png");
  } finally {
    console.log("\n⏳ Waiting 5 seconds before closing...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await browser.close();
  }
}

if (import.meta.main) {
  testSearchAndNavigate();
}
