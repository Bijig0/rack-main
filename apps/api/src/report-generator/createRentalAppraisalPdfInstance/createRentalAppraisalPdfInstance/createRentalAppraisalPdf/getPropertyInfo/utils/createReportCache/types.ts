import z from "zod";
import { HtmlDocumentSchema } from "../types/htmlDocumentSchema/htmlDocumentSchema";
import { Address } from "../../../../../../../../shared/types";

export const propertyInfoSourcesSchema = z.enum([
  "domain.com",
  "realestate.com",
  "microburbs.com",
  "corelogic",
  "property.com",
  'propertyvalue.com'
]);

export type PropertyInfoSourcesSchema = z.infer<typeof propertyInfoSourcesSchema>;

/**
 * Cache entry with metadata
 * Stores HTML data along with timestamp and property information
 */
export type CacheEntry = {
  /** The cached HTML document */
  data: HtmlDocumentSchema;
  /** Timestamp when this entry was cached (ms since epoch) */
  timestamp: number;
  /** Normalized address string for reference */
  address: string;
  /** The data source (website) */
  source: PropertyInfoSourcesSchema;
};

/**
 * Cache store interface
 * Abstraction layer that allows swapping between in-memory and Redis implementations
 */
export interface CacheStore {
  /** Get a cache entry by key */
  get(key: string): Promise<CacheEntry | undefined>;
  /** Set a cache entry */
  set(key: string, entry: CacheEntry): Promise<void>;
  /** Check if a key exists in cache */
  has(key: string): Promise<boolean>;
  /** Delete a specific cache entry */
  delete(key: string): Promise<void>;
  /** Clear all cache entries */
  clear(): Promise<void>;
  /** Clear expired entries and return count of cleared items */
  clearExpired(): Promise<number>;
}

/**
 * Property data cache with time-based expiration
 *
 * Each cache key is a combination of address + data source.
 * Entries expire after 24 hours by default.
 */
export type ReportCache = Map<string, CacheEntry>;

export type { HtmlDocumentSchema, Address };
