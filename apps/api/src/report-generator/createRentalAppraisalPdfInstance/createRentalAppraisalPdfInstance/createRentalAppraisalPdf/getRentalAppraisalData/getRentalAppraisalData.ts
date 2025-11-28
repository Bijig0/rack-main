import { Effect } from "effect";
import { Address } from "../../../../../shared/types";
import getCoverPageData from "../getCoverPageData/getCoverPageData";
import getEnvironmentalData from "../getEnvironmentalData/getEnvironmentalData";
import getInfrastructureData from "../getInfrastructureData/getInfrastructureData";
import getLocationAndSuburbData from "../getLocationAndSuburbData/getLocationAndSuburbData";
import getPlanningZoningData from "../getPlanningZoningData/getPlanningZoningData";
import getPropertyInfo from "../getPropertyInfo/getPropertyInfo";
import { resetGlobalCache } from "../getPropertyInfo/utils/createReportCache/createReportCache/createReportCache";
import { type RentalAppraisalData } from "./schemas";

type Args = {
  address: Address;
};

type Return = {
  rentalAppraisalData: RentalAppraisalData;
};

// Export the schema for external use
export { RentalAppraisalDataSchema } from "./schemas";

const getRentalAppraisalData = async ({ address }: Args): Promise<Return> => {
  console.log("🏠 MAIN: Starting getRentalAppraisalData...");

  console.log("🏠 MAIN: Fetching cover page data...");
  const { coverPageData } = await getCoverPageData({ address });
  console.log("✅ MAIN: Cover page data complete");

  console.log("🏠 MAIN: Fetching property info...");
  const { propertyInfo } = await getPropertyInfo({ address });
  // Clear the HTML cache to free memory before heavy environmental/infrastructure data
  resetGlobalCache();
  console.log("🗑️  MAIN: Cleared HTML cache to free memory");

  console.log("🏠 MAIN: Fetching planning zone data...");
  const { planningZoningData } = await Effect.runPromise(
    getPlanningZoningData({ address })
  );
  // Clear planning zone cache to free memory
  console.log("✅ MAIN: Planning zone data complete");

  console.log("🏠 MAIN: Fetching environmental data...");
  const { environmentalData } = await getEnvironmentalData({ address });

  console.log("🏠 MAIN: Fetching infrastructure data...");
  const { infrastructureData } = await getInfrastructureData({ address });

  console.log("🏠 MAIN: Fetching location and suburb data...");
  const { locationAndSuburbData } = await Effect.runPromise(
    getLocationAndSuburbData({ address })
  );
  // const { pricelabsData } = await getPricelabsData({ address });

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
