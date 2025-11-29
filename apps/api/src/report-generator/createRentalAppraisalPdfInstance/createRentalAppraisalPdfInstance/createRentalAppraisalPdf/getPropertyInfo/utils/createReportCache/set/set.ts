import {
  Address,
  CacheEntry,
  CacheStore,
  HtmlDocumentSchema,
  PropertyInfoSourcesSchema,
} from "../types";
import { createCacheKey } from "../utils/createCacheKey/createCacheKey";
import { normalizeAddressObjToString as normalizeAddress } from "../utils/normalizeAddressObjToString/normalizeAddressObjToString";

/**
 * Manually set cache (useful for testing)
 */
export const set = async (
  cacheStore: CacheStore,
  address: Address,
  source: PropertyInfoSourcesSchema,
  data: HtmlDocumentSchema
): Promise<void> => {
  const cacheKey = createCacheKey(address, source);
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
    address: normalizeAddress(address),
    source,
  };

  await cacheStore.set(cacheKey, entry);
};
