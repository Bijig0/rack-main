import { describe, it, expect } from "bun:test";
import { getWaterData } from "./getWaterData";
import type { Address } from "../../../../../../shared/types";

describe("getWaterData integration tests", () => {
  // Note: These tests make real API calls and require network connectivity
  // They may be slow and could fail if the external services are down

  describe("Yarra Valley Water service area", () => {
    it("should get water data for Kew address", async () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("Yarra Valley Water");
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
      expect(result.waterData.recommendations.length).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for network request

    it("should get water data for Richmond address", async () => {
      const address: Address = {
        addressLine: "100 Bridge Road",
        suburb: "Richmond",
        state: "VIC",
        postcode: "3121",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("Yarra Valley Water");
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
    }, 30000);

    it("should get water data for Melbourne CBD address", async () => {
      const address: Address = {
        addressLine: "1 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("Yarra Valley Water");
      expect(result.waterData.description).toBeTruthy();
    }, 30000);
  });

  describe("South East Water service area", () => {
    it("should get water data for Frankston address", async () => {
      const address: Address = {
        addressLine: "100 Beach Street",
        suburb: "Frankston",
        state: "VIC",
        postcode: "3199",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("South East Water");
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
    }, 30000);
  });

  describe("City West Water service area", () => {
    it("should get water data for Footscray address", async () => {
      const address: Address = {
        addressLine: "50 Barkly Street",
        suburb: "Footscray",
        state: "VIC",
        postcode: "3011",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("City West Water");
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
    }, 30000);
  });

  describe("Regional areas", () => {
    it("should handle regional Victorian address", async () => {
      const address: Address = {
        addressLine: "123 Main Street",
        suburb: "Geelong",
        state: "VIC",
        postcode: "3220",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe(
        "Regional Water Authority"
      );
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
    }, 30000);
  });

  describe("data structure validation", () => {
    it("should return properly structured water data", async () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      // Validate structure
      expect(result).toHaveProperty("waterData");
      expect(result.waterData).toHaveProperty("hasWaterConnection");
      expect(result.waterData).toHaveProperty("waterServiceProvider");
      expect(result.waterData).toHaveProperty("description");
      expect(result.waterData).toHaveProperty("recommendations");

      // Validate types
      expect(typeof result.waterData.hasWaterConnection).toBe("boolean");
      expect(typeof result.waterData.waterServiceProvider).toBe("string");
      expect(typeof result.waterData.description).toBe("string");
      expect(Array.isArray(result.waterData.recommendations)).toBe(true);

      // Validate optional fields
      if (result.waterData.nearestWaterMain) {
        expect(result.waterData.nearestWaterMain).toHaveProperty("distance");
        expect(typeof result.waterData.nearestWaterMain.distance).toBe(
          "number"
        );
      }

      if (result.waterData.nearestHydrant) {
        expect(result.waterData.nearestHydrant).toHaveProperty("distance");
        expect(typeof result.waterData.nearestHydrant.distance).toBe("number");
      }
    }, 30000);
  });

  describe("buffer parameter", () => {
    it("should respect custom buffer parameter", async () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address, bufferMeters: 1000 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.waterServiceProvider).toBe("Yarra Valley Water");
    }, 30000);

    it("should use default buffer when not specified", async () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address });

      expect(result.waterData).toBeDefined();
    }, 30000);
  });

  describe("edge cases", () => {
    it("should handle API failures gracefully", async () => {
      // Note: YVW API may be blocked or restricted, so we expect graceful fallback
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address, bufferMeters: 50 });

      expect(result.waterData).toBeDefined();
      expect(result.waterData.description).toBeTruthy();
      expect(result.waterData.recommendations).toBeArray();
      // Should gracefully handle API restrictions
      expect(result.waterData.waterServiceProvider).toBe("Yarra Valley Water");
      // Even if API fails, should provide recommendations
      expect(result.waterData.recommendations.length).toBeGreaterThan(0);
    }, 30000);
  });

  describe("recommendations validation", () => {
    it("should provide relevant recommendations", async () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = await getWaterData({ address, bufferMeters: 500 });

      // Should have at least some recommendations
      expect(result.waterData.recommendations.length).toBeGreaterThan(0);

      // Each recommendation should be a non-empty string
      result.waterData.recommendations.forEach((rec) => {
        expect(typeof rec).toBe("string");
        expect(rec.length).toBeGreaterThan(0);
      });
    }, 30000);
  });
});
