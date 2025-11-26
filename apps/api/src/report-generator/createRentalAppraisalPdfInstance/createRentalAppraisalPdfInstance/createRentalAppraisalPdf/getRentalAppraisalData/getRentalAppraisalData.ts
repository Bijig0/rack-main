import { Address } from "../../../../../shared/types";
import getCoverPageData from "../createCoverPageSection/getCoverPageData/getCoverPageData";
import getEnvironmentalData from "../createEnvironmentalSection/getEnvironmentalData/getEnvironmentalData";
import getInfrastructureData from "../createInfrastructureSection/getInfrastructureData/getInfrastructureData";
import getLocationSuburbData from "../createLocationSuburbSection/getLocationSuburbData/getLocationSuburbData";
import getPropertyInfo from "../createPropertyInfoSection/getPropertyInfo/getPropertyInfo";
import getPlanningZoningData from "../getPlanningZoningData/getPlanningZoningData";
import getPricelabsData from "../getPricelabsData/getPricelabsData";
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
  const { planningZoningData } = await getPlanningZoningData({ address });
  const { environmentalData } = await getEnvironmentalData({ address });
  const { infrastructureData } = await getInfrastructureData({ address });
  const { locationSuburbData } = await getLocationSuburbData({ address });
  const { pricelabsData } = await getPricelabsData({ address });

  const rentalAppraisalData = {
    coverPageData,
    propertyInfo,
    planningZoningData,
    environmentalData,
    infrastructureData,
    locationSuburbData,
    pricelabsData,
  } satisfies RentalAppraisalData;

  return {
    rentalAppraisalData,
  };
};

export default getRentalAppraisalData;
