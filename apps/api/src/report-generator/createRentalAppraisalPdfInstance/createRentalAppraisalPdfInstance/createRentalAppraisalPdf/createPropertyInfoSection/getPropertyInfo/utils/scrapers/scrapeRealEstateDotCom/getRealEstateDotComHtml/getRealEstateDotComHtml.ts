import { Address } from "../../../../../../../../../../shared/types";
import { Scraper } from "../../../types";
import { ScraperBaseArgs } from "../../../types/scraper";
import { createRealBrowserContext } from "../../utils/createBrowserContext/createRealBrowserContext";
import { scrapeRealEstateDotComHtml } from "./scrapeRealEstateDotComHtml/scrapeRealEstateDotComHtml";

type GetRealEstateDotComHtmlArgs = ScraperBaseArgs;

type RealEstateDotComHtmlScraper = Scraper<GetRealEstateDotComHtmlArgs>;

export const getRealEstateDotComHtml: RealEstateDotComHtmlScraper = async ({
  address,
}) => {
  const { page, browser } = await createRealBrowserContext();

  const result = await scrapeRealEstateDotComHtml({ address, page, browser });

  return result;
};

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  getRealEstateDotComHtml({ address }).then(() => {
    console.log("✅ Scraping completed");
  });
}
