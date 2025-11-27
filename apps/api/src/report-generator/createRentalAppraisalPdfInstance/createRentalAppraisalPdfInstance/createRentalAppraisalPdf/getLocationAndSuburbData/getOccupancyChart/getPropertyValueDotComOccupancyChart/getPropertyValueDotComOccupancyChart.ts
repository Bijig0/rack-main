import z from "zod";
import { createFetcher } from "../../../getPropertyInfo/createFetcher";
import { scrapePropertyValueDotCom } from "../../../getPropertyInfo/utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { OccupancyChartSchema } from "../types";
import { occupancyChartParseOptions } from "./options";

export const getPropertyValueDotComOccupancyChart = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ occupancyChart: OccupancyChartSchema }),
  options: { occupancyChart: occupancyChartParseOptions },
});
