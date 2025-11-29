import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapeDomainDotCom } from "../../utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";
import { SimilarPropertiesForRentSchema } from "../types";
import { similarPropertiesForRentParseOptions } from "./options";

export const getDomainDotComSimilarPropertiesForRent = createFetcher({
  source: "domain.com",
  scraper: scrapeDomainDotCom,
  schema: z.object({
    similarPropertiesForRent: SimilarPropertiesForRentSchema,
  }),
  options: { similarPropertiesForRent: similarPropertiesForRentParseOptions },
});
