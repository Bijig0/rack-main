import { PropertyMetadata } from "../cache/schemas";

/**
 * Interface that all property scrapers must implement
 */
export interface PropertyScraper {
  /**
   * Name of the scraper (for logging)
   */
  name: string;

  /**
   * Scrape property data from this source
   * @param address - Formatted address string
   * @returns Partial property data (only fields this scraper can provide)
   */
  scrape(address: string): Promise<Partial<PropertyMetadata>>;

  /**
   * Which fields this scraper can provide
   * Used to determine if fallback is needed
   */
  supportedFields: Array<keyof PropertyMetadata>;
}

/**
 * Options for fallback scraping
 */
export interface FallbackOptions {
  /**
   * Enable fallback scrapers
   * @default true
   */
  enableFallbacks?: boolean;

  /**
   * Maximum number of fallback attempts
   * @default 3 (all fallbacks)
   */
  maxFallbacks?: number;

  /**
   * Only use fallbacks for specific missing fields
   * If undefined, uses fallbacks for any missing field
   */
  onlyFallbackForFields?: Array<keyof PropertyMetadata>;
}
