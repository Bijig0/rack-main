import { PropertyInfo, PropertyInfoSchema } from "./propertyInfoSchema";
import { Scraper, ScraperArgs, ScraperBaseReturn } from "./scraper";

export { PropertyInfoSchema };
export type { PropertyInfo, Scraper, ScraperArgs, ScraperBaseReturn };

/**
 * Function type for fetching year built from a specific source
 *
 * @param cacheStore - The cache store instance
 * @param address - The property address
 * @returns Effect that resolves to YearBuilt or Error
 *
 * @example
 * const fetcher: YearBuiltFetcher = (cache, address) =>
 *   getPropertyValueDotComYearBuilt(cache, address);
 */
