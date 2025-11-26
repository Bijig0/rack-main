import z from "zod";
import { HtmlDocumentSchema } from "../types/htmlDocumentSchema/htmlDocumentSchema";

const propertyInfoSourcesSchema = z.enum([
  "domain.com",
  "realestate.com",
  "microburbs.com",
  "corelogic",
  "property.com",
]);

type PropertyInfoSourcesSchema = z.infer<typeof propertyInfoSourcesSchema>;

/**
 * Request-scoped HTML cache for property data scraping
 *
 * Each report generation creates a new instance of this cache.
 * The cache stores HTML from different sources (corelogic, domain.com, etc.)
 * to avoid re-scraping the same source multiple times within a single report.
 */
type ReportCache = Map<PropertyInfoSourcesSchema, HtmlDocumentSchema>;

/**
 * Create a new empty report cache
 */
const createReportCache = (): ReportCache => {
  return new Map<PropertyInfoSourcesSchema, HtmlDocumentSchema>();
};

/**
 * Retrieve HTML from cache
 * Returns undefined if not cached
 */
const retrieve = (
  cache: ReportCache,
  key: PropertyInfoSourcesSchema
): HtmlDocumentSchema | undefined => {
  const cached = cache.get(key);
  if (cached !== undefined) {
    console.log(`📦 Cache HIT: ${key}`);
  } else {
    console.log(`❌ Cache MISS: ${key}`);
  }
  return cached;
};

/**
 * Fetch new HTML and cache it
 */
const fetchNew = async (
  cache: ReportCache,
  key: PropertyInfoSourcesSchema,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  console.log(`🌐 Fetching NEW: ${key} - Running scraper...`);
  const value = await fetcher();
  cache.set(key, value);
  console.log(`✅ Cached: ${key}`);
  return value;
};

/**
 * Retrieve from cache OR fetch new if not cached
 * Combines retrieve() and fetchNew() in one call
 */
const fetchOrRetrieve = async (
  cache: ReportCache,
  key: PropertyInfoSourcesSchema,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  const cached = retrieve(cache, key);

  if (cached !== undefined) {
    return cached;
  }

  return fetchNew(cache, key, fetcher);
};

/**
 * Check if key is cached (without retrieving)
 */
const has = (cache: ReportCache, key: PropertyInfoSourcesSchema): boolean => {
  return cache.has(key);
};

/**
 * Manually set cache (useful for testing)
 */
const set = (
  cache: ReportCache,
  key: PropertyInfoSourcesSchema,
  value: HtmlDocumentSchema
): void => {
  cache.set(key, value);
};

/**
 * Clear all caches
 */
const clear = (cache: ReportCache): void => {
  cache.clear();
};

// Curried variants for domain.com
const fetchNewDomainCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchNew(cache, "domain.com", fetcher);
};

const fetchOrRetrieveDomainCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchOrRetrieve(cache, "domain.com", fetcher);
};

// Curried variants for realestate.com
const fetchNewRealestateCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchNew(cache, "realestate.com", fetcher);
};

const fetchOrRetrieveRealestateCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchOrRetrieve(cache, "realestate.com", fetcher);
};

// Curried variants for microburbs.com
const fetchNewMicroburbsCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchNew(cache, "microburbs.com", fetcher);
};

const fetchOrRetrieveMicroburbsCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchOrRetrieve(cache, "microburbs.com", fetcher);
};

// Curried variants for corelogic
const fetchNewCoreLogic = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchNew(cache, "corelogic", fetcher);
};

const fetchOrRetrieveCoreLogic = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchOrRetrieve(cache, "corelogic", fetcher);
};

// Curried variants for property.com
const fetchNewPropertyCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchNew(cache, "property.com", fetcher);
};

const fetchOrRetrievePropertyCom = (
  cache: ReportCache,
  fetcher: () => Promise<HtmlDocumentSchema>
): Promise<HtmlDocumentSchema> => {
  return fetchOrRetrieve(cache, "property.com", fetcher);
};

// Export types
export type { HtmlDocumentSchema, PropertyInfoSourcesSchema, ReportCache };

// Export functions
export {
  clear,
  createReportCache,
  fetchNew,
  fetchNewCoreLogic,
  // Curried variants
  fetchNewDomainCom,
  fetchNewMicroburbsCom,
  fetchNewPropertyCom,
  fetchNewRealestateCom,
  fetchOrRetrieve,
  fetchOrRetrieveCoreLogic,
  fetchOrRetrieveDomainCom,
  fetchOrRetrieveMicroburbsCom,
  fetchOrRetrievePropertyCom,
  fetchOrRetrieveRealestateCom,
  has,
  retrieve,
  set,
};
