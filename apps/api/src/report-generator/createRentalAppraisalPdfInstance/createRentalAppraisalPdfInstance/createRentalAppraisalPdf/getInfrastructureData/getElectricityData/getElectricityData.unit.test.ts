import axios from "axios";
import { beforeEach, afterEach, describe, expect, it, spyOn } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import * as geocodeModule from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { getElectricityData } from "./getElectricityData";

describe("getElectricityData", () => {
  const testAddress: Address = {
    addressLine: "123 Main Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  const mockGeocodeResponse = {
    lat: -37.8136,
    lon: 144.9631,
  };

  let geocodeSpy: ReturnType<typeof spyOn>;
  let axiosSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    geocodeSpy = spyOn(geocodeModule, "geocodeAddress").mockResolvedValue(
      mockGeocodeResponse
    );
  });

  afterEach(() => {
    geocodeSpy.mockRestore();
    if (axiosSpy) {
      axiosSpy.mockRestore();
    }
  });

  describe("Successful electricity data fetching", () => {
    it("should return electricity infrastructure data", async () => {
      const mockEnergyFacilitiesResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "electricity.1",
            geometry: {
              type: "Point",
              coordinates: [144.963, -37.813],
            },
            geometry_name: "shape",
            properties: {
              pfi: "123456",
              asset_id: "ELEC001",
              feature_type: "Substation",
              feature_sub_type: "Distribution",
              voltage: "22kV",
              capacity: "500kVA",
              owner: "AusNet Services",
              status: "Active",
              create_date: "2020-01-15T00:00:00Z",
            },
            bbox: [144.963, -37.813, 144.963, -37.813],
          },
        ],
        totalFeatures: 1,
        numberMatched: 1,
        numberReturned: 1,
        timeStamp: "2025-11-03T00:00:00.000Z",
      };

      const mockTransmissionLinesResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "transmission.1",
            geometry: {
              type: "LineString",
              coordinates: [
                [144.96, -37.81],
                [144.97, -37.82],
              ],
            },
            properties: {
              GmlID: "Electricity_Transmission_Lines.1",
              OBJECTID: 1,
              FEATURETYPE: "Transmission Line",
              DESCRIPTION: "High voltage transmission line",
              CLASS: "Overhead",
              TRANSMISSIONLINE_NAME: "Melbourne to Bendigo",
              OPERATIONALSTATUS: "Operational",
              STATE: "Victoria",
              CAPACITYKV: 220,
              LENGTH_M: 15000,
            },
          },
        ],
        totalFeatures: 1,
        numberMatched: 1,
        numberReturned: 1,
      };

      axiosSpy = spyOn(axios, "get");
      axiosSpy
        .mockResolvedValueOnce({ data: mockEnergyFacilitiesResponse } as any)
        .mockResolvedValueOnce({ data: mockTransmissionLinesResponse } as any);

      const result = await getElectricityData({ address: testAddress });

      expect(result.electricityInfrastructure).toBeDefined();
      expect(typeof result.electricityInfrastructure.isConnectedToGrid).toBe("boolean");
      expect(typeof result.electricityInfrastructure.impactLevel).toBe("string");
      expect(["none", "low", "moderate", "high"]).toContain(result.electricityInfrastructure.impactLevel);

      // Verify geocodeAddress was called
      expect(geocodeModule.geocodeAddress).toHaveBeenCalledWith({
        address: testAddress,
      });

      // Verify axios.get was called twice (once for each data source)
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it("should return default values when no infrastructure found", async () => {
      const mockEmptyResponse = {
        type: "FeatureCollection",
        features: [],
        totalFeatures: 0,
        numberMatched: 0,
        numberReturned: 0,
        timeStamp: "2025-11-03T00:00:00.000Z",
      };

      axiosSpy = spyOn(axios, "get");
      axiosSpy
        .mockResolvedValueOnce({ data: mockEmptyResponse } as any)
        .mockResolvedValueOnce({ data: mockEmptyResponse } as any);

      const result = await getElectricityData({ address: testAddress });

      expect(result.electricityInfrastructure).toBeDefined();
      expect(result.electricityInfrastructure.distanceToNearestTransmissionLine).toBeNull();
      expect(result.electricityInfrastructure.distanceToNearestFacility).toBeNull();
    });
  });

  describe("Error handling", () => {
    it("should throw error when geocoding fails", async () => {
      geocodeSpy.mockRestore();
      geocodeSpy = spyOn(geocodeModule, "geocodeAddress").mockRejectedValue(
        new Error("Geocoding failed")
      );

      await expect(
        getElectricityData({ address: testAddress })
      ).rejects.toThrow("Geocoding failed");
    });

    it("should throw error when WFS API call fails", async () => {
      axiosSpy = spyOn(axios, "get").mockRejectedValue(new Error("WFS API error"));

      await expect(
        getElectricityData({ address: testAddress })
      ).rejects.toThrow("WFS API error");
    });

    it("should throw error when response schema validation fails", async () => {
      const invalidResponse = {
        invalid: "data",
      };

      axiosSpy = spyOn(axios, "get").mockResolvedValue({ data: invalidResponse });

      await expect(
        getElectricityData({ address: testAddress })
      ).rejects.toThrow();
    });

    it("should handle network timeout errors", async () => {
      axiosSpy = spyOn(axios, "get").mockRejectedValue(new Error("Timeout"));

      await expect(
        getElectricityData({ address: testAddress })
      ).rejects.toThrow("Timeout");
    });
  });

  describe("WFS parameters", () => {
    it("should make WFS requests to both data sources", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        totalFeatures: 0,
        numberMatched: 0,
        numberReturned: 0,
        timeStamp: "2025-11-03T00:00:00.000Z",
      };

      axiosSpy = spyOn(axios, "get");
      axiosSpy
        .mockResolvedValueOnce({ data: mockResponse } as any)
        .mockResolvedValueOnce({ data: mockResponse } as any);

      await getElectricityData({ address: testAddress });

      // Verify two WFS calls were made (energy facilities + transmission lines)
      expect(axios.get).toHaveBeenCalledTimes(2);

      // Check the calls have WFS parameters
      const calls = (axios.get as any).mock.calls;

      expect(calls[0][1].params.SERVICE).toBe("WFS");
      expect(calls[0][1].params.VERSION).toBe("2.0.0");
      expect(calls[0][1].params.REQUEST).toBe("GetFeature");

      expect(calls[1][1].params.SERVICE).toBe("WFS");
      expect(calls[1][1].params.VERSION).toBe("2.0.0");
      expect(calls[1][1].params.REQUEST).toBe("GetFeature");
    });
  });
});
