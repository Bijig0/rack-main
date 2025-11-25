/**
 * Default TTL for cache entries: 24 hours in milliseconds
 */
export const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 86400000 ms

/**
 * Check if a cache entry has expired based on its timestamp
 *
 * @param timestamp - The timestamp when the entry was cached (in ms since epoch)
 * @param ttlMs - Time-to-live in milliseconds (default: 24 hours)
 * @returns true if the entry has expired, false otherwise
 *
 * @example
 * const cachedAt = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
 * isExpired(cachedAt); // Returns: true
 *
 * const recentlyCached = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago
 * isExpired(recentlyCached); // Returns: false
 */
export const isExpired = (
  timestamp: number,
  ttlMs: number = DEFAULT_TTL_MS
): boolean => {
  const now = Date.now();
  const age = now - timestamp;
  return age > ttlMs;
};
