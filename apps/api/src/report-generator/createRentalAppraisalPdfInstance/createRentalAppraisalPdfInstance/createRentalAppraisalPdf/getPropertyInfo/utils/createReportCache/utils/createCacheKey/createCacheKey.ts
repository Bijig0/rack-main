import { Address } from "../../../../../../../../../shared/types";
import { PropertyInfoSourcesSchema } from "../../types";
import { normalizeAddressObjToString as normalizeAddress } from "../normalizeAddressObjToString/normalizeAddressObjToString";

/**
 * Create a unique cache key from an address and data source
 *
 * Format: {normalizedAddress}::{source}
 *
 * @example
 * createCacheKey(
 *   { addressLine: "6 English Place", suburb: "Kew", state: "VIC", postcode: "3101" },
 *   "domain.com"
 * )
 * // Returns: "6 english place|kew|vic|3101::domain.com"
 */
export const createCacheKey = (
  address: Address,
  source: PropertyInfoSourcesSchema
): string => {
  const normalizedAddress = normalizeAddress(address);
  return `${normalizedAddress}::${source}`;
};
