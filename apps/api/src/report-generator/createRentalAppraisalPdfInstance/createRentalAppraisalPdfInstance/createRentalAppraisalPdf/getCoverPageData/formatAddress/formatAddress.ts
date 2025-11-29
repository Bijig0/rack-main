import { Address } from "../../../../../../shared/types";
import { normalizeAddress } from "../../getPropertyInfo/utils/createReportCache";

type Args = {
  address: Address;
};

export const formatAddress = ({ address }: Args): string => {
  return normalizeAddress(address);
};
