// scraperCoreLogic.integration.test.ts
// Full integration test with the actual scraper function
import { expect, test } from "@playwright/test";
import console from "console";
import * as E from "effect/Either";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Mock dotenv before any imports that use it
// @ts-ignore - dotenv will be available at runtime
import {
  CORELOGIC_EMAIL,
  CORELOGIC_PASSWORD,
  CORELOGIC_URL,
  CORELOGIC_USERNAME,
} from "../../../../../../../../../../shared/config";
import type { Address } from "../../../../createReportCache";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("scraperCoreLogic integration", () => {
  test("full scraping flow with mocked responses", async ({
    page,
    browser,
  }) => {
    // Mock all the pages in sequence
    await page.route("https://propertyhub.corelogic.asia/", async (route) => {
      const loginPagePath = path.join(__dirname, "fixtures", "login-page.html");
      const loginPageContent = await fs.readFile(loginPagePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: loginPageContent,
      });
    });

    await page.route("**/property/**", async (route) => {
      const fixturePath = path.join(
        __dirname,
        "fixtures",
        "sample-property-page.html"
      );
      const propertyPageContent = await fs.readFile(fixturePath, "utf-8");
      await route.fulfill({
        status: 200,
        body: propertyPageContent,
      });
    });

    // Import scrapeCoreLogic
    const { scrapeCoreLogic } = await import("./scrapeCoreLogic");

    const auth = {
      email: CORELOGIC_EMAIL,
      username: CORELOGIC_USERNAME,
      password: CORELOGIC_PASSWORD,
      url: CORELOGIC_URL,
    };

    const address: Address = {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    // Pass the test page to scrapeCoreLogic with skipAuth flag
    const result = await scrapeCoreLogic({
      address,
      auth,
      page,
      browser,
    });

    E.map(result, ({ html }) => {
      expect(html).toContain("6 English Place");
      expect(html).toContain("358m²"); // Floor area
      expect(html).toContain("650m²"); // Land area
      expect(html).toContain("2015"); // Year built
      console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
    });
  });
});
