import { CacheStore, CacheEntry, ReportCache } from "../../types";
import { isExpired } from "../../utils/isExpired/isExpired";

/**
 * In-memory implementation of CacheStore
 *
 * Stores cache entries in a Map with automatic expiration checking.
 * Fast, simple, but lost on application restart.
 */
export class InMemoryCacheStore implements CacheStore {
  private cache: ReportCache;

  constructor() {
    this.cache = new Map<string, CacheEntry>();
  }

  /**
   * Get a cache entry by key
   * Returns undefined if not found or expired
   */
  async get(key: string): Promise<CacheEntry | undefined> {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (isExpired(entry.timestamp)) {
      // Remove expired entry
      this.cache.delete(key);
      return undefined;
    }

    return entry;
  }

  /**
   * Set a cache entry
   */
  async set(key: string, entry: CacheEntry): Promise<void> {
    this.cache.set(key, entry);
  }

  /**
   * Check if a key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = await this.get(key);
    return entry !== undefined;
  }

  /**
   * Delete a specific cache entry
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   * @returns Count of entries that were cleared
   */
  async clearExpired(): Promise<number> {
    let clearedCount = 0;
    const keysToDelete: string[] = [];

    // Find all expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (isExpired(entry.timestamp)) {
        keysToDelete.push(key);
      }
    }

    // Delete them
    for (const key of keysToDelete) {
      this.cache.delete(key);
      clearedCount++;
    }

    return clearedCount;
  }
}
