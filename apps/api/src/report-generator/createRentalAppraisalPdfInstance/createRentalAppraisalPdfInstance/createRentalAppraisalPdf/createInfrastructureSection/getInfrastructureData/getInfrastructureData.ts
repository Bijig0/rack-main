import { Address } from "../../../../../../shared/types";

type Args = {
  address: Address;
};

export type InfrastructureData = {
  sewer?: boolean;
  water?: boolean;
  stormwater?: boolean;
  electricity?: boolean;
  publicTransport?: {
    available: boolean;
    distance?: number;
  };
  shoppingCenter?: {
    available: boolean;
    distance?: number;
  };
  parkAndPlayground?: {
    available: boolean;
    distance?: number;
  };
  emergencyServices?: {
    available: boolean;
    distance?: number;
  };
} | null;

type Return = {
  infrastructureData: InfrastructureData;
};

const getInfrastructureData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real infrastructure data from utility providers and GIS services
  // For now, return mock data based on the address

  console.log(
    `Fetching infrastructure data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Return null if no infrastructure data available (optional section)
  // For mock purposes, return data for all addresses
  const infrastructureData: NonNullable<InfrastructureData> = {
    sewer: true,
    water: true,
    stormwater: true,
    electricity: true,
    publicTransport: {
      available: true,
      distance: 0.5,
    },
    shoppingCenter: {
      available: true,
      distance: 1.2,
    },
    parkAndPlayground: {
      available: true,
      distance: 0.3,
    },
    emergencyServices: {
      available: true,
      distance: 2.1,
    },
  };

  return { infrastructureData };
};

export default getInfrastructureData;
