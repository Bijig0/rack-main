import { Effect } from "effect";
import * as O from "effect/Option";
import { Address } from "../../../../../../../../shared/types";
import { CacheStore } from "../../utils/createReportCache/types";
import { Fetcher } from "../../utils/types/scraper";

export const trySources = <TData>(
  cacheStore: CacheStore,
  address: Address,
  fetchers: Fetcher<TData>[],
  options?: { dataName?: string }
): Effect.Effect<O.Option<TData>, Error, never> => {
  const dataName = options?.dataName ?? "data";

  if (fetchers.length === 0) {
    return Effect.succeed(O.none());
  }

  const [current, ...rest] = fetchers;

  return current({ cacheStore, address }).pipe(
    Effect.flatMap((optionData) => {
      // Check if the Option contains data
      if (O.isSome(optionData)) {
        return Effect.log(`✅ Found ${dataName}: ${optionData.value}`).pipe(
          Effect.map(() => optionData)
        );
      }

      // Option.none - try next source
      return Effect.log(`⚠️ ${dataName} not found, trying next source...`).pipe(
        Effect.flatMap(() => trySources(cacheStore, address, rest, options))
      );
    }),
    Effect.catchAll((err) =>
      Effect.log(`⚠️ Error fetching ${dataName}: ${err.message}`).pipe(
        Effect.flatMap(() => trySources(cacheStore, address, rest, options))
      )
    )
  );
};
