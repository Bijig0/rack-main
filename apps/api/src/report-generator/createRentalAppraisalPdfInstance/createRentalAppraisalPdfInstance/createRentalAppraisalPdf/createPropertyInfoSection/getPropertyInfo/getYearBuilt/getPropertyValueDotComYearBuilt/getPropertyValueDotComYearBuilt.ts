import { Effect } from "effect";
import z from "zod";
import { Address } from "../../../../../../../../shared/types";
import { createFetcher } from "../../createFetcher";
import { scrapePropertyValueDotCom } from "../../utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { YearBuiltSchema } from "../types";
import { yearBuiltParseOptions } from "./propertyValueDotComeYearBuiltParseStrategy";

export const getPropertyValueDotComYearBuilt = createFetcher({
  source: "propertyvalue.com",
  scraper: scrapePropertyValueDotCom,
  schema: z.object({ yearBuilt: YearBuiltSchema }),
  options: { yearBuilt: yearBuiltParseOptions },
});

// Example usage for testing
if (import.meta.main) {
  const { getReportCache } = await import("../../utils/createReportCache");

  const testAddress: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  console.log("\n🏠 Testing getPropertyValueDotComYearBuilt");
  console.log("Address:", testAddress);
  console.log("─".repeat(60));

  const cache = getReportCache();

  const sampleFetcher = createFetcher({
    source: "propertyvalue.com",
    scraper: scrapePropertyValueDotCom,
    schema: z.object({ yearBuilt: YearBuiltSchema }),
    options: { yearBuilt: yearBuiltParseOptions },
  });

  const program = sampleFetcher({
    cacheStore: cache,
    address: testAddress,
  });

  Effect.runPromise(program)
    .then((yearBuilt) => {
      console.log("\n✅ Success!");
      console.log("Year Built:", yearBuilt);
    })
    .catch((error) => {
      console.error("\n❌ Error:");
      console.error(error);
      process.exit(1);
    });
}
