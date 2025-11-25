import * as E from "effect/Either";
import { Scraper, ScraperArgs } from "../../../../types";
import { WithTestArgs } from "../../../../types/scraper";
import { formatAddressForDomainUrl } from "../../formatAddressForDomainUrl/formatAddressForDomainUrl";
import { navigateToHomePage } from "../../navigateToHomePage/navigateToHomePage";

type DomainDotComScraperArgs = ScraperArgs & WithTestArgs;

type DomainDotComScraper = Scraper<DomainDotComScraperArgs>;

const scrapeDomainDotComHtml: DomainDotComScraper = async ({
  address,
  page,
  browser,
}) => {
  const formattedAddress = formatAddressForDomainUrl(address);
  const url = `https://www.domain.com.au/property-profile/${formattedAddress}`;

  try {
    await navigateToHomePage({ page, url });

    // Get the fully rendered HTML
    const html = await page.content();

    return E.right({ html });
  } catch (err) {
    console.error("❌ Error scraping domain.com.au:", err);

    // Save screenshot on error
    try {
      await page.screenshot({ path: "domain-error.png", fullPage: true });
      console.log("📸 Saved error screenshot to domain-error.png");
    } catch (screenshotErr) {
      console.error("Could not save screenshot:", screenshotErr);
    }

    return E.left(
      err instanceof Error
        ? err
        : new Error("Unknown error scraping domain.com.au")
    );
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};

export { scrapeDomainDotComHtml };
