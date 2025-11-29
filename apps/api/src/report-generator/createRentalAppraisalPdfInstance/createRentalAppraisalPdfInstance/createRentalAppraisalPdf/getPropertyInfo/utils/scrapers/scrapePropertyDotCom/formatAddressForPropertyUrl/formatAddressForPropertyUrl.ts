import { Address } from "../../../../../../../../../shared/types";

/**
 * Converts an address into property.com.au URL format:
 * Example: "7 English Place, Kew VIC 3101" -> "7-english-place-kew-vic-3101"
 * - All lowercase
 * - Spaces replaced with hyphens
 * - Special characters removed
 */
export function formatAddressForPropertyUrl(address: Address): string {
  const { addressLine, suburb, state, postcode } = address;

  // Combine all parts
  const fullAddress = `${addressLine} ${suburb} ${state} ${postcode}`;

  // Convert to lowercase, replace spaces with hyphens, remove special chars
  return fullAddress
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}
