import { Address } from "../../../../../../../../../../shared/types";

/**
 * Converts an address into domain.com.au property profile URL format:
 * Example: "7 English Place, Kew VIC 3101" -> "7-english-place-kew-vic-3101"
 * - lowercase
 * - spaces replaced with '-'
 * - commas removed
 */
export function formatAddressForDomainUrl(address: Address): string {
  // Combine all address components into one string
  const fullAddress = `${address.addressLine} ${address.suburb} ${address.state} ${address.postcode}`;

  // Convert to lowercase, remove non-alphanumeric except spaces, then replace spaces with hyphens
  return fullAddress
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove commas, periods, etc
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}
