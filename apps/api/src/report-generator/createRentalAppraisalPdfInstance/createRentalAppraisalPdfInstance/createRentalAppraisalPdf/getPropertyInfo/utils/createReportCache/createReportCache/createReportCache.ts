import { CacheStore } from "../types";
import { InMemoryCacheStore } from "../stores/InMemoryCacheStore/InMemoryCacheStore";

/**
 * Singleton instance of the cache store
 * Shared across the entire application lifecycle
 *
 * Note: This is a global singleton. If you need per-request isolation,
 * use createReportCache() instead to create separate instances.
 */
let globalCacheStoreInstance: CacheStore | null = null;

/**
 * Get the singleton cache store instance
 * Creates it if it doesn't exist (uses InMemoryCacheStore by default)
 */
export const getReportCache = (): CacheStore => {
  if (globalCacheStoreInstance === null) {
    globalCacheStoreInstance = new InMemoryCacheStore();
  }
  return globalCacheStoreInstance;
};

/**
 * Create a new cache store instance
 * Use this when you need a separate cache instance (e.g., per-request caching)
 *
 * @param store - Optional custom cache store (defaults to InMemoryCacheStore)
 */
export const createReportCache = (store?: CacheStore): CacheStore => {
  return store || new InMemoryCacheStore();
};

/**
 * Reset the singleton cache instance
 * Useful for testing or when you want to clear all cached data
 */
export const resetGlobalCache = (): void => {
  globalCacheStoreInstance = null;
};

/**
 * Clean expired entries from the global cache
 * @returns Number of entries that were cleaned
 */
export const cleanExpiredEntries = async (): Promise<number> => {
  const cache = getReportCache();
  return cache.clearExpired();
};
