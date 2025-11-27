import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { bedroomCountParseOptions } from "./options";
import { BedroomCountSchema } from "../types";

export const getPropertyValueDotComBedroomCount = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ bedroomCount: BedroomCountSchema }),
  options: { bedroomCount: bedroomCountParseOptions },
});
