import { fallbackScraperRegistry } from "./FallbackScraperRegistry";
import { DomainComScraper, MicroBurbsComScraper, PropertyComScraper } from "./adapters";

/**
 * Initialize and register all fallback scrapers
 *
 * Scrapers are registered in priority order:
 * 1. Domain.com - Fast, good property-specific data
 * 2. MicroBurbs.com - Good for suburb-level insights, schools
 * 3. Property.com - Comprehensive but requires propertyId
 *
 * Call this once at application startup or before using PropertyHubService
 */
export function initializeFallbackScrapers(options?: {
  /**
   * Property ID for Property.com scraper
   * If not provided, Property.com scraper will be skipped
   */
  propertyId?: string;
}): void {
  const { propertyId } = options || {};

  // Register Domain.com scraper (priority 1)
  fallbackScraperRegistry.register(new DomainComScraper());

  // Register MicroBurbs.com scraper (priority 2)
  fallbackScraperRegistry.register(new MicroBurbsComScraper());

  // Register Property.com scraper (priority 3)
  // Only if propertyId is provided
  if (propertyId) {
    fallbackScraperRegistry.register(new PropertyComScraper(propertyId));
  } else {
    console.log("ℹ️  Property.com scraper not registered (no propertyId provided)");
  }

  console.log(`\n✅ Initialized ${fallbackScraperRegistry.getScrapers().length} fallback scrapers\n`);
}
