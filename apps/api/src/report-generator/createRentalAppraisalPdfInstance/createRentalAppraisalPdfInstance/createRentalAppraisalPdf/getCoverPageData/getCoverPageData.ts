import z from "zod";
import { formatAddress } from "./formatAddress/formatAddress";
import getReportDate from "./getReportDate/getReportDate";
import { Address } from "../../../../../shared/types";

type Args = {
  address: Address;
};

type Return = {
  coverPageData: CoverPageData;
};

export const CoverPageDataSchema = z.object({
  addressCommonName: z.string(),
  reportDate: z.string(),
});

export type CoverPageData = z.infer<typeof CoverPageDataSchema>;

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
