import { Scraper } from "../../types";
import { getCoreLogicHtml } from "./getCoreLogicHtml/getCoreLogicHtml";

const scrapeCoreLogic: Scraper = async ({ address }) => {
  const result = await getCoreLogicHtml({ address });
  return result;
};

export { scrapeCoreLogic };
