import * as E from "effect/Either";
import { Scraper, ScraperArgs } from "../../../../types";
import { WithTestArgs } from "../../../../types/scraper";
import { authenticateCoreLogic } from "../../authenticate/authenticate";
import fillSearchElements from "../../fillSearch/fillSearch";
import { normalizeAddressObjToCoreLogicString } from "../../normalizeAddressObjToCoreLogicString/normalizeAddressObjToCoreLogicString";

export type WithCoreLogicAuth = {
  email: string;
  username: string;
  password: string;
  url: string;
};

type CoreLogicScraperArgs = ScraperArgs & {
  auth: WithCoreLogicAuth;
} & WithTestArgs;

type CoreLogicScraper = Scraper<CoreLogicScraperArgs>;

export const scrapeCoreLogic: CoreLogicScraper = async ({
  address,
  auth: { email, username, password, url },
  page,
  browser,
}) => {
  try {
    console.log("🌐 Navigating to PropertyHub...");
    await page.goto(url);

    console.log("📧 First login...");
    await authenticateCoreLogic({
      page,
      email,
      username,
      password,
    });

    await page.waitForTimeout(4500);

    console.log("🔍 Searching for property...");
    const normalizedAddress = normalizeAddressObjToCoreLogicString(address);
    await fillSearchElements({ addressToSearch: normalizedAddress, page });

    console.log("⏳ Waiting for dropdown menu...");
    await page.waitForSelector(".Select-menu-outer", { timeout: 5000 });
    await page.waitForTimeout(1000);

    console.log("✅ Selecting first property result...");
    await Promise.all([
      page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 15000,
      }),
      page.click('[id^="suggest-propertyId-"]:not([id$="-"])'),
    ]);

    console.log("📄 Navigation complete!");
    console.log("📍 Current URL:", page.url());

    console.log("⏳ Waiting for React content to fully render...");

    // Wait for React-rendered elements
    await page.waitForSelector("span.floor.attribute span", { timeout: 10000 });
    await page.waitForSelector("span.land span", { timeout: 10000 });
    await page.waitForSelector("span.property-attribute-subtext", {
      timeout: 10000,
    });

    await page.waitForTimeout(3000);

    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      console.log("✅ Network idle achieved");
    } catch {
      console.log("⚠️ Network not fully idle, proceeding anyway");
    }

    console.log("💾 Saving fully rendered HTML...");
    const htmlContent = await page.content();
    console.log(`📊 HTML size: ${(htmlContent.length / 1024).toFixed(2)} KB`);

    return E.right({ html: htmlContent });
  } catch (error) {
    console.error("❌ Error:", error);

    return E.left(
      error instanceof Error
        ? error
        : new Error("Unknown error scraping CoreLogic")
    );
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};
