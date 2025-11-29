import { CacheStore, PropertyInfoSourcesSchema, Address } from "../types";
import { createCacheKey } from "../utils/createCacheKey/createCacheKey";

/**
 * Clear cache entries
 * If address and source are provided, clears specific entry
 * If only address provided, clears all entries for that address
 * If neither provided, clears all entries
 */
export const clear = async (
  cacheStore: CacheStore,
  address?: Address,
  source?: PropertyInfoSourcesSchema
): Promise<void> => {
  // Clear specific entry
  if (address && source) {
    const cacheKey = createCacheKey(address, source);
    await cacheStore.delete(cacheKey);
    return;
  }

  // Clear all entries (no filters supported for now in base implementation)
  await cacheStore.clear();
};

/**
 * Clear only expired cache entries
 * @returns Number of entries that were cleared
 */
export const clearExpired = async (cacheStore: CacheStore): Promise<number> => {
  return cacheStore.clearExpired();
};
