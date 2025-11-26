import { Address } from "../../../../../../../../../../shared/types";
import { Scraper } from "../../../types";
import { ScraperBaseArgs } from "../../../types/scraper";
import { createRealBrowserContext } from "../../utils/createBrowserContext/createRealBrowserContext";
import { scrapePropertyValueDotComHtml } from "./scrapePropertyValueDotComHtml/scrapePropertyValueDotComHtml";

type GetPropertyValueDotComHtmlArgs = ScraperBaseArgs;

type PropertyValueDotComHtmlScraper = Scraper<GetPropertyValueDotComHtmlArgs>;

export const getPropertyValueDotComHtml: PropertyValueDotComHtmlScraper =
  async ({ address }) => {
    const { page, browser } = await createRealBrowserContext();

    const result = await scrapePropertyValueDotComHtml({
      address,
      page,
      browser,
    });

    return result;
  };

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  getPropertyValueDotComHtml({ address }).then((result) => {
    console.log("✅ Scraping completed");
    console.log({ result });
  });
}
