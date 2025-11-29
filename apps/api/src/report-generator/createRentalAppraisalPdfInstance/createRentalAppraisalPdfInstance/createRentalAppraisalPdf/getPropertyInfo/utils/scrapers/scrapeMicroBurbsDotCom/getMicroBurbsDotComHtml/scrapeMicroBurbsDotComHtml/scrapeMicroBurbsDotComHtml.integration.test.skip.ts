// scrapeMicroBurbsDotComHtml.integration.test.ts
// Full integration test with the actual scraper function using Puppeteer
import { afterEach, expect, test } from "bun:test";
import { Either } from "effect";
import fs from "fs/promises";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";
import { fileURLToPath } from "url";
import type { Address } from "../../../../createReportCache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let browser: Browser;
let page: Page;

afterEach(async () => {
  if (browser) {
    await browser.close();
  }
});

test("microburbs.com.au full scraping flow with mocked responses", async () => {
  // Launch Puppeteer browser for testing
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  // Load fixtures
  const homepagePath = path.join(__dirname, "fixtures", "homepage.html");
  const suburbReportPath = path.join(
    __dirname,
    "fixtures",
    "suburb-report.html"
  );

  const homepageContent = await fs.readFile(homepagePath, "utf-8");
  const suburbReportContent = await fs.readFile(suburbReportPath, "utf-8");

  // Intercept requests and return mock responses
  page.on("request", (request) => {
    const url = request.url();

    if (url === "https://www2.microburbs.com.au/") {
      request.respond({
        status: 200,
        contentType: "text/html",
        body: homepageContent,
      });
    } else if (url.includes("suburb-report")) {
      request.respond({
        status: 200,
        contentType: "text/html",
        body: suburbReportContent,
      });
    } else {
      request.respond({
        status: 200,
        contentType: "text/html",
        body: "<html></html>",
      });
    }
  });

  // Import scrapeMicroBurbsDotComHtml
  const { scrapeMicroBurbsDotComHtml } = await import(
    "./scrapeMicroBurbsDotComHtml"
  );

  const address: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  // Pass the test page to scrapeMicroBurbsDotComHtml
  const result = await scrapeMicroBurbsDotComHtml({
    address,
    page,
    browser,
  });

  // Handle Either result
  expect(Either.isRight(result)).toBe(true);

  if (Either.isRight(result)) {
    const html = result.right.html;

    // Verify the HTML contains expected content from the fixture
    expect(html).toContain("Kew (Vic.) Suburb Report");
    expect(html).toContain("25,123"); // Population
    expect(html).toContain("42 years"); // Median age
    expect(html).toContain("$95,000"); // Median household income
    expect(html).toContain("$2,450,000"); // Median house price
    expect(html).toContain("8.5%"); // Annual growth
    expect(html).toContain("Outstanding"); // Schools rating

    console.log(
      `✅ Test passed - HTML size: ${(html.length / 1024).toFixed(2)} KB`
    );
  }
});
