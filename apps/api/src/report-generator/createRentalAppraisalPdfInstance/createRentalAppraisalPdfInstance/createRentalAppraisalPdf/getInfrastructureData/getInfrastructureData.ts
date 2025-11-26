import { Address } from "../../../../../shared/types";
import { InfrastructureData } from "../getRentalAppraisalData/schemas";
import { getElectricityData } from "./getElectricityData/getElectricityData";
import { getNearbyEmergencyServicesData } from "./getNearbyEmergencyServices/getNearbyEmergencyServices";
import { getNearbyParksData } from "./getNearbyParks/getNearbyParks";
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
    nearbyPlaygroundsData: getNearbyPlagr({ address }),
    nearbyShoppingMallsData: getNearbyShoppingMallsData({ address }),
    sewageData: getSewageData({ address }),
    stormwaterData: getStormwaterData({ address }),
    waterData: getWaterData({ address }),
    publicTransportData: getPublicTransportData({ address }),
  };

  const entries = Object.entries(promises);
  const results = await Promise.all(entries.map(([, promise]) => promise));

  return Object.fromEntries(
    entries.map(([key], i) => [key, results[i]])
  ) as Return;
};
export default getInfrastructureData;
