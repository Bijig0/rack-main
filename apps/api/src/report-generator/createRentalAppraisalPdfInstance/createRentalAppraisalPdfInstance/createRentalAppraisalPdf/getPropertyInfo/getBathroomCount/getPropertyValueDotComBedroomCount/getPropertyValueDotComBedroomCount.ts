import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { BathroomCountSchema } from "../types";
import { bathroomCountParseOptions } from "./options";

export const getPropertyValueDotComBedroomCount = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ bathroomCount: BathroomCountSchema }),
  options: { bathroomCount: bathroomCountParseOptions },
});
