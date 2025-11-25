import { Address } from "../../../../../../shared/types";

type Args = {
  address: Address;
};

export type LocationSuburbData = {
  suburb: string;
  state: string;
  distanceToCBD?: number;
  population?: number;
  populationGrowth?: number;
  occupancyData?: {
    purchaser: number;
    renting: number;
    other: number;
  };
  rentalYieldGrowth?: number[];
};

type Return = {
  locationSuburbData: LocationSuburbData;
};

const getLocationSuburbData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real suburb and demographic data from ABS, CoreLogic, etc.
  // For now, return mock data based on the address

  console.log(
    `Fetching location and suburb data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  const locationSuburbData: LocationSuburbData = {
    suburb: address.suburb,
    state: address.state,
    distanceToCBD: 2.5,
    population: 45000,
    populationGrowth: 3.2, // 3.2% growth over 5 years
    occupancyData: {
      purchaser: 45,
      renting: 52,
      other: 3,
    },
    rentalYieldGrowth: [3.2, 3.5, 3.8, 4.1, 4.3], // Last 5 years
  };

  return { locationSuburbData };
};

export default getLocationSuburbData;
