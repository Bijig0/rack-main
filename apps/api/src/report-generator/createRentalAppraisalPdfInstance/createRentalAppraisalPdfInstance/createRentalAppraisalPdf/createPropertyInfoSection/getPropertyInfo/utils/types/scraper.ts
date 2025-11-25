import { Effect } from "effect";
import * as E from "effect/Either";
import * as O from "effect/Option";
import { Browser, Page } from "playwright";
import { Address, CacheStore, HtmlDocumentSchema } from "../createReportCache";

type ScraperBaseReturn = {
  html: HtmlDocumentSchema;
};

type ScraperBaseArgs = {
  address: Address;
};

export type WithTestArgs = {
  page: Page;
  browser: Browser;
};

type ScraperArgs = ScraperBaseArgs;

// types.ts
type Scraper<TArgs = ScraperArgs, TResult = ScraperBaseReturn> = (
  args: TArgs
) => Promise<E.Either<TResult, Error>>;

type FetcherArgs = {
  cacheStore: CacheStore;
  address: Address;
};

export type Fetcher<TData> = ({
  cacheStore,
  address,
}: FetcherArgs) => Effect.Effect<O.Option<TData>, Error, never>;

export { Scraper, ScraperArgs, ScraperBaseArgs, ScraperBaseReturn };
