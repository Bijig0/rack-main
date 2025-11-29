import { Address } from "../../../../../../../../../shared/types";

/**
 * Formats an address for PropertyValue.com.au URL structure
 * Example: "7 English Place, Kew VIC 3101" -> "7-english-place-kew-vic-3101"
 */
export function formatAddressForPropertyValueUrl(address: Address): string {
  const { addressLine, suburb, state, postcode } = address;

  const fullAddress = `${addressLine} ${suburb} ${state} ${postcode}`;

  return fullAddress
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}
