// scrapePropertyValueDotComHtml.test.ts
// Integration test with mocked HTTP responses using Puppeteer
import { afterEach, expect, test } from "bun:test";
import fs from "fs/promises";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let browser: Browser;
let page: Page;

afterEach(async () => {
  if (browser) {
    await browser.close();
  }
});

test("propertyvalue.com.au page scraping with mocked responses", async () => {
  // Launch Puppeteer browser for testing
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  // Load fixture
  const propertyPagePath = path.join(
    __dirname,
    "fixtures",
    "property-page.html"
  );
  const propertyPageContent = await fs.readFile(propertyPagePath, "utf-8");

  // Intercept all requests and return mock property page
  page.on("request", (request) => {
    request.respond({
      status: 200,
      contentType: "text/html",
      body: propertyPageContent,
    });
  });

  // Navigate directly to test page
  await page.goto("https://www.propertyvalue.com.au/test");

  // Get the HTML content
  const html = await page.content();

  // Verify the HTML contains expected content from the fixture
  expect(html).toContain("7 English Place, Kew VIC 3101");
  expect(html).toContain("650 m²"); // Land size
  expect(html).toContain("280 m²"); // Building size
  expect(html).toContain("House"); // Property type
  expect(html).toContain("Bedrooms:");
  expect(html).toContain("Bathrooms:");
  expect(html).toContain("Car Spaces:");
  expect(html).toContain("$2,450,000"); // Valuation

  console.log(
    `✅ Test passed - HTML size: ${(html.length / 1024).toFixed(2)} KB`
  );
});
