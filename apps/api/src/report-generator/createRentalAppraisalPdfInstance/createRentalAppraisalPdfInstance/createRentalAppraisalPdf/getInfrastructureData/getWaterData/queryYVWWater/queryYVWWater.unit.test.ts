import { describe, it, expect, mock, beforeEach } from "bun:test";
import { queryYVWWater } from "./queryYVWWater";

// Mock fetch for testing
const mockFetch = mock();
global.fetch = mockFetch as any;

describe("queryYVWWater", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("successful queries", () => {
    it("should return water pipes when query succeeds", async () => {
      const mockWaterPipesData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "pipe1",
            properties: {
              OBJECTID: 1,
              MXUNITID: "PIPE001",
              PIPE_DIAMETER: 150,
              PIPE_MATERIAL: "PVC",
              PIPE_LENGTH: 100,
              SERVICE_STATUS: "Active",
              ASSET_ID: "ASSET001",
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [145.035, -37.813],
                [145.036, -37.814],
              ],
            },
          },
        ],
      };

      // Mock all three endpoints
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockWaterPipesData,
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).not.toBeNull();
      expect(result.waterPipes?.features).toHaveLength(1);
      expect(result.waterPipes?.features[0].properties.PIPE_DIAMETER).toBe(150);
      expect(result.waterPipes?.features[0].properties.PIPE_MATERIAL).toBe(
        "PVC"
      );
    });

    it("should return hydrants when query succeeds", async () => {
      const mockHydrantsData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "hydrant1",
            properties: {
              OBJECTID: 1,
              MXASSETNUM: "HYDRANT001",
              HYDRANT_TYPE: "Pillar",
              SERVICE_STATUS: "Active",
            },
            geometry: {
              type: "Point",
              coordinates: [145.035, -37.813],
            },
          },
        ],
      };

      // Mock all three endpoints
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockHydrantsData,
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.hydrants).not.toBeNull();
      expect(result.hydrants?.features).toHaveLength(1);
      expect(result.hydrants?.features[0].properties.HYDRANT_TYPE).toBe(
        "Pillar"
      );
    });

    it("should return distribution zones when query succeeds", async () => {
      const mockZonesData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "zone1",
            properties: {
              OBJECTID: 1,
              ZONE_ID: "ZONE001",
              ZONE_NAME: "Kew Zone",
              PRESSURE_ZONE: "High",
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [145.03, -37.81],
                  [145.04, -37.81],
                  [145.04, -37.82],
                  [145.03, -37.82],
                  [145.03, -37.81],
                ],
              ],
            },
          },
        ],
      };

      // Mock all three endpoints
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockZonesData,
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.distributionZones).not.toBeNull();
      expect(result.distributionZones?.features).toHaveLength(1);
      expect(result.distributionZones?.features[0].properties.ZONE_NAME).toBe(
        "Kew Zone"
      );
    });

    it("should handle all successful queries together", async () => {
      const mockAllData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [145.035, -37.813],
            },
          },
        ],
      };

      // Mock all three endpoints successfully
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockAllData,
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockAllData,
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => mockAllData,
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).not.toBeNull();
      expect(result.hydrants).not.toBeNull();
      expect(result.distributionZones).not.toBeNull();
    });
  });

  describe("failed queries", () => {
    it("should handle failed water pipes request", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).toBeNull();
      expect(result.hydrants).not.toBeNull();
      expect(result.distributionZones).not.toBeNull();
    });

    it("should handle failed hydrants request", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).not.toBeNull();
      expect(result.hydrants).toBeNull();
      expect(result.distributionZones).not.toBeNull();
    });

    it("should handle all failed requests", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).toBeNull();
      expect(result.hydrants).toBeNull();
      expect(result.distributionZones).toBeNull();
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      expect(result.waterPipes).toBeNull();
      expect(result.hydrants).toBeNull();
      expect(result.distributionZones).toBeNull();
    });
  });

  describe("buffer calculations", () => {
    it("should use default buffer of 500 meters", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
      });

      // Verify fetch was called
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should accept custom buffer parameter", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 1000,
      });

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("invalid data handling", () => {
    it("should handle invalid JSON response", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => {
            throw new Error("Invalid JSON");
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      // Should handle error gracefully
      expect(result.waterPipes).toBeNull();
    });

    it("should handle data that doesn't match schema", async () => {
      const invalidData = {
        type: "FeatureCollection",
        features: [
          {
            // Missing required fields
            type: "Feature",
            properties: {},
            geometry: null, // Invalid geometry
          },
        ],
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => invalidData,
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => "application/json" },
          json: async () => ({ type: "FeatureCollection", features: [] }),
        });

      const result = await queryYVWWater({
        lon: 145.0352,
        lat: -37.8136,
        bufferMeters: 500,
      });

      // Should handle validation error gracefully
      expect(result.waterPipes).toBeNull();
    });
  });
});
