import z from "zod";
import { createFetcher } from "../../../createPropertyInfoSection/getPropertyInfo/createFetcher";
import { scrapePropertyValueDotCom } from "../../../createPropertyInfoSection/getPropertyInfo/utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { PopulationAmountSchema } from "../types";
import { populationParseOptions } from "./options";

export const getPropertyValueDotComPopulationAmount = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ populationAmount: PopulationAmountSchema }),
  options: { populationAmount: populationParseOptions },
});
