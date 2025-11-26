import { Address } from "../../../../../shared/types";
import { InfrastructureData } from "../getRentalAppraisalData/schemas";
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

type Return = {
  infrastructureData: InfrastructureData;
};

const getInfrastructureData = async ({ address }: Args): Promise<Return> => {
  const promises = {
    electricityData: getElectricityData({ address }),
    nearbyEmergencyServicesData: getNearbyEmergencyServicesData({ address }),
    nearbyParksData: getNearbyParksData({ address }),
    nearbyPlaygroundsData: getNearbyPlaygroundsData({ address }),
    nearbyShoppingMallsData: getNearbyShoppingMallsData({ address }),
    sewageData: getSewageData({ address }),
    stormwaterData: getStormwaterData({ address }),
    waterData: getWaterData({ address }),
    publicTransportData: getPublicTransportData({ address }),
  };

  const entries = Object.entries(promises);
  const results = await Promise.all(entries.map(([, promise]) => promise));

  const infrastructureData = Object.fromEntries(
    entries.map(([key], i) => [key, results[i]])
  );

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
