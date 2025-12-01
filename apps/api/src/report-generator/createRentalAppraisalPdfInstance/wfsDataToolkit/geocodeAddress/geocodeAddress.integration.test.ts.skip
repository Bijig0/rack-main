import { expect, test } from "bun:test";
import type { Address } from "../../../../shared/types";

// Import AFTER unmocking
// @ts-ignore
const { geocodeAddress } = await import("./geocodeAddress");

test("Real API: geocode Melbourne CBD address", async () => {
  const address: Address = {
    addressLine: "Flinders Street Station",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  const result = await geocodeAddress({ address });

  console.log("Melbourne result:", result);

  expect(result).toHaveProperty("lat");
  expect(result).toHaveProperty("lon");

  expect(Math.abs(result.lat - -37.818)).toBeLessThan(0.1);
  expect(Math.abs(result.lon - 144.967)).toBeLessThan(0.1);
}, 30000);

test("Real API: geocode Sydney Opera House", async () => {
  const address: Address = {
    addressLine: "Bennelong Point",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
  };

  const result = await geocodeAddress({ address });

  console.log("Sydney result:", result);

  expect(result).toHaveProperty("lat");
  expect(result).toHaveProperty("lon");

  expect(Math.abs(result.lat - -33.857)).toBeLessThan(0.1);
  expect(Math.abs(result.lon - 151.215)).toBeLessThan(0.1);
}, 30000);

test.todo(
  "Real API: geocode Brisbane address",
  async () => {
    const address: Address = {
      addressLine: "Queen Street Mall",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    };

    const result = await geocodeAddress({ address });

    console.log("Brisbane result:", result);

    expect(result).toHaveProperty("lat");
    expect(result).toHaveProperty("lon");

    expect(Math.abs(result.lat - -27.47)).toBeLessThan(0.1);
    expect(Math.abs(result.lon - 153.025)).toBeLessThan(0.1);
  },
  30000
);

test("Real API: throw error for invalid address", async () => {
  const address: Address = {
    addressLine: "Definitely Not A Real Address 99999",
    suburb: "Nonexistent Suburb",
    state: "VIC",
    postcode: "0000",
  };

  // Expect the function to throw an error
  await expect(geocodeAddress({ address })).rejects.toThrow("Geocode error");
}, 30000);

test("Real API: handle Perth address", async () => {
  const address: Address = {
    addressLine: "Kings Park",
    suburb: "Perth",
    state: "WA",
    postcode: "6005",
  };

  const result = await geocodeAddress({ address });

  console.log("Perth result:", result);

  expect(result).toHaveProperty("lat");
  expect(result).toHaveProperty("lon");

  expect(Math.abs(result.lat - -31.96)).toBeLessThan(0.1);
  expect(Math.abs(result.lon - 115.83)).toBeLessThan(0.1);
}, 30000);

test("Real API: caching test", async () => {
  const address: Address = {
    addressLine: "Federation Square",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  const result1 = await geocodeAddress({ address });
  const result2 = await geocodeAddress({ address });

  console.log("Cache test results:", result1, result2);

  expect(result1).toHaveProperty("lat");
  expect(result2).toHaveProperty("lat");

  // Results should be identical (testing cache consistency)
  expect(result1).toEqual(result2);
}, 15000);
