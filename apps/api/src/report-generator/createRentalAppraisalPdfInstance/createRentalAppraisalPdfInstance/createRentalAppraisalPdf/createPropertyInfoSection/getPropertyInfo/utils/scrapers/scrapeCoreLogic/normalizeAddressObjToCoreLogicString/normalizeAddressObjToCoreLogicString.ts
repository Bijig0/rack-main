import { Address } from "../../../../../../../../../../shared/types";
import { normalizeAddressObjToString } from "../../../createReportCache/utils/normalizeAddressObjToString/normalizeAddressObjToString";

const normalizeAddressObjToCoreLogicString = (address: Address): string => {
  const normalizedString = normalizeAddressObjToString(address);
  return normalizedString;
};

export { normalizeAddressObjToCoreLogicString };
