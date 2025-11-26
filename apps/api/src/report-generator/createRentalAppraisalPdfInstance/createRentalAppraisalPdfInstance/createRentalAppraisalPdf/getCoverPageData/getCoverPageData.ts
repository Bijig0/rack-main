import { Address } from "../../../../../../shared/types";
import { CoverPageData } from "../../getRentalAppraisalData/schemas";
import { formatAddress } from "./formatAddress/formatAddress";
import getReportDate from "./getReportDate/getReportDate";

type Args = {
  address: Address;
};

type Return = {
  coverPageData: CoverPageData;
};

const getCoverPageData = async ({ address }: Args): Promise<Return> => {
  const formattedAddress = formatAddress({ address });
  const reportDate = getReportDate();
  const coverPageData = {
    addressCommonName: formattedAddress,
    reportDate: reportDate.reportDate,
  } satisfies CoverPageData;
  return { coverPageData };
};

export default getCoverPageData;
