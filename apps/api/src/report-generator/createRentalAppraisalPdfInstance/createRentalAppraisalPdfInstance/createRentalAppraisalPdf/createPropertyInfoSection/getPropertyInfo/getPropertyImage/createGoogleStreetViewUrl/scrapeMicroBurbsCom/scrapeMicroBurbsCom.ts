import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";
import { Address } from "../../../../../../../../../shared/types";
import { formatSuburbForMicroBurbsUrl } from "../formatSuburbForMicroBurbsUrl/formatSuburbForMicroBurbsUrl";

async function scrapeMicroBurbsCom(address: Address): Promise<void> {
  const formattedSuburb = formatSuburbForMicroBurbsUrl(address);
  const url = `https://www2.microburbs.com.au/suburb-report?suburb=${formattedSuburb}&paid=true`;

  // Launch with more realistic browser settings to avoid bot detection
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "en-AU",
    timezoneId: "Australia/Melbourne",
    extraHTTPHeaders: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-AU,en;q=0.9",
      "Sec-Ch-Ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const page = await context.newPage();

  // Hide webdriver property
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  });

  try {
    console.log(`🌐 Navigating to ${url}`);

    // Go to homepage first to establish cookies/session
    await page.goto("https://www2.microburbs.com.au/", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1000);

    // Now go to the suburb report page
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait for content to load
    await page.waitForTimeout(3000);

    console.log("✅ Page loaded successfully");

    // Get the fully rendered HTML
    const htmlContent = await page.content();

    // Save to propertyPageMicroBurbs.html in the same directory as this script
    const outputPath = path.join(__dirname, "propertyPageMicroBurbs.html");
    fs.writeFileSync(outputPath, htmlContent, "utf-8");
    console.log(`💾 Saved HTML to ${outputPath}`);
  } catch (err) {
    console.error("❌ Error scraping microburbs.com.au:", err);

    // Save screenshot on error
    try {
      await page.screenshot({ path: "microburbs-error.png", fullPage: true });
      console.log("📸 Saved error screenshot to microburbs-error.png");
    } catch (screenshotErr) {
      console.error("Could not save screenshot:", screenshotErr);
    }
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
}

// -----------------------------
// Bun/Node main
// -----------------------------
if (import.meta.main) {
  const address: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  scrapeMicroBurbsCom(address).then(() => {
    console.log("✅ Scraping completed");
  });
}

export { scrapeMicroBurbsCom };
