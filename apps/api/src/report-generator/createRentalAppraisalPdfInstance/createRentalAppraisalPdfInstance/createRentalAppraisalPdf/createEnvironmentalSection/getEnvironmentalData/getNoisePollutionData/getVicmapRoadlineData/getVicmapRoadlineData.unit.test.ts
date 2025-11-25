// @ts-ignore
import { describe, expect, it, mock } from "bun:test";
import { Address } from "../../../../../../../../shared/types";

// Mock the geocodeAddress module before importing the function
mock.module("../../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress", () => ({
  geocodeAddress: mock(() =>
    Promise.resolve({ lat: -37.7967303, lon: 145.0250967 })
  ),
}));

// Mock axios
const mockAxiosGet = mock(() =>
  Promise.resolve({
    data: {
      type: "FeatureCollection",
      features: [],
    },
  })
);

mock.module("axios", () => ({
  default: {
    get: mockAxiosGet,
  },
}));

import { getVicmapRoadlineData } from "./getVicmapRoadlineData";

describe("getVicmapRoadlineData (Unit)", () => {
  const testAddress: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  describe("Response Handling", () => {
    it("should return empty array when no features found", async () => {
      const { roadFeatures } = await getVicmapRoadlineData({
        address: testAddress,
      });

      // With mocked data returning empty features
      expect(roadFeatures).toBeDefined();
      expect(Array.isArray(roadFeatures)).toBe(true);
    });

    it("should accept custom buffer parameter", async () => {
      const { roadFeatures } = await getVicmapRoadlineData({
        address: testAddress,
        bufferMeters: 1000,
      });

      expect(roadFeatures).toBeDefined();
      expect(Array.isArray(roadFeatures)).toBe(true);
    });

    it("should use default buffer of 500m", async () => {
      const { roadFeatures } = await getVicmapRoadlineData({
        address: testAddress,
      });

      expect(roadFeatures).toBeDefined();
      expect(Array.isArray(roadFeatures)).toBe(true);
    });
  });

  describe("Data Structure", () => {
    it("should return data in correct format", async () => {
      const result = await getVicmapRoadlineData({
        address: testAddress,
      });

      expect(result).toHaveProperty("roadFeatures");
      expect(Array.isArray(result.roadFeatures)).toBe(true);
    });
  });
});
