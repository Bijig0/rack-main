import * as E from "effect/Either";
import { Scraper } from "../../../../types";
import { ScraperBaseArgs, WithTestArgs } from "../../../../types/scraper";
import { formatAddressForRealEstateDotComUrl } from "../../formatAddressForRealEstateComUrl/formatAddressForRealEstateDotComUrl";
import { closePopupModal } from "./closePopupModal/closePopupModal";
import { navigateToPropertyPage } from "./navigateToPropertyPage/navigateToPropertyPage";

type RealEstateDotComScraperArgs = ScraperBaseArgs & WithTestArgs;

type RealEstateDotComScraper = Scraper<RealEstateDotComScraperArgs>;

const scrapeRealEstateDotComHtml: RealEstateDotComScraper = async ({
  address,
  page,
  browser,
}) => {
  const formattedAddress = formatAddressForRealEstateDotComUrl(address);
  const url = `https://www.realestate.com.au/property/${formattedAddress}`;

  try {
    await navigateToPropertyPage({ page, url });
    await closePopupModal(page);
    const html = await page.content();
    console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);

    return E.right({ html });
  } catch (err) {
    console.error("❌ Error scraping realestate.com.au:", err);
    await page.screenshot({ path: "realestate-error.png", fullPage: true });

    return E.left(
      err instanceof Error
        ? err
        : new Error("Unknown error scraping realestate.com.au")
    );
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};

export { scrapeRealEstateDotComHtml };
