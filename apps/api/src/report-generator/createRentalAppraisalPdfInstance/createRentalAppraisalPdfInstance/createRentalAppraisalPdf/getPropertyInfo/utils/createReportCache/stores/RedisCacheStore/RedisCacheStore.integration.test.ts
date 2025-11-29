import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { RedisCacheStore } from "./RedisCacheStore";
import { normalizeAddressObjToString } from "../../utils/normalizeAddressObjToString/normalizeAddressObjToString";
import { createCacheKey } from "../../utils/createCacheKey/createCacheKey";
import type { Address } from "../../types";

describe("RedisCacheStore Integration Tests", () => {
  let cache: RedisCacheStore;

  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  const testAddress2: Address = {
    addressLine: "123 Main St",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  beforeAll(async () => {
    // Create Redis cache store (uses REDIS_HOST env var from docker-compose)
    cache = new RedisCacheStore(undefined, { keyPrefix: "test-cache:" });
    // Clear any existing test data
    await cache.clear();
  });

  afterAll(async () => {
    // Clean up and close connection
    await cache.clear();
    await cache.disconnect();
  });

  test("should connect to Redis", async () => {
    // If we can clear without error, we're connected
    await cache.clear();
    expect(true).toBe(true); // If we got here, connection worked
  });

  test("should store and retrieve data", async () => {
    const key = createCacheKey(testAddress, "domain.com");
    const htmlData = "<div>Test HTML from Redis</div>";

    const entry = {
      data: htmlData,
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "domain.com" as const,
    };

    await cache.set(key, entry);
    const retrieved = await cache.get(key);

    expect(retrieved).toBeDefined();
    expect(retrieved?.data).toBe(htmlData);
    expect(retrieved?.source).toBe("domain.com");
  });

  test("should return undefined for non-existent key", async () => {
    const nonExistentKey = "non-existent-key-12345";
    const result = await cache.get(nonExistentKey);
    expect(result).toBeUndefined();
  });

  test("should check if key exists", async () => {
    const key = createCacheKey(testAddress2, "corelogic");
    const htmlData = "<div>CoreLogic Test</div>";

    expect(await cache.has(key)).toBe(false);

    const entry = {
      data: htmlData,
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress2),
      source: "corelogic" as const,
    };

    await cache.set(key, entry);
    expect(await cache.has(key)).toBe(true);
  });

  test("should delete specific entry", async () => {
    const key = createCacheKey(testAddress, "microburbs.com");
    const entry = {
      data: "<div>Delete me</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "microburbs.com" as const,
    };

    await cache.set(key, entry);
    expect(await cache.has(key)).toBe(true);

    await cache.delete(key);
    expect(await cache.has(key)).toBe(false);
  });

  test("should clear all entries", async () => {
    const key1 = createCacheKey(testAddress, "domain.com");
    const key2 = createCacheKey(testAddress2, "corelogic");

    const entry1 = {
      data: "<div>Entry 1</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "domain.com" as const,
    };

    const entry2 = {
      data: "<div>Entry 2</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress2),
      source: "corelogic" as const,
    };

    await cache.set(key1, entry1);
    await cache.set(key2, entry2);

    await cache.clear();

    expect(await cache.has(key1)).toBe(false);
    expect(await cache.has(key2)).toBe(false);
  });

  test("should isolate entries by key prefix", async () => {
    // Create a second cache with different prefix
    const cache2 = new RedisCacheStore(undefined, {
      keyPrefix: "another-cache:",
    });

    const key = "shared-key";
    const entry1 = {
      data: "<div>Cache 1</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "domain.com" as const,
    };

    const entry2 = {
      data: "<div>Cache 2</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "domain.com" as const,
    };

    await cache.set(key, entry1);
    await cache2.set(key, entry2);

    const retrieved1 = await cache.get(key);
    const retrieved2 = await cache2.get(key);

    expect(retrieved1?.data).toBe("<div>Cache 1</div>");
    expect(retrieved2?.data).toBe("<div>Cache 2</div>");

    // Clean up
    await cache2.clear();
    await cache2.disconnect();
  });

  test("should persist data across reconnections", async () => {
    const key = createCacheKey(testAddress, "property.com");
    const entry = {
      data: "<div>Persistent data</div>",
      timestamp: Date.now(),
      address: normalizeAddressObjToString(testAddress),
      source: "property.com" as const,
    };

    await cache.set(key, entry);

    // Create new cache instance (simulating reconnection)
    const newCache = new RedisCacheStore(undefined, { keyPrefix: "test-cache:" });

    const retrieved = await newCache.get(key);
    expect(retrieved?.data).toBe("<div>Persistent data</div>");

    // Clean up
    await newCache.disconnect();
  });
});
