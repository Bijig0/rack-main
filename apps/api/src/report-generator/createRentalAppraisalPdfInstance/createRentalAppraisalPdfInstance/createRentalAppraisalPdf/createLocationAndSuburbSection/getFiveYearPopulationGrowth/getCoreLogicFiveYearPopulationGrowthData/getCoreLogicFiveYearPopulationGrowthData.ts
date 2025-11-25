import z from "zod";
import { createFetcher } from "../../../createPropertyInfoSection/getPropertyInfo/createFetcher";
import { scrapePropertyValueDotCom } from "../../../createPropertyInfoSection/getPropertyInfo/utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { populationParseOptions } from "./options";
import { FiveYearPopulationGrowthSchema } from "../types";
import { scrapeCoreLogic } from "../../../createPropertyInfoSection/getPropertyInfo/utils/scrapers/scrapeCoreLogic/scrapeCoreLogic";

export const getCoreLogicFiveYearPopulationGrowthData = createFetcher({
  source: "corelogic",
  scraper: scrapeCoreLogic,
  schema: z.object({ fiveYearPopulationGrowth: FiveYearPopulationGrowthSchema }),
  options: { fiveYearPopulationGrowth: populationParseOptions },
});
