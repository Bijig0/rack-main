import Redis from "ioredis";
import { CacheStore, CacheEntry } from "../../types";
import { isExpired } from "../../utils/isExpired/isExpired";

/**
 * Redis implementation of CacheStore
 *
 * Stores cache entries in Redis with automatic TTL-based expiration.
 * Data persists across application restarts and can be shared across instances.
 *
 * @example
 * ```typescript
 * // Use default Redis connection (localhost:6379)
 * const cache = new RedisCacheStore();
 *
 * // Use custom Redis URL
 * const cache = new RedisCacheStore("redis://localhost:6379");
 *
 * // Use existing Redis client
 * const redis = new Redis();
 * const cache = new RedisCacheStore(redis);
 * ```
 */
export class RedisCacheStore implements CacheStore {
  private redis: Redis;
  private keyPrefix: string;
  private defaultTTL: number;

  /**
   * Create a new RedisCacheStore
   *
   * @param redisClientOrUrl - Redis client instance or connection URL
   *                           Defaults to redis://localhost:6379 or REDIS_URL env var
   * @param options - Configuration options
   * @param options.keyPrefix - Prefix for all cache keys (default: "report-cache:")
   * @param options.defaultTTL - Default TTL in seconds (default: 24 hours)
   */
  constructor(
    redisClientOrUrl?: Redis | string,
    options?: {
      keyPrefix?: string;
      defaultTTL?: number;
    }
  ) {
    // Initialize Redis client
    if (redisClientOrUrl instanceof Redis) {
      this.redis = redisClientOrUrl;
    } else {
      const redisUrl =
        redisClientOrUrl ||
        process.env.REDIS_URL ||
        `redis://${process.env.REDIS_HOST || "localhost"}:6379`;
      this.redis = new Redis(redisUrl);
    }

    this.keyPrefix = options?.keyPrefix || "report-cache:";
    this.defaultTTL = options?.defaultTTL || 24 * 60 * 60; // 24 hours in seconds

    // Set up error handler
    this.redis.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  /**
   * Get the full Redis key with prefix
   */
  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * Get a cache entry by key
   * Returns undefined if not found or expired
   */
  async get(key: string): Promise<CacheEntry | undefined> {
    try {
      const data = await this.redis.get(this.getKey(key));

      if (!data) {
        return undefined;
      }

      const entry = JSON.parse(data) as CacheEntry;

      // Check if expired (Redis TTL should handle this, but double-check)
      if (isExpired(entry.timestamp)) {
        await this.delete(key);
        return undefined;
      }

      return entry;
    } catch (error) {
      console.error(`Error getting cache entry for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set a cache entry with TTL
   */
  async set(key: string, entry: CacheEntry): Promise<void> {
    try {
      const redisKey = this.getKey(key);
      const value = JSON.stringify(entry);

      // Set with TTL (EX = seconds)
      await this.redis.setex(redisKey, this.defaultTTL, value);
    } catch (error) {
      console.error(`Error setting cache entry for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if a key exists in cache
   */
  async has(key: string): Promise<boolean> {
    try {
      const entry = await this.get(key);
      return entry !== undefined;
    } catch (error) {
      console.error(`Error checking cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a specific cache entry
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.getKey(key));
    } catch (error) {
      console.error(`Error deleting cache entry for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all cache entries with this prefix
   */
  async clear(): Promise<void> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.redis.keys(pattern);

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  /**
   * Clear expired entries
   * Note: Redis TTL handles expiration automatically, but this method
   * can be used to manually clean up entries that expired based on timestamp
   *
   * @returns Count of entries that were cleared
   */
  async clearExpired(): Promise<number> {
    try {
      let clearedCount = 0;
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.redis.keys(pattern);

      for (const redisKey of keys) {
        const data = await this.redis.get(redisKey);
        if (data) {
          const entry = JSON.parse(data) as CacheEntry;
          if (isExpired(entry.timestamp)) {
            await this.redis.del(redisKey);
            clearedCount++;
          }
        }
      }

      return clearedCount;
    } catch (error) {
      console.error("Error clearing expired cache entries:", error);
      return 0;
    }
  }

  /**
   * Close the Redis connection
   * Call this when shutting down the application
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}
