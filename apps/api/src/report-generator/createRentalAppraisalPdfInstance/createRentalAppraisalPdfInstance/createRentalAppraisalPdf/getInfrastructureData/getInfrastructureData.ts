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

const getInfrastructureData = async ({ address }: Args): Promise<Return> => {
  // Run lighter data fetchers in parallel
  const lightPromises = {
    electricityData: getElectricityData({ address }),
    nearbyEmergencyServicesData: getNearbyEmergencyServicesData({ address }),
    nearbyParksData: getNearbyParksData({ address }),
    nearbyPlaygroundsData: getNearbyPlaygroundsData({ address }),
    nearbyShoppingMallsData: getNearbyShoppingMallsData({ address }),
    stormwaterData: getStormwaterData({ address }),
    waterData: getWaterData({ address }),
    publicTransportData: getPublicTransportData({ address }),
    sewageData: getSewageData({ address }),
  };

  const lightEntries = Object.entries(lightPromises);
  const lightResults = await Promise.all(
    lightEntries.map(([, promise]) => promise)
  );

  const lightData = Object.fromEntries(
    lightEntries.map(([key], i) => [key, lightResults[i]])
  );

  const data = InfrastructureDataSchema.parse(lightData);

  return { infrastructureData: data };
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
