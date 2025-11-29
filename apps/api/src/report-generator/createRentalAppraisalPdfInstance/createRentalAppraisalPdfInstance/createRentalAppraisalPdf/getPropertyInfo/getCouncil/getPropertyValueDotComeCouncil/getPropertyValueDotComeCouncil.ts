import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { CouncilSchema } from "../types";
import { councilParseOptions } from "./options";

export const getPropertyValueDotComeCouncil = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ council: CouncilSchema }),
  options: { council: councilParseOptions },
});
