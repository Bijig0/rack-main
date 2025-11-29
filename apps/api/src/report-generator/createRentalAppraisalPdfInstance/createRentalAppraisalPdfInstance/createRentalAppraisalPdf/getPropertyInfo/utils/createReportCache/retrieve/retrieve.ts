import * as O from "effect/Option";
import { ScraperBaseReturn } from "../../types";
import { Address, CacheStore, PropertyInfoSourcesSchema } from "../types";
import { createCacheKey } from "../utils/createCacheKey/createCacheKey";

/**
 * Retrieve HTML from cache
 * Returns Right with data if cached, Left with error if not found or expired
 */
export const retrieve = async (
  cacheStore: CacheStore,
  address: Address,
  source: PropertyInfoSourcesSchema
): Promise<O.Option<ScraperBaseReturn>> => {
  const cacheKey = createCacheKey(address, source);
  const entry = await cacheStore.get(cacheKey);
  const addressLabel = `${address.addressLine}, ${address.suburb}`;

  if (entry !== undefined) {
    console.log(`📦 Cache HIT: ${source} for ${addressLabel}`);
    const data = { html: entry.data } satisfies ScraperBaseReturn;
    return O.some(data);
  } else {
    console.log(`❌ Cache MISS/EXPIRED: ${source} for ${addressLabel}`);
    return O.none();
  }
};
