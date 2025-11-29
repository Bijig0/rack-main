import { expect, test, describe, beforeEach } from "bun:test";
import * as E from "effect/Either";
import { fetchNew } from "./fetchNew";
import type { Address, CacheEntry, CacheStore } from "../types";
import type { Scraper } from "../../types";

describe("fetchNew", () => {
  let mockCacheStore: CacheStore;
  let cacheData: Map<string, CacheEntry>;
  let mockScraper: Scraper;

  const testAddress: Address = {
    addressLine: "123 Test Street",
    suburb: "Testville",
    state: "VIC",
    postcode: "3000",
  };

  const mockHtmlData = "<html><body>Test Property Data</body></html>";

  beforeEach(() => {
    // Reset cache data
    cacheData = new Map();

    // Create mock cache store
    mockCacheStore = {
      get: async (key: string) => cacheData.get(key),
      set: async (key: string, entry: CacheEntry) => {
        cacheData.set(key, entry);
      },
      has: async (key: string) => cacheData.has(key),
      delete: async (key: string) => {
        cacheData.delete(key);
      },
      clear: async () => {
        cacheData.clear();
      },
      clearExpired: async () => 0,
    };

    // Create mock scraper that returns successful result
    mockScraper = async () => {
      return E.right({ html: mockHtmlData });
    };
  });

  test("should fetch new data and cache it when scraper succeeds", async () => {
    const result = await fetchNew(
      mockCacheStore,
      testAddress,
      "domain.com",
      mockScraper
    );

    // Check that result is Right with correct data
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.html).toBe(mockHtmlData);
    }

    // Check that cache was populated
    const cacheKey = "123 Test Street Testville VIC 3000::domain.com";
    const cachedEntry = await mockCacheStore.get(cacheKey);

    expect(cachedEntry).toBeDefined();
    expect(cachedEntry?.data).toBe(mockHtmlData);
    expect(cachedEntry?.source).toBe("domain.com");
    expect(cachedEntry?.address).toBe("123 Test Street Testville VIC 3000");
    expect(cachedEntry?.timestamp).toBeGreaterThan(Date.now() - 1000);
  });

  test("should return Left when scraper fails", async () => {
    const errorMessage = "Scraping failed";
    const failingScraper: Scraper = async () => {
      return E.left(new Error(errorMessage));
    };

    const result = await fetchNew(
      mockCacheStore,
      testAddress,
      "realestate.com",
      failingScraper
    );

    // Check that result is Left with error
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.message).toBe(errorMessage);
    }

    // Check that cache was NOT populated
    const cacheKey = "123 Test Street Testville VIC 3000::realestate.com";
    const cachedEntry = await mockCacheStore.get(cacheKey);
    expect(cachedEntry).toBeUndefined();
  });

  test("should cache data for different sources separately", async () => {
    const domainHtml = "<html>Domain data</html>";
    const realEstateHtml = "<html>RealEstate data</html>";

    const domainScraper: Scraper = async () => E.right({ html: domainHtml });
    const realEstateScraper: Scraper = async () =>
      E.right({ html: realEstateHtml });

    // Fetch from domain.com
    await fetchNew(mockCacheStore, testAddress, "domain.com", domainScraper);

    // Fetch from realestate.com
    await fetchNew(
      mockCacheStore,
      testAddress,
      "realestate.com",
      realEstateScraper
    );

    // Check both are cached separately
    const domainKey = "123 Test Street Testville VIC 3000::domain.com";
    const realEstateKey = "123 Test Street Testville VIC 3000::realestate.com";

    const domainEntry = await mockCacheStore.get(domainKey);
    const realEstateEntry = await mockCacheStore.get(realEstateKey);

    expect(domainEntry?.data).toBe(domainHtml);
    expect(realEstateEntry?.data).toBe(realEstateHtml);
  });

  test("should cache data for different addresses separately", async () => {
    const address1: Address = {
      addressLine: "123 First Street",
      suburb: "Suburb1",
      state: "VIC",
      postcode: "3000",
    };

    const address2: Address = {
      addressLine: "456 Second Avenue",
      suburb: "Suburb2",
      state: "NSW",
      postcode: "2000",
    };

    const html1 = "<html>Property 1</html>";
    const html2 = "<html>Property 2</html>";

    const scraper1: Scraper = async () => E.right({ html: html1 });
    const scraper2: Scraper = async () => E.right({ html: html2 });

    // Fetch for address1
    await fetchNew(mockCacheStore, address1, "domain.com", scraper1);

    // Fetch for address2
    await fetchNew(mockCacheStore, address2, "domain.com", scraper2);

    // Check both are cached with different keys
    const key1 = "123 First Street Suburb1 VIC 3000::domain.com";
    const key2 = "456 Second Avenue Suburb2 NSW 2000::domain.com";

    const entry1 = await mockCacheStore.get(key1);
    const entry2 = await mockCacheStore.get(key2);

    expect(entry1?.data).toBe(html1);
    expect(entry2?.data).toBe(html2);
  });

  test("should overwrite existing cache entry when fetching again", async () => {
    const oldHtml = "<html>Old data</html>";
    const newHtml = "<html>New data</html>";

    // First fetch
    const oldScraper: Scraper = async () => E.right({ html: oldHtml });
    await fetchNew(mockCacheStore, testAddress, "domain.com", oldScraper);

    // Wait a bit to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Second fetch with new data
    const newScraper: Scraper = async () => E.right({ html: newHtml });
    await fetchNew(mockCacheStore, testAddress, "domain.com", newScraper);

    // Check that cache has new data
    const cacheKey = "123 Test Street Testville VIC 3000::domain.com";
    const cachedEntry = await mockCacheStore.get(cacheKey);

    expect(cachedEntry?.data).toBe(newHtml);
  });

  test("should store correct timestamp in cache entry", async () => {
    const beforeFetch = Date.now();

    await fetchNew(mockCacheStore, testAddress, "domain.com", mockScraper);

    const afterFetch = Date.now();

    const cacheKey = "123 Test Street Testville VIC 3000::domain.com";
    const cachedEntry = await mockCacheStore.get(cacheKey);

    expect(cachedEntry?.timestamp).toBeGreaterThanOrEqual(beforeFetch);
    expect(cachedEntry?.timestamp).toBeLessThanOrEqual(afterFetch);
  });

  test("should normalize address in cache entry", async () => {
    const addressWithMixedCase: Address = {
      addressLine: "123 TeSt StReEt",
      suburb: "TeStViLLe",
      state: "VIC",
      postcode: "3000",
    };

    await fetchNew(
      mockCacheStore,
      addressWithMixedCase,
      "domain.com",
      mockScraper
    );

    const cacheKey = "123 Test Street Testville VIC 3000::domain.com";
    const cachedEntry = await mockCacheStore.get(cacheKey);

    expect(cachedEntry?.address).toBe("123 Test Street Testville VIC 3000");
  });
});
