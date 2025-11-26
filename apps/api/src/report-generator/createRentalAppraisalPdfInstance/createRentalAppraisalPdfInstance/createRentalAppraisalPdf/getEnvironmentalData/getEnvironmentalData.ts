import { Address } from "../../../../../../shared/types";
import { getFloodRiskData } from "./getFloodRiskData/getFloodRiskData";
import { getNoisePollutionData } from "./getNoisePollutionData/getNoisePollutionData";
import { EnvironmentalData } from "./types";

type Args = {
  address: Address;
};

type Return = {
  environmentalData: EnvironmentalData;
};

const getEnvironmentalData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real environmental data from state data catalogues
  // For now, return mock data based on the address

  console.log(
    `Fetching environmental data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Fetch environmental data from multiple sources
  const { noisePollutionData } = await getNoisePollutionData({ address });
  const { floodRiskData } = await getFloodRiskData({ address });

  // Return null if no environmental data available (optional section)
  // For mock purposes, return data for all addresses
  const environmentalData: NonNullable<EnvironmentalData> = {
    easements: false,
    heritage: false,
    character: true, // Character overlay present
    floodRisk: floodRiskData,
    biodiversity: false,
    coastalHazards: false,
    waterways: false,
    wetlands: false,
    bushfireRisk: false,
    steepLand: false,
    noisePollution: noisePollutionData,
    odours: false,
  };

  return { environmentalData };
};

export default getEnvironmentalData;
