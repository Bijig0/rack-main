import { describe, it, expect } from "bun:test";
import { analyzeWaterAccess } from "./analyzeWaterAccess";

describe("analyzeWaterAccess", () => {
  const propertyLat = -37.8136;
  const propertyLon = 145.0352;

  describe("water main analysis", () => {
    it("should find nearest water main from LineString geometry", () => {
      const waterPipes = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 150,
              PIPE_MATERIAL: "PVC",
              UNITTYPE: "Water Main",
              SERVICE_STATUS: "Active",
              ASSET_ID: "PIPE001",
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.035, -37.813] as [number, number],
                [145.036, -37.814] as [number, number],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestWaterMain).toBeDefined();
      expect(result.nearestWaterMain?.diameter).toBe(150);
      expect(result.nearestWaterMain?.material).toBe("PVC");
      expect(result.nearestWaterMain?.type).toBe("Water Main");
      expect(result.nearestWaterMain?.distance).toBeGreaterThan(0);
    });

    it("should find nearest water main from MultiLineString geometry", () => {
      const waterPipes = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 200,
              PIPE_MATERIAL: "Cast Iron",
              UNITTYPE: "Distribution Main",
            },
            geometry: {
              type: "MultiLineString" as const,
              coordinates: [
                [
                  [145.03, -37.81] as [number, number],
                  [145.04, -37.82] as [number, number],
                ],
                [
                  [145.035, -37.813] as [number, number],
                  [145.036, -37.814] as [number, number],
                ],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestWaterMain).toBeDefined();
      expect(result.nearestWaterMain?.diameter).toBe(200);
      expect(result.nearestWaterMain?.material).toBe("Cast Iron");
    });

    it("should determine water connection based on 50m threshold", () => {
      const waterPipesClose = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 150,
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.0352, -37.8136] as [number, number], // Very close to property
                [145.0353, -37.8137] as [number, number],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: waterPipesClose,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.hasWaterConnection).toBe(true);
      expect(result.nearestWaterMain?.distance).toBeLessThanOrEqual(50);
    });

    it("should not have water connection if pipe is far away", () => {
      const waterPipesFar = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 150,
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.05, -37.82] as [number, number], // Far from property
                [145.06, -37.83] as [number, number],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: waterPipesFar,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.hasWaterConnection).toBe(false);
      expect(result.nearestWaterMain?.distance).toBeGreaterThan(50);
    });

    it("should handle multiple water mains and find closest", () => {
      const waterPipes = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 100,
              ASSET_ID: "FAR_PIPE",
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.05, -37.82] as [number, number],
                [145.06, -37.83] as [number, number],
              ],
            },
          },
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 150,
              ASSET_ID: "CLOSE_PIPE",
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.0352, -37.8136] as [number, number],
                [145.0353, -37.8137] as [number, number],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestWaterMain?.assetId).toBe("CLOSE_PIPE");
      expect(result.nearestWaterMain?.diameter).toBe(150);
    });

    it("should handle null water pipes", () => {
      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestWaterMain).toBeUndefined();
      expect(result.hasWaterConnection).toBe(false);
    });

    it("should handle empty water pipes collection", () => {
      const waterPipes = {
        type: "FeatureCollection" as const,
        features: [],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestWaterMain).toBeUndefined();
      expect(result.hasWaterConnection).toBe(false);
    });
  });

  describe("hydrant analysis", () => {
    it("should find nearest hydrant from Point geometry", () => {
      const hydrants = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              MXASSETNUM: "HYDRANT001",
              HYDRANT_TYPE: "Pillar",
              SERVICE_STATUS: "Active",
            },
            geometry: {
              type: "Point" as const,
              coordinates: [145.0355, -37.8138] as [number, number],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants,
        distributionZones: null,
      });

      expect(result.nearestHydrant).toBeDefined();
      expect(result.nearestHydrant?.type).toBe("Pillar");
      expect(result.nearestHydrant?.serviceStatus).toBe("Active");
      expect(result.nearestHydrant?.distance).toBeGreaterThan(0);
      expect(result.nearestHydrant?.coordinates).toBeDefined();
    });

    it("should handle multiple hydrants and find closest", () => {
      const hydrants = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              MXASSETNUM: "FAR_HYDRANT",
              HYDRANT_TYPE: "Pillar",
            },
            geometry: {
              type: "Point" as const,
              coordinates: [145.05, -37.82] as [number, number],
            },
          },
          {
            type: "Feature" as const,
            properties: {
              MXASSETNUM: "CLOSE_HYDRANT",
              HYDRANT_TYPE: "Standpipe",
            },
            geometry: {
              type: "Point" as const,
              coordinates: [145.0352, -37.8136] as [number, number],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants,
        distributionZones: null,
      });

      expect(result.nearestHydrant?.assetId).toBe("CLOSE_HYDRANT");
      expect(result.nearestHydrant?.type).toBe("Standpipe");
    });

    it("should handle null hydrants", () => {
      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.nearestHydrant).toBeUndefined();
    });

    it("should handle empty hydrants collection", () => {
      const hydrants = {
        type: "FeatureCollection" as const,
        features: [],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants,
        distributionZones: null,
      });

      expect(result.nearestHydrant).toBeUndefined();
    });
  });

  describe("pressure zone analysis", () => {
    it("should determine pressure zone from Polygon geometry", () => {
      const distributionZones = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PRESSURE_ZONE: "High Pressure Zone",
              ZONE_NAME: "Kew Zone",
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [145.03, -37.81] as [number, number],
                  [145.04, -37.81] as [number, number],
                  [145.04, -37.82] as [number, number],
                  [145.03, -37.82] as [number, number],
                  [145.03, -37.81] as [number, number],
                ],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones,
      });

      expect(result.waterPressureZone).toBe("High Pressure Zone");
    });

    it("should determine pressure zone from MultiPolygon geometry", () => {
      const distributionZones = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PRESSURE_ZONE: "Medium Pressure Zone",
            },
            geometry: {
              type: "MultiPolygon" as const,
              coordinates: [
                [
                  [
                    [145.03, -37.81] as [number, number],
                    [145.04, -37.81] as [number, number],
                    [145.04, -37.82] as [number, number],
                    [145.03, -37.82] as [number, number],
                    [145.03, -37.81] as [number, number],
                  ],
                ],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones,
      });

      expect(result.waterPressureZone).toBe("Medium Pressure Zone");
    });

    it("should return null if property is outside all zones", () => {
      const distributionZones = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PRESSURE_ZONE: "Zone A",
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [145.1, -37.9] as [number, number],
                  [145.2, -37.9] as [number, number],
                  [145.2, -38.0] as [number, number],
                  [145.1, -38.0] as [number, number],
                  [145.1, -37.9] as [number, number],
                ],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones,
      });

      expect(result.waterPressureZone).toBeNull();
    });

    it("should handle null distribution zones", () => {
      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes: null,
        hydrants: null,
        distributionZones: null,
      });

      expect(result.waterPressureZone).toBeNull();
    });
  });

  describe("combined analysis", () => {
    it("should analyze all infrastructure types together", () => {
      const waterPipes = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PIPE_DIAMETER: 150,
              PIPE_MATERIAL: "PVC",
            },
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [145.0352, -37.8136] as [number, number],
                [145.0353, -37.8137] as [number, number],
              ],
            },
          },
        ],
      };

      const hydrants = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              MXASSETNUM: "H001",
              HYDRANT_TYPE: "Pillar",
            },
            geometry: {
              type: "Point" as const,
              coordinates: [145.0355, -37.8138] as [number, number],
            },
          },
        ],
      };

      const distributionZones = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              PRESSURE_ZONE: "High",
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [145.03, -37.81] as [number, number],
                  [145.04, -37.81] as [number, number],
                  [145.04, -37.82] as [number, number],
                  [145.03, -37.82] as [number, number],
                  [145.03, -37.81] as [number, number],
                ],
              ],
            },
          },
        ],
      };

      const result = analyzeWaterAccess({
        propertyLat,
        propertyLon,
        waterPipes,
        hydrants,
        distributionZones,
      });

      expect(result.hasWaterConnection).toBe(true);
      expect(result.nearestWaterMain).toBeDefined();
      expect(result.nearestHydrant).toBeDefined();
      expect(result.waterPressureZone).toBe("High");
    });
  });
});
