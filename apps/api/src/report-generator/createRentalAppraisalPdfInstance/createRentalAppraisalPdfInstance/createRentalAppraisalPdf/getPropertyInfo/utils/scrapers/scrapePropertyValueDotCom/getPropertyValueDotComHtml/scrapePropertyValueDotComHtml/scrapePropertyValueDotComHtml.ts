import * as E from "effect/Either";
import { Scraper } from "../../../../types";
import { ScraperBaseArgs, WithTestArgs } from "../../../../types/scraper";
import { closePopupModal } from "./closePopupModal/closePopupModal";
import { searchAndNavigate } from "./searchAndNavigate/searchAndNavigate";

type PropertyValueDotComeScraperArgs = ScraperBaseArgs & WithTestArgs;

type PropertyValueDotComScraper = Scraper<PropertyValueDotComeScraperArgs>;

const scrapePropertyValueDotComHtml: PropertyValueDotComScraper = async ({
  address,
  page,
  browser,
}) => {
  try {
    // Step 1: Navigate to homepage and search for the property
    await searchAndNavigate({ address, page });

    // Step 2: Close any modals/popups
    await closePopupModal(page);

    // Step 3: Get the property page HTML
    const html = await page.content();
    console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);

    return E.right({ html });
  } catch (err) {
    console.error("❌ Error scraping propertyvalue.com.au:", err);
    await page.screenshot({
      path: "propertyvalue-error.png",
      fullPage: true,
    });

    return E.left(
      err instanceof Error
        ? err
        : new Error("Unknown error scraping propertyvalue.com.au")
    );
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};

export { scrapePropertyValueDotComHtml };
