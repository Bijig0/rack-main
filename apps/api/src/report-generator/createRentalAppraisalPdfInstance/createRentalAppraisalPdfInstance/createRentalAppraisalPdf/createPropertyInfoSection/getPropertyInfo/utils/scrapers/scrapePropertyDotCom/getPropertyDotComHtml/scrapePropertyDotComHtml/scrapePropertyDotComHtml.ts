import * as E from "effect/Either";
import { Scraper } from "../../../../types";
import { ScraperBaseArgs, WithTestArgs } from "../../../../types/scraper";
import { formatAddressForPropertyUrl } from "../../formatAddressForPropertyUrl/formatAddressForPropertyUrl";
import { closePopupModal } from "./closePopupModal/closePopupModal";
import { navigateToPropertyPage } from "./navigateToPropertyPage/navigateToPropertyPage";

type PropertyDotComScraperArgs = ScraperBaseArgs & WithTestArgs;

type PropertyDotComScraper = Scraper<PropertyDotComScraperArgs>;

const scrapePropertyDotComHtml: PropertyDotComScraper = async ({
  address,
  page,
  browser,
}) => {
  const formattedAddress = formatAddressForPropertyUrl(address);
  // const url = `https://www.property.com.au/${formattedAddress}`;
  const url =
    "https://www.property.com.au/vic/kew-3101/english-pl/7-pid-11097147/";

  try {
    await navigateToPropertyPage({ page, url });

    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: "property-loaded.png", fullPage: true });
    console.log("📸 Screenshot saved to property-loaded.png");

    await closePopupModal(page);

    const html = await page.content();
    console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);

    // Check if HTML contains meaningful content
    const hasContent =
      html.includes("property") ||
      html.includes("bedroom") ||
      html.includes("price");
    console.log(`🔍 Page has property content: ${hasContent}`);

    return E.right({ html });
  } catch (err) {
    console.error("❌ Error scraping property.com.au:", err);
    await page.screenshot({ path: "property-error.png", fullPage: true });

    return E.left(
      err instanceof Error
        ? err
        : new Error("Unknown error scraping property.com.au")
    );
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};

export { scrapePropertyDotComHtml };
