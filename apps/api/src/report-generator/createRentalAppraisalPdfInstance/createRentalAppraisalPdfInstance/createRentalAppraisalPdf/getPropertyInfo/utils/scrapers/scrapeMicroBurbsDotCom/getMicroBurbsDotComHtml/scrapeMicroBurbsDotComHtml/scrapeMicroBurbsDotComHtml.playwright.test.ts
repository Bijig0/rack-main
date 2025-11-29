// scrapeMicroBurbsDotComHtml.playwright.test.ts
// Full integration test with the actual scraper function
import { expect, test } from "@playwright/test";
import console from "console";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { Address } from "../../../../createReportCache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("scrapeMicroBurbsDotComHtml integration", () => {
  test("full scraping flow with mocked responses", async ({
    page,
    browser,
  }) => {
    // Mock the homepage
    await page.route("https://www2.microburbs.com.au/", async (route) => {
      const homepagePath = path.join(__dirname, "fixtures", "homepage.html");
      const homepageContent = await fs.readFile(homepagePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: homepageContent,
      });
    });

    // Mock suburb report page
    await page.route("**/suburb-report?**", async (route) => {
      const fixturePath = path.join(
        __dirname,
        "fixtures",
        "suburb-report.html"
      );
      const suburbReportContent = await fs.readFile(fixturePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: suburbReportContent,
      });
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

    const html = result?.html!;

    // Verify the HTML contains expected content from the fixture
    expect(html).toContain("Kew (Vic.) Suburb Report");
    expect(html).toContain("25,123"); // Population
    expect(html).toContain("42 years"); // Median age
    expect(html).toContain("$95,000"); // Median household income
    expect(html).toContain("$2,450,000"); // Median house price
    expect(html).toContain("8.5%"); // Annual growth
    expect(html).toContain("Outstanding"); // Schools rating

    console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
  });
});
