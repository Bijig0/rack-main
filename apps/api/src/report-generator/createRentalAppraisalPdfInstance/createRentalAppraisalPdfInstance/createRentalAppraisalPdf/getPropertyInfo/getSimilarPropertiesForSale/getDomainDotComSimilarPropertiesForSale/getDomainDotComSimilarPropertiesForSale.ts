import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapeDomainDotCom } from "../../utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";
import { similarPropertiesForSaleParseOptions } from "./options";
import { SimilarPropertiesForSaleSchema } from "../types";

export const getDomainDotComSimilarPropertiesForSale = createFetcher({
  source: "domain.com",
  scraper: scrapeDomainDotCom,
  schema: z.object({
    similarPropertiesForSale: SimilarPropertiesForSaleSchema,
  }),
  options: { similarPropertiesForSale: similarPropertiesForSaleParseOptions },
});
