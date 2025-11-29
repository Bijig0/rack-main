import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { PropertyTypeSchema } from "../types";
import { propertyTypeParseOptions } from "./options";

export const getPropertyValueDotComePropertyType = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ propertyType: PropertyTypeSchema }),
  options: { propertyType: propertyTypeParseOptions },
});
