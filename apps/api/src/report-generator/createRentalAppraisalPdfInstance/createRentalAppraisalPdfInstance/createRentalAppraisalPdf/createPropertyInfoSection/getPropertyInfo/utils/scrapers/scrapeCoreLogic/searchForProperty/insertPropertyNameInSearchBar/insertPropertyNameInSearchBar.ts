import { Page } from "playwright";
import { Address } from "../../../../createReportCache";
import fillSearchElements from "../../fillSearch/fillSearch";
import { normalizeAddressObjToCoreLogicString } from "../../normalizeAddressObjToCoreLogicString/normalizeAddressObjToCoreLogicString";

type Args = {
  page: Page;
  addressToSearch: Address;
};

const insertPropertyNameInSearchBar = async ({
  page,
  addressToSearch,
}: Args) => {
  // 1. Fill the input element
  console.log("🔍 Searching for property...");
  const normalizedAddress =
    normalizeAddressObjToCoreLogicString(addressToSearch);
  await fillSearchElements({ addressToSearch: normalizedAddress, page });
};

export { insertPropertyNameInSearchBar };
