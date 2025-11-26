import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { DistanceFromCBDSchema } from "../types";
import { distanceFromCBDParseOptions } from "./options";

export const getPropertyValueDotComDistanceFromCBD = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ distanceFromCBD: DistanceFromCBDSchema }),
  options: { distanceFromCBD: distanceFromCBDParseOptions },
});
