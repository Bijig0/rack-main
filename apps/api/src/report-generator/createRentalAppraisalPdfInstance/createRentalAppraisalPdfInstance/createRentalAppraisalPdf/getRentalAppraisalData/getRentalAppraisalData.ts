import { Effect } from "effect";
import { Address } from "../../../../../shared/types";
import getCoverPageData from "../getCoverPageData/getCoverPageData";
import getEnvironmentalData from "../getEnvironmentalData/getEnvironmentalData";
import getInfrastructureData from "../getInfrastructureData/getInfrastructureData";
import getLocationAndSuburbData from "../getLocationAndSuburbData/getLocationAndSuburbData";
import getPlanningZoningData from "../getPlanningZoningData/getPlanningZoningData";
import getPropertyInfo from "../getPropertyInfo/getPropertyInfo";
import { type RentalAppraisalData } from "./schemas";

type Args = {
  address: Address;
};

type Return = {
  rentalAppraisalData: RentalAppraisalData;
};

// Export the schema for external use
export { RentalAppraisalDataSchema } from "./schemas";

const getRentalAppraisalData = async ({ address }: Args): Promise<Return> => {
  const { coverPageData } = await getCoverPageData({ address });
  const { propertyInfo } = await getPropertyInfo({ address });
  const { planningZoningData } = await Effect.runPromise(
    getPlanningZoningData({ address })
  );
  const { environmentalData } = await getEnvironmentalData({ address });
  const { infrastructureData } = await getInfrastructureData({ address });
  const { locationAndSuburbData } = await Effect.runPromise(
    getLocationAndSuburbData({ address })
  );
  // const { pricelabsData } = await getPricelabsData({ address });

  const rentalAppraisalData = {
    coverPageData,
    propertyInfo,
    planningZoningData,
    environmentalData,
    infrastructureData,
    locationAndSuburbData,
    // pricelabsData,
  } satisfies RentalAppraisalData;

  return {
    rentalAppraisalData,
  };
};

export default getRentalAppraisalData;
