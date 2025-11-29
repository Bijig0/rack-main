import { Effect } from "effect";
import { Address } from "../../../../../shared/types";
import getCoverPageData from "../getCoverPageData/getCoverPageData";
import getInfrastructureData from "../getInfrastructureData/getInfrastructureData";
import getLocationAndSuburbData from "../getLocationAndSuburbData/getLocationAndSuburbData";
import getPlanningZoningData from "../getPlanningZoningData/getPlanningZoningData";
import getPropertyInfo from "../getPropertyInfo/getPropertyInfo";
import { type RentalAppraisalData } from "./schemas";
import getEnvironmentalData from "../getEnvironmentalData/getEnvironmentalData";

type Args = {
  address: Address;
};

type Return = {
  rentalAppraisalData: RentalAppraisalData;
};

// Export the schema for external use
export { RentalAppraisalDataSchema } from "./schemas";

/**
 * Logs current memory usage with a label
 * Useful for identifying memory-hungry operations in the pipeline
 */
const logMemoryUsage = (label: string) => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
  const rssMB = Math.round(used.rss / 1024 / 1024);
  const externalMB = Math.round(used.external / 1024 / 1024);

  console.log(
    `📊 [${label}] Memory: Heap ${heapUsedMB}/${heapTotalMB} MB | RSS ${rssMB} MB | External ${externalMB} MB`
  );
};

const getRentalAppraisalData = async ({ address }: Args): Promise<Return> => {
  console.log("🏠 MAIN: Starting getRentalAppraisalData...");
  logMemoryUsage("START");

  console.log("🏠 MAIN: Fetching cover page data...");
  const { coverPageData } = await getCoverPageData({ address });
  logMemoryUsage("After getCoverPageData");

  console.log("🏠 MAIN: Fetching property info...");
  const { propertyInfo } = await getPropertyInfo({ address });
  logMemoryUsage("After getPropertyInfo");

  // Note: Cache is now stored in Redis, not in memory, so no need to clear it
  // The HTML data is persisted in Redis and will be reused across requests

  console.log("🏠 MAIN: Fetching planning zone data...");
  const { planningZoningData } = await Effect.runPromise(
    getPlanningZoningData({ address })
  );
  logMemoryUsage("After getPlanningZoningData");

  console.log("🏠 MAIN: Fetching environmental data...");
  const { environmentalData } = await getEnvironmentalData({ address });
  logMemoryUsage("After getEnvironmentalData");

  console.log("🏠 MAIN: Fetching infrastructure data...");
  const { infrastructureData } = await getInfrastructureData({ address });
  logMemoryUsage("After getInfrastructureData");

  console.log("🏠 MAIN: Fetching location and suburb data...");
  const { locationAndSuburbData } = await Effect.runPromise(
    getLocationAndSuburbData({ address })
  );
  logMemoryUsage("After getLocationAndSuburbData");

  console.log("✅ MAIN: All data complete");
  logMemoryUsage("END");

  const rentalAppraisalData = {
    coverPageData,
    propertyInfo,
    planningZoningData,
    environmentalData,
    infrastructureData,
    locationAndSuburbData,
    // pricelabsData,
  } satisfies RentalAppraisalData;

  return {
    rentalAppraisalData,
  };
};

export default getRentalAppraisalData;
