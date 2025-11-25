import { Address } from "../../../../../../shared/types";

type Args = {
  address: Address;
};

export type ExecutiveSummaryData = {
  propertyType: string;
  council: string;
  yearBuilt?: number;
  landArea?: number;
  floorArea?: number;
  distanceToCBD?: number;
  estimatedValueRange?: {
    min: number;
    max: number;
  };
  propertyImage?: string;
};

type Return = {
  executiveSummaryData: ExecutiveSummaryData;
};

const getExecutiveSummaryData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real data from APIs (CoreLogic, Domain, etc.)
  // For now, return mock data based on the address

  console.log(
    `Fetching executive summary data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  const executiveSummaryData: ExecutiveSummaryData = {
    propertyType: "house",
    council: "City of Melbourne",
    yearBuilt: 2015,
    landArea: 450,
    floorArea: 320,
    distanceToCBD: 2.5,
    estimatedValueRange: {
      min: 1200000,
      max: 1400000,
    },
    propertyImage: undefined, // TODO: Fetch from property image API
  };

  return { executiveSummaryData };
};

export default getExecutiveSummaryData;
