import { Address } from "../../../../../../../../../../shared/types";
import { Scraper } from "../../../types";
import { ScraperBaseArgs } from "../../../types/scraper";
import { createAntiBotBrowserContext } from "../../utils/createBrowserContext/createAntiBotBrowserContext";
import { scrapeDomainDotComHtml } from "./scrapeDomainDotComHtml/scrapeDomainDotComHtml";

type GetDomainDotComHtmlArgs = ScraperBaseArgs;

type DomainDotComHtmlScraper = Scraper<GetDomainDotComHtmlArgs>;

export const getDomainDotComHtml: DomainDotComHtmlScraper = async ({
  address,
}) => {
  const { page, browser } = await createAntiBotBrowserContext();

  const result = await scrapeDomainDotComHtml({ address, page, browser });

  return result;
};

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  getDomainDotComHtml({ address }).then(() => {
    console.log("✅ Scraping completed");
  });
}
