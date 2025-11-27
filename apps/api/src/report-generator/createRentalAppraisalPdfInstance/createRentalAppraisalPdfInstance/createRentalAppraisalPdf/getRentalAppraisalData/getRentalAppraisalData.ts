import { Effect } from "effect";
import { Address } from "../../../../../shared/types";
import getCoverPageData from "../getCoverPageData/getCoverPageData";
import getEnvironmentalData from "../getEnvironmentalData/getEnvironmentalData";
import getInfrastructureData from "../getInfrastructureData/getInfrastructureData";
import getLocationAndSuburbData from "../getLocationAndSuburbData/getLocationAndSuburbData";
import getPlanningZoningData from "../getPlanningZoningData/getPlanningZoningData";
import getPricelabsData from "../getPricelabsData/getPricelabsData";
import getPropertyInfo from "../getPropertyInfo/getPropertyInfo";
import { resetGlobalCache } from "../getPropertyInfo/utils/createReportCache/createReportCache/createReportCache";
type Args = {
  address: Address;
};

// Export the schema for external use
export { RentalAppraisalDataSchema } from "./schemas";

// Helper to force garbage collection in Bun
const forceGC = () => {
  if (typeof Bun !== 'undefined' && Bun.gc) {
    Bun.gc(true);
  }
};

const getRentalAppraisalData = async ({ address }: Args) => {
  console.log("🏠 Stage 1: Cover page and property info (browser-heavy)...");
  const { coverPageData } = await getCoverPageData({ address });
  console.log("  ✅ Cover page data complete");
  const { propertyInfo } = await getPropertyInfo({ address });
  console.log("  ✅ Property info complete");
  forceGC();

  console.log("📋 Stage 2: Planning and zoning data...");
  const { planningZoningData } = await Effect.runPromise(
    getPlanningZoningData({ address })
  );
  console.log("  ✅ Planning and zoning data complete");

  // Clear HTML cache after property/planning data to free memory before heavy GeoJSON processing
  console.log("🗑️ Clearing HTML cache...");
  resetGlobalCache();
  forceGC();
  console.log("  ✅ Cache cleared");

  console.log("🌍 Stage 3: Environmental data (large GeoJSON files)...");
  const { environmentalData } = await getEnvironmentalData({ address });
  console.log("  ✅ Environmental data complete");
  forceGC();

  console.log("🚇 Stage 4: Infrastructure data (large GeoJSON files)...");
  const { infrastructureData } = await getInfrastructureData({ address });
  console.log("  ✅ Infrastructure data complete");
  forceGC();

  console.log("📍 Stage 5: Location and suburb data...");
  const { locationAndSuburbData } = await Effect.runPromise(
    getLocationAndSuburbData({ address })
  );
  console.log("  ✅ Location and suburb data complete");
  forceGC();

  console.log("💰 Stage 6: Pricelabs data...");
  const { pricelabsData } = await getPricelabsData({ address });
  console.log("  ✅ Pricelabs data complete");

  const rentalAppraisalData = {
    coverPageData,
    propertyInfo,
    planningZoningData,
    environmentalData,
    infrastructureData,
    locationAndSuburbData,
    pricelabsData,
  };

  return {
    rentalAppraisalData,
  };
};

export default getRentalAppraisalData;

if (import.meta.main) {
  const rentalAppraisalData = await getRentalAppraisalData({
    address: {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log({ rentalAppraisalData }, { depth: null, colors: true });
}
