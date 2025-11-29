// scrapeDomainDotComHtml.playwright.test.ts
// Full integration test with the actual scraper function
import { expect, test } from "@playwright/test";
import console from "console";
import * as E from "effect/Either";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { Address } from "../../../../createReportCache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("scrapeDomainDotComHtml integration", () => {
  test("full scraping flow with mocked responses", async ({
    page,
    browser,
  }) => {
    // Mock the homepage
    await page.route("https://www.domain.com.au/", async (route) => {
      const homepagePath = path.join(__dirname, "fixtures", "homepage.html");
      const homepageContent = await fs.readFile(homepagePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: homepageContent,
      });
    });

    // Mock property profile page
    await page.route("**/property-profile/**", async (route) => {
      const fixturePath = path.join(
        __dirname,
        "fixtures",
        "property-profile.html"
      );
      const propertyPageContent = await fs.readFile(fixturePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: propertyPageContent,
      });
    });

    // Import scrapeDomainDotComHtml
    const { scrapeDomainDotComHtml } = await import("./scrapeDomainDotComHtml");

    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    // Pass the test page to scrapeDomainDotComHtml
    const result = await scrapeDomainDotComHtml({
      address,
      page: page as any,
      browser: browser as any,
    });

    // Check that the result is Right and contains HTML
    expect(E.isRight(result)).toBe(true);

    if (E.isRight(result)) {
      const { html } = result.right;
      expect(html).toContain("7 English Place, Kew VIC 3101");
      expect(html).toContain("650 m²"); // Land size
      expect(html).toContain("House"); // Property type
      expect(html).toContain("4"); // Bedrooms
      expect(html).toContain("2"); // Bathrooms
      expect(html).toContain("$2,500,000"); // Sale price
      console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
    }
  });
});
