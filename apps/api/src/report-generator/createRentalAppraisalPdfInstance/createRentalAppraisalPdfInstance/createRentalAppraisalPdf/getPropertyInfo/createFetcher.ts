import { Effect, identity, pipe } from "effect";
import * as O from "effect/Option";
import z from "zod";
import {
  PropertyInfoSourcesSchema,
  fetchOrRetrieve,
} from "./utils/createReportCache";
import { parseFromHtml } from "./utils/parseFromHtml";
import { ParseOptions } from "./utils/parseFromHtml/parseFromHtml";
import { Scraper } from "./utils/types";
import { Fetcher } from "./utils/types/scraper";

type FetcherArgs<T extends z.ZodRawShape> = {
  source: PropertyInfoSourcesSchema;
  scraper: Scraper;
  schema: z.ZodObject<T>;
  options: ParseOptions<T>;
};

//**
// Generic fetcher function creator

export const createFetcher = <T extends z.ZodRawShape>({
  source,
  scraper,
  schema,
  options,
}: FetcherArgs<T>): Fetcher<z.infer<z.ZodObject<T>>> => {
  return ({ cacheStore, address }) => {
    const result = pipe(
      Effect.promise(() =>
        fetchOrRetrieve({
          cacheStore,
          address,
          source,
          scraper,
        })
      ),
      Effect.flatMap(identity),
      Effect.map(({ html }) => parseFromHtml(html, schema, options)),
      Effect.flatMap(identity),
      Effect.map(O.fromNullable)
    );

    return result;
  };
};
