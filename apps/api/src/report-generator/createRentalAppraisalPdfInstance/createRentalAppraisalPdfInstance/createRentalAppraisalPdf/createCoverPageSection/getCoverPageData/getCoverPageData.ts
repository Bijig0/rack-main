import { Address } from "../../../../../../shared/types";
import getExecutiveSummaryData from "../../createExecutiveSummarySection/getExecutiveSummaryData/getExecutiveSummaryData";

type Args = {
  address: Address;
};

export type CoverPageData = {
  addressCommonName: string;
  reportDate: Date;
  companyLogo?: string;
  reportId: string;
  // Executive Summary fields
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
  coverPageData: CoverPageData;
};

const getCoverPageData = async ({ address }: Args): Promise<Return> => {
  // TODO: Fetch real data from company settings, generate report ID from database, etc.
  // For now, return mock data

  const addressCommonName = `${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`;

  // Fetch executive summary data to include on first page
  const { executiveSummaryData } = await getExecutiveSummaryData({ address });

  const coverPageData: CoverPageData = {
    addressCommonName,
    reportDate: new Date(),
    reportId: `PR-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 1000000
    )
      .toString()
      .padStart(6, "0")}`,
    companyLogo: undefined, // TODO: Fetch from company settings
    // Include executive summary data
    ...executiveSummaryData,
  };

  return { coverPageData };
};

export default getCoverPageData;
