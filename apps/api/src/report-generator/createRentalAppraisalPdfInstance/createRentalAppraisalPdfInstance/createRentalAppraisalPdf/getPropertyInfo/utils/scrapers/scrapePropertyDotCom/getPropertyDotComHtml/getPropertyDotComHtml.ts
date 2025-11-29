import { Address } from "../../../../../../../../../shared/types";
import { Scraper } from "../../../types";
import { ScraperBaseArgs } from "../../../types/scraper";
import { createRealBrowserContext } from "../../utils/createBrowserContext/createRealBrowserContext";
import { scrapePropertyDotComHtml } from "./scrapePropertyDotComHtml/scrapePropertyDotComHtml";

type GetPropertyDotComHtmlArgs = ScraperBaseArgs;

type PropertyDotComHtmlScraper = Scraper<GetPropertyDotComHtmlArgs>;

export const getPropertyDotComHtml: PropertyDotComHtmlScraper = async ({
  address,
}) => {
  const { page, browser } = await createRealBrowserContext();

  const result = await scrapePropertyDotComHtml({ address, page, browser });

  return result;
};

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  getPropertyDotComHtml({ address }).then((result) => {
    console.log("✅ Scraping completed");
    console.log({ result });
  });
}
