# trySources - Generic Data Fetching Pipeline

A generic pipeline function that tries multiple data sources in sequence until one succeeds.

## Overview

`trySources` is a type-safe, Effect-based pipeline that attempts to fetch data from multiple sources. It automatically handles errors and null values, moving to the next source until data is found or all sources are exhausted.

## Type Signature

```typescript
trySources<TData>(
  cacheStore: CacheStore,
  address: Address,
  fetchers: Fetcher<TData>[],
  options?: { dataName?: string }
): Effect.Effect<TData, Error, never>
```

## How It Works

1. **Try each fetcher in order** - Sources are attempted sequentially, not in parallel
2. **Success condition** - If a fetcher returns valid data (not null/undefined), return it immediately
3. **Failure handling** - If a fetcher returns null/undefined or throws an error, try the next one
4. **Fallback** - If all fetchers fail, return null
5. **Logging** - Helpful console logs show which source succeeded or failed

## Basic Usage

### Year Built Example

```typescript
import { trySources } from "./trySources/trySources";
import { getPropertyValueDotComYearBuilt } from "./getPropertyValueDotComYearBuilt/getPropertyValueDotComYearBuilt";
import { getDomainDotComYearBuilt } from "./getDomainDotComYearBuilt/getDomainDotComYearBuilt";
import { YearBuilt } from "./types";

const cache = getReportCache();
const address = { addressLine: "7 English Place", suburb: "Kew", state: "VIC", postcode: "3101" };

const yearBuilt = await Effect.runPromise(
  trySources<YearBuilt>(
    cache,
    address,
    [
      getPropertyValueDotComYearBuilt,
      getDomainDotComYearBuilt,
    ],
    { dataName: "year built" }
  )
);

console.log(yearBuilt); // 2015 (or null if not found)
```

### Land Size Example

```typescript
import { trySources } from "../utils/trySources/trySources";
import { getPropertyValueDotComLandSize } from "./getPropertyValueDotComLandSize/getPropertyValueDotComLandSize";
import { getDomainDotComLandSize } from "./getDomainDotComLandSize/getDomainDotComLandSize";
import { getRealEstateDotComLandSize } from "./getRealEstateDotComLandSize/getRealEstateDotComLandSize";
import { LandSize } from "./types";

const landSize = await Effect.runPromise(
  trySources<LandSize>(
    cache,
    address,
    [
      getPropertyValueDotComLandSize,
      getDomainDotComLandSize,
      getRealEstateDotComLandSize,
    ],
    { dataName: "land size" }
  )
);

console.log(landSize); // 650 (or null if not found)
```

## Creating Compatible Fetchers

All fetchers must match the `Fetcher<TData>` type:

```typescript
export type Fetcher<TData> = (
  cacheStore: CacheStore,
  address: Address
) => Effect.Effect<TData, Error, never>;
```

### Example: Creating a Year Built Fetcher

```typescript
import { Effect, identity, pipe } from "effect";
import { Address } from "../../../../../../../shared/types";
import { CacheStore } from "../utils/createReportCache/types";
import { fetchOrRetrieve } from "../utils/createReportCache";
import { parseFromHtml } from "../utils/parseFromHtml";
import { scrapeDomainDotCom } from "../utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";
import { YearBuilt, YearBuiltSchema } from "./types";
import { yearBuiltParseOptions } from "./domainDotComYearBuiltParseStrategy";

export const getDomainDotComYearBuilt = (
  cacheStore: CacheStore,
  address: Address
): Effect.Effect<YearBuilt, Error, never> => {
  return pipe(
    Effect.promise(() =>
      fetchOrRetrieve({
        cacheStore,
        address,
        source: "domain.com.au",
        scraper: scrapeDomainDotCom,
      })
    ),
    Effect.flatMap(identity),
    Effect.map(({ html }) =>
      parseFromHtml(html, z.object({ yearBuilt: YearBuiltSchema }), {
        yearBuilt: yearBuiltParseOptions,
      })
    ),
    Effect.flatMap(identity),
    Effect.map(({ yearBuilt }) => yearBuilt)
  );
};
```

## Console Output

The pipeline provides helpful logging:

```
✅ Found year built: 2015
```

Or when a source fails:

```
⚠️  Error from source: Failed to fetch HTML
   Trying next source...
⚠️  year built was null, trying next source...
✅ Found year built: 2015
```

## Error Handling

The pipeline never throws errors - it catches them and tries the next source:

```typescript
// This will NOT throw an error, even if all sources fail
const yearBuilt = await Effect.runPromise(
  trySources<YearBuilt>(cache, address, [
    getBrokenFetcher1,  // Throws error
    getBrokenFetcher2,  // Returns null
    getBrokenFetcher3,  // Throws error
  ])
);

console.log(yearBuilt); // null
```

## Best Practices

1. **Order matters** - Put the most reliable/fastest sources first
2. **Use dataName** - Helps with debugging when viewing logs
3. **Type safety** - Always specify the generic type parameter `<TData>`
4. **Fallback strategy** - Check if result is null before using it

```typescript
const yearBuilt = await Effect.runPromise(
  trySources<YearBuilt>(cache, address, fetchers, { dataName: "year built" })
);

if (yearBuilt !== null && yearBuilt !== undefined) {
  console.log(`Found year built: ${yearBuilt}`);
  return { yearBuilt };
} else {
  console.log("Falling back to legacy scraping...");
  // Fallback logic here
}
```

## Advanced: Type Inference

TypeScript can often infer the type from the fetchers array:

```typescript
// Explicit type parameter (recommended for clarity)
const yearBuilt = await Effect.runPromise(
  trySources<YearBuilt>(cache, address, [getPropertyValueDotComYearBuilt])
);

// Type can be inferred from fetchers, but less clear
const yearBuilt = await Effect.runPromise(
  trySources(cache, address, [getPropertyValueDotComYearBuilt])
);
```

## Integration with Effect-TS

The pipeline returns an Effect, so you can compose it with other Effects:

```typescript
const program = pipe(
  trySources<YearBuilt>(cache, address, [getPropertyValueDotComYearBuilt]),
  Effect.flatMap((yearBuilt) => {
    if (yearBuilt === null) {
      return Effect.fail(new Error("Year built not found"));
    }
    return Effect.succeed(yearBuilt);
  }),
  Effect.tap((yearBuilt) => Effect.sync(() => console.log(`Year: ${yearBuilt}`)))
);

await Effect.runPromise(program);
```
