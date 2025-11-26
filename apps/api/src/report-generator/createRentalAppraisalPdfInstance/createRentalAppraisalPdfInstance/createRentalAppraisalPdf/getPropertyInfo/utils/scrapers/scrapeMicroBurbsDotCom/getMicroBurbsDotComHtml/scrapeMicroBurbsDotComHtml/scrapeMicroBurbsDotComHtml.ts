import { Scraper } from "../../../../types";
import { ScraperBaseArgs, WithTestArgs } from "../../../../types/scraper";
import { formatSuburbForMicroBurbsUrl } from "../../formatSuburbForMicroBurbsUrl/formatSuburbForMicroBurbsUrl";
import { closePopupModal } from "./closePopupModal/closePopupModal";
import { navigateToPropertyPage } from "./navigateToPropertyPage/navigateToPropertyPage";

type MicroBurbsScraperArgs = ScraperBaseArgs & WithTestArgs;

type MicroBurbsScraper = Scraper<MicroBurbsScraperArgs>;

const scrapeMicroBurbsDotComHtml: MicroBurbsScraper = async ({
  address,
  page,
  browser,
}) => {
  const formattedSuburb = formatSuburbForMicroBurbsUrl(address);
  const url = `https://www2.microburbs.com.au/suburb-report?suburb=${formattedSuburb}&paid=true`;

  try {
    await navigateToPropertyPage({ page, url });

    // Close the popup modal if it appears
    await closePopupModal(page);

    // Get the fully rendered HTML
    const html = await page.content();

    return { html };
  } catch (err) {
    console.error("❌ Error scraping microburbs.com.au:", err);

    // Save screenshot on error
    try {
      await page.screenshot({ path: "microburbs-error.png", fullPage: true });
      console.log("📸 Saved error screenshot to microburbs-error.png");
    } catch (screenshotErr) {
      console.error("Could not save screenshot:", screenshotErr);
    }
  } finally {
    console.log("🔚 Closing browser...");
    await browser.close();
  }
};

export { scrapeMicroBurbsDotComHtml };
