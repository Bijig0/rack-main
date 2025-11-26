import { Scraper } from "../../types";
import { getDomainDotComHtml } from "./getDomainDotComHtml/getDomainDotComHtml";

const scrapeDomainDotCom: Scraper = async ({ address }) => {
  const result = await getDomainDotComHtml({ address });
  return result;
};

export { scrapeDomainDotCom };
