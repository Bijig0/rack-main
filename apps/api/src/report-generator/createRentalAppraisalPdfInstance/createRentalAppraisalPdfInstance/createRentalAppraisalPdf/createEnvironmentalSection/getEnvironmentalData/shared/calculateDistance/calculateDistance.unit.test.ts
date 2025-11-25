import { describe, expect, test } from "bun:test";
import * as turf from "@turf/turf";
import { calculateDistance } from "./calculateDistance";

describe("calculateDistance", () => {
  test("returns approximately 0 when point is on the edge of polygon", () => {
    const point = turf.point([144.96, -37.81]);
    const feature = {
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
    };

    const distance = calculateDistance({ feature, point });
    expect(distance).toBeLessThan(1); // Very close to 0
  });

  test("calculates correct distance to polygon edge", () => {
    const point = turf.point([144.98, -37.815]); // Point outside polygon
    const feature = {
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
    };

    const distance = calculateDistance({ feature, point });
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2000); // Less than 2km
  });

  test("returns minimum distance for multipolygon", () => {
    const point = turf.point([144.965, -37.815]);
    const feature = {
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
          [
            [
              [145.0, -38.0],
              [145.1, -38.0],
              [145.1, -38.1],
              [145.0, -38.1],
              [145.0, -38.0],
            ],
          ],
        ],
      },
    };

    const distance = calculateDistance({ feature, point });

    // Should be close to first polygon, far from second
    expect(distance).toBeLessThan(1000);
  });

  test("returns Infinity for invalid polygon (less than 4 points)", () => {
    const point = turf.point([144.9631, -37.8136]);
    const feature = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [144.96, -37.81],
            [144.97, -37.81],
          ],
        ],
      },
    };

    const distance = calculateDistance({ feature, point });
    expect(distance).toBe(Infinity);
  });

  test("returns Infinity for unsupported geometry type", () => {
    const point = turf.point([144.9631, -37.8136]);
    const feature = {
      geometry: {
        type: "Point",
        coordinates: [144.9631, -37.8136],
      },
    };

    const distance = calculateDistance({ feature, point });
    expect(distance).toBe(Infinity);
  });

  test("handles polygon with invalid coordinates by filtering them", () => {
    const point = turf.point([144.98, -37.815]);
    const feature = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [144.96, -37.81],
            [NaN, -37.81],
            [144.97, -37.81],
            [144.97, -37.82],
            [Infinity, -37.82],
            [144.96, -37.82],
            [144.96, -37.81],
          ],
        ],
      },
    };

    const distance = calculateDistance({ feature, point });

    // Should still calculate distance after filtering invalid coords
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2000);
  });

  test("handles large polygon (>5000 points) by simplifying", () => {
    // Create a large polygon with many points
    const coords: [number, number][] = [];
    for (let i = 0; i < 6000; i++) {
      const angle = (i / 6000) * 2 * Math.PI;
      const radius = 0.01;
      coords.push([
        144.96 + radius * Math.cos(angle),
        -37.81 + radius * Math.sin(angle),
      ]);
    }
    coords.push(coords[0]); // Close the ring

    const point = turf.point([144.98, -37.81]);
    const feature = {
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
    };

    const distance = calculateDistance({ feature, point });

    // Should successfully calculate distance despite large polygon
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(5000);
  });

  test("handles multipolygon where some polygons have invalid coordinates", () => {
    const point = turf.point([144.965, -37.815]);
    const feature = {
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [NaN, NaN],
              [Infinity, -Infinity],
            ],
          ], // Invalid polygon
          [
            [
              [144.96, -37.81],
              [144.97, -37.81],
              [144.97, -37.82],
              [144.96, -37.82],
              [144.96, -37.81],
            ],
          ], // Valid polygon
        ],
      },
    };

    const distance = calculateDistance({ feature, point });

    // Should skip invalid polygon and calculate distance to valid one
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(1000);
  });

  test("returns Infinity when turf.js throws error", () => {
    const point = turf.point([144.9631, -37.8136]);
    const feature = {
      geometry: {
        type: "Polygon",
        coordinates: null, // Invalid - will cause turf.js to throw
      },
    };

    const distance = calculateDistance({ feature, point });
    expect(distance).toBe(Infinity);
  });
});
