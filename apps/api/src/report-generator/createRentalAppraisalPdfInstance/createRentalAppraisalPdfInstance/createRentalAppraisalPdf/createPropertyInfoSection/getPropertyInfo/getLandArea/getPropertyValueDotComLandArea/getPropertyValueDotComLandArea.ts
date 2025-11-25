import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { LandAreaSchema } from "../types";
import { landAreaParseOptions } from "./options";

export const getPropertyValueDotComLandArea = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ landArea: LandAreaSchema }),
  options: { landArea: landAreaParseOptions },
});
