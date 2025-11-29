import { Scraper } from "../../types";
import { getPropertyDotComHtml } from "./getPropertyDotComHtml/getPropertyDotComHtml";

const scrapePropertyDotCom: Scraper = async ({ address }) => {
  const result = await getPropertyDotComHtml({ address });
  return result;
};

export { scrapePropertyDotCom };
