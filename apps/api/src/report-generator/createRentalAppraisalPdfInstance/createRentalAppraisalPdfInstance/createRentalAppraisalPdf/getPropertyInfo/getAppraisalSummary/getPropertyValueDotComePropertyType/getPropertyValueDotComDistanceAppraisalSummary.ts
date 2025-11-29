import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { distanceFromCBDParseOptions } from "../../getDistanceFromCBD/getPropertyValueDotComePropertyType/options";
import { DistanceFromCBDSchema } from "../../getDistanceFromCBD/types";
import { appraisalSummaryParseOptions } from "./options";
import { AppraisalSummarySchema } from "../types";

export const getPropertyValueDotComDistanceAppraisalSummary = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ appraisalSummary: AppraisalSummarySchema }),
  options: { appraisalSummary: appraisalSummaryParseOptions },
});
