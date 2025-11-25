import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapeDomainDotCom } from "../../utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";
import { PropertyTimelineSchema } from "../types";
import { propertyTimelineParseOptions } from "./options";

export const getDomainDotComTimeline = createFetcher({
  source: "domain.com",
  scraper: scrapeDomainDotCom,
  schema: z.object({ propertyTimeline: PropertyTimelineSchema }),
  options: { propertyTimeline: propertyTimelineParseOptions },
});
