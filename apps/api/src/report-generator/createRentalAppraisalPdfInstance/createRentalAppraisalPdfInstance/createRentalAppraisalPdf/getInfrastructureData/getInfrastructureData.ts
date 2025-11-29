import { Address } from "../../../../../shared/types";
import {} from "../getRentalAppraisalData/schemas";
import { getElectricityData } from "./getElectricityData/getElectricityData";
import { getNearbyEmergencyServicesData } from "./getNearbyEmergencyServices/getNearbyEmergencyServices";
import { getNearbyParksData } from "./getNearbyParks/getNearbyParks";
import { getNearbyPlaygroundsData } from "./getNearbyPlaygrounds/getNearbyPlaygrounds";
import { getNearbyShoppingMallsData } from "./getNearbyShoppingMallData/getNearbyShoppingMallData";
import { getSewageData } from "./getSewageData/getSewageData";
import { getStormwaterData } from "./getStormwaterData/getStormwaterData";
import { getPublicTransportData } from "./getTransportData/getPublicTransportData/getPublicTransportData";
import { getWaterData } from "./getWaterData/getWaterData";
import { InfrastructureData, InfrastructureDataSchema } from "./types/types";

type Args = {
  address: Address;
};

type Return = {
  infrastructureData: InfrastructureData;
};

// Helper to suggest garbage collection (non-blocking)
// NOTE: Using Bun.gc(true) caused premature process exit, so we use the non-blocking version
const forceGC = () => {
  if (typeof Bun !== "undefined" && Bun.gc) {
    Bun.gc(false);
  }
};

const getInfrastructureData = async ({ address }: Args): Promise<Return> => {
  // Run light API-based data fetchers in parallel
  const [
    emergencyServicesData,
    parksData,
    playgroundsData,
    shoppingMallsData,
    publicTransportResult,
  ] = await Promise.all([
    getNearbyEmergencyServicesData({ address }),
    getNearbyParksData({ address }),
    getNearbyPlaygroundsData({ address }),
    getNearbyShoppingMallsData({ address }),
    getPublicTransportData({ address }),
  ]);
  forceGC();

  // Run heavier data fetchers sequentially to manage memory
  const electricityResult = await getElectricityData({ address });
  forceGC();

  const stormwaterResult = await getStormwaterData({ address });
  forceGC();

  const waterResult = await getWaterData({ address });
  forceGC();

  // Sewage loads large GeoJSON - run last and alone
  const sewageData = await getSewageData({ address });
  forceGC();

  const infrastructureData = InfrastructureDataSchema.parse({
    electricityInfrastructureData: electricityResult.electricityInfrastructure,
    electricity: electricityResult.electricityInfrastructure,
    nearbyEmergencyServices: emergencyServicesData,
    nearbyParks: parksData,
    nearbyPlaygrounds: playgroundsData,
    nearbyShoppingMalls: shoppingMallsData,
    stormwaterData: stormwaterResult.stormwaterData,
    waterData: waterResult.waterInfrastructure,
    publicTransport: publicTransportResult.nearbyStops,
    sewageData: sewageData,
  });

  return { infrastructureData };
};

if (import.meta.main) {
  const address: Address = {
    addressLine: "7 English Kew",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  getInfrastructureData({ address })
    .then(({ infrastructureData }) => {
      console.log({ infrastructureData });
    })
    .catch((error) => {
      console.error(error);
    });
}

export default getInfrastructureData;
