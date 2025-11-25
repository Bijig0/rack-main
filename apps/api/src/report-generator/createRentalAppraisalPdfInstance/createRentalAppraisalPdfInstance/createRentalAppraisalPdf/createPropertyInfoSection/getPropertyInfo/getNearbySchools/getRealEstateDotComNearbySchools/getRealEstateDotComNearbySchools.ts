import z from "zod";
import { createFetcher } from "../../createFetcher";
import { scrapeRealEstateDotCom } from "../../utils/scrapers/scrapeRealEstateDotCom/scrapePropertyValueDotCom";
import { NearbySchoolsSchema } from "../types";
import { nearbySchoolsParseOptions } from "./options";

export const getRealEstateDotComNearbySchools = createFetcher({
  source: "realestate.com",
  scraper: scrapeRealEstateDotCom,
  schema: z.object({ nearbySchools: NearbySchoolsSchema }),
  options: { nearbySchools: nearbySchoolsParseOptions },
});
