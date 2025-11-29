import { CacheStore } from "../types";
import { InMemoryCacheStore } from "../stores/InMemoryCacheStore/InMemoryCacheStore";
import { RedisCacheStore } from "../stores/RedisCacheStore/RedisCacheStore";

/**
 * Singleton instance of the cache store
 * Shared across the entire application lifecycle
 *
 * Note: This is a global singleton. If you need per-request isolation,
 * use createReportCache() instead to create separate instances.
 */
let globalCacheStoreInstance: CacheStore | null = null;

/**
 * Create a default cache store based on environment
 * Uses RedisCacheStore if Redis is available, otherwise falls back to InMemoryCacheStore
 */
const createDefaultCacheStore = (): CacheStore => {
  // Check if Redis is available in the environment
  const redisHost = process.env.REDIS_HOST;
  const redisUrl = process.env.REDIS_URL;

  if (redisHost || redisUrl) {
    try {
      console.log("📦 Initializing Redis cache store...");
      return new RedisCacheStore();
    } catch (error) {
      console.warn(
        "⚠️  Failed to connect to Redis, falling back to in-memory cache:",
        error
      );
      return new InMemoryCacheStore();
    }
  }

  console.log("📦 Initializing in-memory cache store (no Redis configured)");
  return new InMemoryCacheStore();
};

/**
 * Get the singleton cache store instance
 * Creates it if it doesn't exist (uses RedisCacheStore if available, otherwise InMemoryCacheStore)
 */
export const getReportCache = (): CacheStore => {
  if (globalCacheStoreInstance === null) {
    globalCacheStoreInstance = createDefaultCacheStore();
  }
  return globalCacheStoreInstance;
};

/**
 * Create a new cache store instance
 * Use this when you need a separate cache instance (e.g., per-request caching)
 *
 * @param store - Optional custom cache store (defaults to auto-detected: Redis if available, otherwise InMemory)
 */
export const createReportCache = (store?: CacheStore): CacheStore => {
  return store || createDefaultCacheStore();
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
