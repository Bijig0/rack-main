import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";
import { Address } from "../../../../../../../../../shared/types";
import { formatAddressForRealEstateComUrl } from "../formatAddressForRealEstateComUrl/formatAddressForRealEstateComUrl";

async function scrapeRealEstateImage(address: Address): Promise<string | null> {
  const formattedAddress = formatAddressForRealEstateComUrl(address);
  const url = `https://www.realestate.com.au/property/${formattedAddress}`;

  // Launch with more realistic browser settings to avoid bot detection
  const browser = await chromium.launch({
    headless: false, // Set to false to see what's happening
    args: [
      "--disable-blink-features=AutomationControlled", // Hide automation
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
    // Add extra headers to look more like a real browser
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
    await page.goto("https://www.realestate.com.au/", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1000);

    // Now go to the property page
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(3000);

    console.log("🔍 Looking for 'For rent' tab...");

    // Click the "For rent" tab
    try {
      const forRentButton = await page.waitForSelector(
        'button[role="tab"]:has-text("For rent")',
        { timeout: 10000 }
      );

      if (forRentButton) {
        console.log("🖱️  Clicking 'For rent' tab...");
        await forRentButton.click();

        // Wait for content to update
        console.log("⏳ Waiting for rental price to load...");
        await page.waitForTimeout(4000); // Wait for tab content to update

        console.log("✅ Rental data loaded successfully");
      }
    } catch (tabError) {
      console.warn("⚠️  'For rent' tab not found:", tabError);
      // Continue anyway - maybe it's already on the rental tab
    }

    // Get the fully rendered HTML after clicking the tab
    const htmlContent = await page.content();

    // Save to propertyPageRentalEstimate.html in the same directory as this script
    const outputPath = path.join(__dirname, "propertyPageRentalEstimate.html");
    fs.writeFileSync(outputPath, htmlContent, "utf-8");
    console.log(`💾 Saved HTML to ${outputPath}`);

    console.log("⏳ Waiting for property images to load...");

    // Try multiple selectors as the site might use different ones
    const selectors = [
      'img[data-testid="property-image"]',
      "img.property-image",
      ".gallery-image img",
      ".slick-slide img",
      'img[alt*="property"]',
      'img[src*="cloudfront"]',
    ];

    let imgSrc: string | null = null;

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        imgSrc = await page.getAttribute(selector, "src");
        if (imgSrc) {
          console.log(`✅ Property image found using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`⚠️ Selector ${selector} not found, trying next...`);
        continue;
      }
    }

    if (!imgSrc) {
      // Save screenshot for debugging
      await page.screenshot({ path: "realestate-debug.png", fullPage: true });
      console.log("📸 Saved debug screenshot to realestate-debug.png");

      // Get page content for debugging
      console.log("Page title:", await page.title());
      console.log("Page URL:", page.url());
    }

    console.log("📸 Image src:", imgSrc);
    return imgSrc;
  } catch (err) {
    console.error("❌ Error scraping property image:", err);

    // Save screenshot on error
    try {
      await page.screenshot({ path: "realestate-error.png", fullPage: true });
      console.log("📸 Saved error screenshot to realestate-error.png");
    } catch (screenshotErr) {
      console.error("Could not save screenshot:", screenshotErr);
    }

    return null;
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

  scrapeRealEstateImage(address).then((src) => {
    if (src) {
      console.log("✅ Property image URL retrieved:", src);
    } else {
      console.log("⚠️ Could not retrieve property image URL");
    }
  });
}
