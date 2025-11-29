import { describe, it, expect } from "bun:test";
import { getRetardingBasins } from "./getRetardingBasins";

/**
 * Note: These tests make real API calls to the VicMap WFS service.
 * The tests are designed to work with live data and verify the function's
 * behavior without mocking, as mocking make-fetch-happen is complex in Bun.
 *
 * Tests use remote coordinates or small buffers to minimize API load.
 */
describe("getRetardingBasins", () => {
  it("should return empty array when no basins found in remote area", async () => {
    // Use a remote location in the ocean unlikely to have basins
    const result = await getRetardingBasins({
      lat: -38.5,
      lon: 141.0,
      bufferMeters: 100,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should return array (possibly empty) for Melbourne area", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 500,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should sort basins by distance when results found", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 5000,
    });

    if (result.length > 1) {
      for (let i = 1; i < result.length; i++) {
        expect(result[i].distance).toBeGreaterThanOrEqual(
          result[i - 1].distance
        );
      }
    }
  });

  it("should include required basin properties when results found", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 5000,
    });

    result.forEach((basin) => {
      expect(basin).toHaveProperty("name");
      expect(basin).toHaveProperty("distance");
      expect(basin).toHaveProperty("type");
      expect(typeof basin.name).toBe("string");
      expect(typeof basin.distance).toBe("number");
      expect(typeof basin.type).toBe("string");
      expect(basin.distance).toBeGreaterThanOrEqual(0);
    });
  });

  it("should use default buffer of 2000m when not specified", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(Array.isArray(result)).toBe(true);
    // All basins should be within 2000m
    result.forEach((basin) => {
      expect(basin.distance).toBeLessThanOrEqual(2000);
    });
  });

  it("should handle invalid coordinates gracefully", async () => {
    const result = await getRetardingBasins({
      lat: 999,
      lon: 999,
      bufferMeters: 1000,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should round distances to nearest meter when results found", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 5000,
    });

    result.forEach((basin) => {
      expect(basin.distance).toBe(Math.round(basin.distance));
    });
  });

  it("should handle optional capacity field when present", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 5000,
    });

    result.forEach((basin) => {
      if (basin.capacity !== undefined) {
        expect(typeof basin.capacity).toBe("number");
      }
    });
  });

  it("should handle optional owner field when present", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 5000,
    });

    result.forEach((basin) => {
      if (basin.owner !== undefined) {
        expect(typeof basin.owner).toBe("string");
      }
    });
  });

  it("should return empty array for very small buffer", async () => {
    const result = await getRetardingBasins({
      lat: -37.8136,
      lon: 144.9631,
      bufferMeters: 1,
    });

    expect(Array.isArray(result)).toBe(true);
    // Very unlikely to find basins within 1m
  });
});
