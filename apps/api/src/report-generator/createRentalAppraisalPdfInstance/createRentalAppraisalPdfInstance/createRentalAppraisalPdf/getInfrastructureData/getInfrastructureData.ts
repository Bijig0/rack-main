import { Address } from "../../../../../shared/types";
import { getElectricityData } from "./getElectricityData/getElectricityData";
import { getNearbyEmergencyServicesData } from "./getNearbyEmergencyServices/getNearbyEmergencyServices";
import { getNearbyParksData } from "./getNearbyParks/getNearbyParks";
import { getNearbyPlaygroundsData } from "./getNearbyPlaygrounds/getNearbyPlaygrounds";
import { getNearbyShoppingMallsData } from "./getNearbyShoppingMallData/getNearbyShoppingMallData";
import { getSewageData } from "./getSewageData/getSewageData";
import { getStormwaterData } from "./getStormwaterData/getStormwaterData";
import { getPublicTransportData } from "./getTransportData/getPublicTransportData/getPublicTransportData";
import { getWaterData } from "./getWaterData/getWaterData";

type Args = {
  address: Address;
};

const getInfrastructureData = async ({ address }: Args) => {
  // Run lighter data fetchers in parallel
  const lightPromises = {
    electricityData: getElectricityData({ address }),
    nearbyEmergencyServicesData: getNearbyEmergencyServicesData({ address }),
    nearbyParksData: getNearbyParksData({ address }),
    nearbyPlaygroundsData: getNearbyPlaygroundsData({ address }),
    nearbyShoppingMallsData: getNearbyShoppingMallsData({ address }),
    stormwaterData: getStormwaterData({ address }),
    waterData: getWaterData({ address }),
  };

  const lightEntries = Object.entries(lightPromises);
  const lightResults = await Promise.all(lightEntries.map(([, promise]) => promise));

  const lightData = Object.fromEntries(
    lightEntries.map(([key], i) => [key, lightResults[i]])
  );

  // Force GC before loading heavy data
  if (typeof Bun !== 'undefined' && Bun.gc) {
    Bun.gc(true);
  }

  // Run heavy data fetchers sequentially to manage memory
  const sewageData = await getSewageData({ address });

  // Force GC after sewage data
  if (typeof Bun !== 'undefined' && Bun.gc) {
    Bun.gc(true);
  }

  const publicTransportData = await getPublicTransportData({ address });

  // Force GC after transport data
  if (typeof Bun !== 'undefined' && Bun.gc) {
    Bun.gc(true);
  }

  const infrastructureData = {
    ...lightData,
    sewageData,
    publicTransportData,
  };

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
      console.log(infrastructureData);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default getInfrastructureData;
