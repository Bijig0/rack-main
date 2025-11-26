import { Address } from "../../../../../shared/types";

type Args = {
  address: Address;
};

export type PricelabsData = {
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  annualRevenue?: number;
  occupancyRate?: number;
} | null;

type Return = {
  pricelabsData: PricelabsData;
};

const getPricelabsData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real Pricelabs estimate data from Pricelabs API
  // For now, return mock data based on the address

  console.log(
    `Fetching Pricelabs data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Return null if no Pricelabs data available (optional section)
  // For mock purposes, return data for all addresses
  const pricelabsData: NonNullable<PricelabsData> = {
    dailyRate: 250,
    weeklyRate: 1600,
    monthlyRate: 6000,
    annualRevenue: 65000,
    occupancyRate: 75,
  };

  return { pricelabsData };
};

export default getPricelabsData;
