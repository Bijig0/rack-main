import { Scraper } from "../../types";
import { getRealEstateDotComHtml } from "./getRealEstateDotComHtml/getRealEstateDotComHtml";

const scrapeRealEstateDotCom: Scraper = async ({ address }) => {
  const result = await getRealEstateDotComHtml({ address });
  return result;
};

export { scrapeRealEstateDotCom };
