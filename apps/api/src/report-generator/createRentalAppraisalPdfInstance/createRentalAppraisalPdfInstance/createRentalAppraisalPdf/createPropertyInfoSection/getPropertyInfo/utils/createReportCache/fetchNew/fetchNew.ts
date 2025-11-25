import { Effect, identity, pipe } from "effect";
import * as E from "effect/Either";
import { Scraper } from "../../types";
import {
  Address,
  CacheEntry,
  CacheStore,
  HtmlDocumentSchema,
  PropertyInfoSourcesSchema,
} from "../types";
import { createCacheKey } from "../utils/createCacheKey/createCacheKey";
import { normalizeAddressObjToString as normalizeAddress } from "../utils/normalizeAddressObjToString/normalizeAddressObjToString";
import { ScraperBaseArgs, ScraperBaseReturn } from "../../types/scraper";

/**
 * Fetch new HTML and cache it
 */
export const fetchNew = async (
  cacheStore: CacheStore,
  address: Address,
  source: PropertyInfoSourcesSchema,
  scraper: Scraper
): Promise<E.Either<ScraperBaseReturn, Error>> => {
  const addressLabel = `${address.addressLine}, ${address.suburb}`;
  console.log(
    `🌐 Fetching NEW: ${source} for ${addressLabel} - Running scraper...`
  );

  return pipe(
    // Call scraper and get Either
    Effect.promise(() => scraper({ address })),
    // Convert Either to Effect - this unwraps the Either into Effect's error channel
    Effect.flatMap(identity),
    // Now data is unwrapped! Cache it as a side effect
    Effect.tap(({ html }) =>
      Effect.promise(async () => {
        const cacheKey = createCacheKey(address, source);
        const entry: CacheEntry = {
          data: html,
          timestamp: Date.now(),
          address: normalizeAddress(address),
          source,
        };

        await cacheStore.set(cacheKey, entry);
        console.log(`✅ Cached: ${source} for ${addressLabel}`);
      })
    ),
    // Handle errors separately
    Effect.tapError((error) =>
      Effect.sync(() => {
        console.error(
          `❌ Scraper failed for ${source} - ${addressLabel}:`,
          error
        );
      })
    ),
    // Convert Effect back to Either
    Effect.either,
    // Run the pipeline
    Effect.runPromise
  );
};
