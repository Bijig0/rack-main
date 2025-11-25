import { describe, it, expect } from "bun:test";
import { getDrainageCatchment } from "./getDrainageCatchment";

describe("getDrainageCatchment", () => {
  it("should identify catchment when point is inside polygon", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Yarra River",
            WATERWAY: "Yarra River",
            AREA_HA: 4000,
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Yarra River");
    expect(result?.waterway).toBe("Yarra River");
    expect(result?.area).toBe(4000);
  });

  it("should return undefined when point is outside all catchments", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Yarra River",
            WATERWAY: "Yarra River",
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.90, // Outside the catchment
      lon: 145.00,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeUndefined();
  });

  it("should calculate area from geometry when not in properties", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Test Catchment",
            WATERWAY: "Test River",
            // No AREA_HA property - should calculate from geometry
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.area).toBeGreaterThan(0);
  });

  it("should handle MultiPolygon geometry", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [144.96, -37.81],
                  [144.97, -37.81],
                  [144.97, -37.82],
                  [144.96, -37.82],
                  [144.96, -37.81],
                ],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Multi Catchment",
            WATERWAY: "Test Stream",
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Multi Catchment");
  });

  it("should use alternative property names", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            catchment_name: "Alternative Name",
            stream_name: "Alternative Stream",
            area_ha: 1500,
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Alternative Name");
    expect(result?.waterway).toBe("Alternative Stream");
    expect(result?.area).toBe(1500);
  });

  it("should handle invalid GeoJSON gracefully", () => {
    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: null,
    });

    expect(result).toBeUndefined();
  });

  it("should handle empty feature collection", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeUndefined();
  });

  it("should handle missing properties gracefully", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {},
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Unknown Catchment");
  });

  it("should select first matching catchment when point is in multiple overlapping catchments", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "First Catchment",
            WATERWAY: "First River",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Second Catchment",
            WATERWAY: "Second River",
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("First Catchment");
  });

  it("should round area to nearest whole number", () => {
    const mockGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [144.96, -37.81],
                [144.97, -37.81],
                [144.97, -37.82],
                [144.96, -37.82],
                [144.96, -37.81],
              ],
            ],
          },
          properties: {
            CATCH_NAME: "Test",
            WATERWAY: "Test",
            AREA_HA: 1234.56,
          },
        },
      ],
    };

    const result = getDrainageCatchment({
      lat: -37.815,
      lon: 144.965,
      catchmentsGeoJSON: mockGeoJSON,
    });

    expect(result?.area).toBe(1235);
  });
});
