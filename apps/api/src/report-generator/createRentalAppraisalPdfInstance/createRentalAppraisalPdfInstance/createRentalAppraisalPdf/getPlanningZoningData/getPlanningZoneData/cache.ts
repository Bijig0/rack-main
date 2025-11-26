import type { Address } from "../../../../../../shared/types";
import type { PlanningZoneData } from "./types";

/**
 * In-memory cache for planning zone data.
 * Prevents redundant WFS calls when multiple functions need the same data.
 */
const planningZoneCache = new Map<string, PlanningZoneData>();

/**
 * Creates a cache key from an address
 */
export const createCacheKey = (address: Address): string => {
  return `${address.addressLine}|${address.suburb}|${address.state}|${address.postcode}`.toLowerCase();
};

/**
 * Gets cached planning zone data for an address
 */
export const getCachedPlanningZoneData = (
  address: Address
): PlanningZoneData | undefined => {
  const key = createCacheKey(address);
  return planningZoneCache.get(key);
};

/**
 * Sets cached planning zone data for an address
 */
export const setCachedPlanningZoneData = (
  address: Address,
  data: PlanningZoneData
): void => {
  const key = createCacheKey(address);
  planningZoneCache.set(key, data);
};

/**
 * Clears the planning zone cache (useful for testing)
 */
export const clearPlanningZoneCache = (): void => {
  planningZoneCache.clear();
};

/**
 * Gets the current cache size (useful for debugging)
 */
export const getPlanningZoneCacheSize = (): number => {
  return planningZoneCache.size;
};
