import { Address } from "../../../../../../shared/types";
import { getBiodiversityData } from "./getBiodiversityData/getBiodiversityData";
import { getBushfireRiskData } from "./getBushFireRiskData/getBushfireRiskData";
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

  const { biodiversityData } = await getBiodiversityData({ address });
  const { fireHistory, fireManagementZones, riskAnalysis } =
    await getBushfireRiskData({ address });

  const { noisePollutionData } = await getNoisePollutionData({ address });
  const { floodRiskData } = await getFloodRiskData({ address });

  return { environmentalData };
};

export default getEnvironmentalData;
