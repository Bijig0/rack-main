import z from "zod";
import { createFetcher } from "../../createFetcher";
import { landAreaParseOptions } from "../../getLandArea/getPropertyValueDotComLandArea/options";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { FloorAreaSchema } from "../types";

export const getPropertyValueDotComFloorArea = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ floorArea: FloorAreaSchema }),
  options: { floorArea: landAreaParseOptions },
});
