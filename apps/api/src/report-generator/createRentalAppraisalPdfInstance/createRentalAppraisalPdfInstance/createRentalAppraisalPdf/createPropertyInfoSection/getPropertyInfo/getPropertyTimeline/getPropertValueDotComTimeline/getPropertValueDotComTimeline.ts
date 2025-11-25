import z from "zod";
import { createFetcher } from "../../createFetcher";
import { PropertyTimelineSchema } from "../types";
import { propertyTimelineParseOptions } from "./options";
import { scrapeDomainDotCom } from "../../utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";

export const getPropertValueDotComTimeline = createFetcher({
  source: "property.com",
  scraper: scrapeDomainDotCom,
  schema: z.object({ propertyTimeline: PropertyTimelineSchema }),
  options: { propertyTimeline: propertyTimelineParseOptions },
});
