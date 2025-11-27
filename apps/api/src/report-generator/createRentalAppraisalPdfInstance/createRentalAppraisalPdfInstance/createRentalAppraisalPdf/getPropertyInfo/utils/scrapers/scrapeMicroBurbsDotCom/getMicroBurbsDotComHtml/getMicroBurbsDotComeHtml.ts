import { Address } from "../../../../../../../../../shared/types";
import { Scraper } from "../../../types";
import { ScraperBaseArgs } from "../../../types/scraper";
import { createAntiBotBrowserContext } from "../../utils/createBrowserContext/createAntiBotBrowserContext";
import { scrapeMicroBurbsDotComHtml } from "./scrapeMicroBurbsDotComHtml/scrapeMicroBurbsDotComHtml";

type GetMicroBurbsDotComHtmlArgs = ScraperBaseArgs;

type MicroBurbsDotComHtmlScraper = Scraper<GetMicroBurbsDotComHtmlArgs>;

export const getMicroBurbsDotComHtml: MicroBurbsDotComHtmlScraper = async ({
  address,
}) => {
  const { page, browser } = await createAntiBotBrowserContext();

  const result = await scrapeMicroBurbsDotComHtml({ address, page, browser });

  return result;
};

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  getMicroBurbsDotComHtml({ address }).then((result) => {
    console.log("✅ Scraping completed");
    console.log({ result });
  });
}
