import { Address } from "../../../../../../shared/types";

type Args = {
  address: Address;
};

export type FloorPlanData = {
  floorPlanImage: string;
} | null;

type Return = {
  floorPlanData: FloorPlanData;
};

const getFloorPlanData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real floor plan image from property APIs
  // For now, return null (no floor plan available)

  console.log(
    `Fetching floor plan for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Return null if no floor plan available (optional section)
  // In a real implementation, this would fetch from Domain, CoreLogic, or property database
  return { floorPlanData: null };
};

export default getFloorPlanData;
