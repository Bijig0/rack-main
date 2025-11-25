/**
 * Fallback Scraper System
 *
 * Provides a waterfall strategy for filling missing property data fields:
 * 1. PropertyHub (primary)
 * 2. Domain.com (fallback 1)
 * 3. MicroBurbs.com (fallback 2)
 * 4. Property.com (fallback 3)
 *
 * Usage:
 * ```ts
 * import { initializeFallbackScrapers } from './services/propertyHub/fallback';
 *
 * // Initialize once at app startup
 * initializeFallbackScrapers({ propertyId: '12345' });
 *
 * // Then use PropertyHubService normally - fallbacks are automatic
 * const data = await PropertyHubService.getPropertyData(address);
 * ```
 */

export { fallbackScraperRegistry, FallbackScraperRegistry } from "./FallbackScraperRegistry";
export { initializeFallbackScrapers } from "./initializeFallbackScrapers";
export type { PropertyScraper, FallbackOptions } from "./types";
export * from "./adapters";
