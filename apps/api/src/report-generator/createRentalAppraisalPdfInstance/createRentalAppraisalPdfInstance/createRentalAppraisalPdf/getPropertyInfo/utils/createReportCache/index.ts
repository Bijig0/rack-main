// Export types
export type {
  Address,
  CacheEntry,
  CacheStore,
  HtmlDocumentSchema,
  PropertyInfoSourcesSchema,
  ReportCache,
} from "./types";

// Export cache store implementations
export { InMemoryCacheStore } from "./stores/InMemoryCacheStore/InMemoryCacheStore";
export { RedisCacheStore } from "./stores/RedisCacheStore/RedisCacheStore";

// Export utility functions
export { createCacheKey } from "./utils/createCacheKey/createCacheKey";
export { DEFAULT_TTL_MS, isExpired } from "./utils/isExpired/isExpired";
export { normalizeAddressObjToString as normalizeAddress } from "./utils/normalizeAddressObjToString/normalizeAddressObjToString";

// Export main functions
export { clear, clearExpired } from "./clear/clear";
export {
  cleanExpiredEntries,
  createReportCache,
  getReportCache,
  resetGlobalCache,
} from "./createReportCache/createReportCache";
export { fetchNew } from "./fetchNew/fetchNew";
export { fetchOrRetrieve } from "./fetchOrRetrieve/fetchOrRetrieve";
export { has } from "./has/has";
export { retrieve } from "./retrieve/retrieve";
export { set } from "./set/set";
