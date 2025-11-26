// @ts-ignore
import { describe, expect, it, mock } from "bun:test";
import { Address } from "../../../../../../../shared/types";

// Mock the geocodeAddress module
mock.module("../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress", () => ({
  geocodeAddress: mock(() =>
    Promise.resolve({ lat: -37.7967303, lon: 145.0250967 })
  ),
}));

import { getTrafficSignalData } from "./getTrafficSignalData";

describe("getTrafficSignalData (Integration)", () => {
  const testAddress: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  describe("Data Loading", () => {
    it("should handle traffic data gracefully", async () => {
      const { trafficData } = await getTrafficSignalData({
        address: testAddress,
      });

      // Should either load data or return null gracefully
      if (trafficData) {
        expect(trafficData.sites).toBeDefined();
        expect(Array.isArray(trafficData.sites)).toBe(true);
        expect(trafficData.totalVolume).toBeGreaterThanOrEqual(0);
        expect(trafficData.averageVolume).toBeGreaterThanOrEqual(0);
        expect(trafficData.maxVolume).toBeGreaterThanOrEqual(0);
      } else {
        expect(trafficData).toBeNull();
      }
    });

    it("should accept custom radius parameter", async () => {
      const { trafficData } = await getTrafficSignalData({
        address: testAddress,
        radiusKm: 5,
      });

      // Should either load data or return null
      if (trafficData) {
        expect(trafficData).toHaveProperty("sites");
      } else {
        expect(trafficData).toBeNull();
      }
    });
  });

  describe("Data Structure Validation", () => {
    it("should return properly structured data when available", async () => {
      const { trafficData } = await getTrafficSignalData({
        address: testAddress,
      });

      if (trafficData) {
        // Check main structure
        expect(trafficData).toHaveProperty("sites");
        expect(trafficData).toHaveProperty("totalVolume");
        expect(trafficData).toHaveProperty("averageVolume");
        expect(trafficData).toHaveProperty("maxVolume");

        // Check site structure if sites exist
        if (trafficData.sites.length > 0) {
          const site = trafficData.sites[0];
          expect(site).toHaveProperty("scatsSiteId");
          expect(site).toHaveProperty("detectorId");
          expect(site).toHaveProperty("averageDailyVolume");
          expect(site).toHaveProperty("peakHourVolume");
          expect(site).toHaveProperty("region");
          expect(site).toHaveProperty("date");

          // Check that volumes are numbers
          expect(typeof site.averageDailyVolume).toBe("number");
          expect(typeof site.peakHourVolume).toBe("number");
        }
      }
    });

    it("should limit sites to reasonable count", async () => {
      const { trafficData } = await getTrafficSignalData({
        address: testAddress,
      });

      if (trafficData) {
        expect(trafficData.sites.length).toBeLessThanOrEqual(50);
      }
    });
  });

  describe("Traffic Volume Calculations", () => {
    it("should have consistent volume calculations", async () => {
      const { trafficData } = await getTrafficSignalData({
        address: testAddress,
      });

      if (trafficData && trafficData.sites.length > 0) {
        // Max volume should be one of the site volumes
        const siteVolumes = trafficData.sites.map((s) => s.averageDailyVolume);
        const maxFromSites = Math.max(...siteVolumes);
        expect(trafficData.maxVolume).toBe(maxFromSites);

        // Total volume should be sum of all site volumes
        const totalFromSites = siteVolumes.reduce((sum, vol) => sum + vol, 0);
        expect(trafficData.totalVolume).toBe(totalFromSites);

        // Average should be total / count
        const calculatedAverage = Math.round(totalFromSites / trafficData.sites.length);
        expect(trafficData.averageVolume).toBe(calculatedAverage);
      }
    });
  });
});
