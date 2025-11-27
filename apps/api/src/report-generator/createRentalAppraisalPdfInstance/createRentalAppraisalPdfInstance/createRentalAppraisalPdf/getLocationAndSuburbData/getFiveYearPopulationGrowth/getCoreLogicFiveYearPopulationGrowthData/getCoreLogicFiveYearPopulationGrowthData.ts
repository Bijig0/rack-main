import z from "zod";
import { createFetcher } from "../../../getPropertyInfo/createFetcher";
import { scrapeCoreLogic } from "../../../getPropertyInfo/utils/scrapers/scrapeCoreLogic/scrapeCoreLogic";
import { FiveYearPopulationGrowthSchema } from "../types";
import { populationParseOptions } from "./options";

export const getCoreLogicFiveYearPopulationGrowthData = createFetcher({
  source: "corelogic",
  scraper: scrapeCoreLogic,
  schema: z.object({ fiveYearPopulationGrowth: FiveYearPopulationGrowthSchema }),
  options: { fiveYearPopulationGrowth: populationParseOptions },
});
