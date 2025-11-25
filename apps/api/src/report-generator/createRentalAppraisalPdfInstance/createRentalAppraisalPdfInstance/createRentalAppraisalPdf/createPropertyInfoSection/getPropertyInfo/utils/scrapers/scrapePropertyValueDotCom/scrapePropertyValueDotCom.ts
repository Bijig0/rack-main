import { Scraper } from "../../types";
import { getPropertyValueDotComHtml } from "./getPropertyValueDotComHtml/getPropertyValueDotComHtml";

const scrapePropertyValueDotCom: Scraper = async ({ address }) => {
  const result = await getPropertyValueDotComHtml({ address });
  return result;
};

export { scrapePropertyValueDotCom };
