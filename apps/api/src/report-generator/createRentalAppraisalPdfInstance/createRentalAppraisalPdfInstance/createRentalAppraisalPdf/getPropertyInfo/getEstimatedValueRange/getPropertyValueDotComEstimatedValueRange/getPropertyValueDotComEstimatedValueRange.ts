import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { EstimatedValueRangeSchema } from "../types";
import { estimatedValueRangeParseOptions } from "./options";

export const getPropertyValueDotComEstimatedValueRange = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ estimatedValueRange: EstimatedValueRangeSchema }),
  options: { estimatedValueRange: estimatedValueRangeParseOptions },
});
