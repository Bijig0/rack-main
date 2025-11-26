import { Effect, pipe } from "effect";
import * as E from "effect/Either";
import * as O from "effect/Option";
import { Scraper, ScraperBaseReturn } from "../../types";
import { fetchNew } from "../fetchNew/fetchNew";
import { retrieve } from "../retrieve/retrieve";
import { Address, CacheStore, PropertyInfoSourcesSchema } from "../types";

/**
 * Retrieve from cache OR fetch new if not cached
 * Combines retrieve() and fetchNew() in one call
 */

type Args = {
  cacheStore: CacheStore;
  address: Address;
  source: PropertyInfoSourcesSchema;
  scraper: Scraper;
};

export const fetchOrRetrieve = async ({
  cacheStore,
  address,
  source,
  scraper,
}: Args): Promise<E.Either<ScraperBaseReturn, Error>> => {
  return pipe(
    // Get from cache (returns Option)
    Effect.promise(() => retrieve(cacheStore, address, source)),
    // If Some, return data; if None, fetch new
    Effect.flatMap(
      O.match({
        onNone: () =>
          pipe(
            Effect.promise(() =>
              fetchNew(cacheStore, address, source, scraper)
            ),
            Effect.flatMap((either) => either) // Unwrap the Either into Effect
          ),
        onSome: (data) => Effect.succeed(data), // Just the data, not wrapped in Either
      })
    ),
    // Convert Effect to Either
    Effect.either,
    // Run the pipeline
    Effect.runPromise
  );
};
