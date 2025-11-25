import { Address } from "../../createReportCache";
import { Scraper } from "../../types";
import { ScraperBaseArgs } from "../../types/scraper";
import { getMicroBurbsDotComHtml } from "./getMicroBurbsDotComHtml/getMicroBurbsDotComeHtml";

type ScrapeMicroBurbsDotComArgs = ScraperBaseArgs;

type ScrapeMicroBurbsDotCom = Scraper<ScrapeMicroBurbsDotComArgs>;

const scrapeMicroBurbsDotCome: ScrapeMicroBurbsDotCom = async ({ address }) => {
  const result = await getMicroBurbsDotComHtml({ address });
  return result;
};

export { scrapeMicroBurbsDotCome };

if (import.meta.main) {
  const address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  scrapeMicroBurbsDotCome({ address }).then((result) => {
    console.log("✅ Scraping completed");
    console.log({ result });
  });
}
