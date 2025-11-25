import { CacheStore, PropertyInfoSourcesSchema, Address } from "../types";
import { createCacheKey } from "../utils/createCacheKey/createCacheKey";

/**
 * Check if key is cached and not expired (without retrieving)
 */
export const has = async (
  cacheStore: CacheStore,
  address: Address,
  source: PropertyInfoSourcesSchema
): Promise<boolean> => {
  const cacheKey = createCacheKey(address, source);
  return cacheStore.has(cacheKey);
};
