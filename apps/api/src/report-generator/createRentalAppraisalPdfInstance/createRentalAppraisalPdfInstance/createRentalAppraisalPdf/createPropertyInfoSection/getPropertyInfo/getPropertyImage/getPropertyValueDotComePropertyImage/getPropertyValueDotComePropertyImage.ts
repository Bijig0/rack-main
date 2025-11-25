import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { PropertyImageSchema } from "../types";
import { propertyImageParseOptions } from "./options";

export const getPropertyValueDotComPropertyImage = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ propertyImage: PropertyImageSchema }),
  options: { propertyImage: propertyImageParseOptions },
});
