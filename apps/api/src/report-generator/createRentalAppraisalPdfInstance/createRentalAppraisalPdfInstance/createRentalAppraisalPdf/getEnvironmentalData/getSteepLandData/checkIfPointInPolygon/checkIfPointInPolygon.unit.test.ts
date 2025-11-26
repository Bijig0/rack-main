import { describe, expect, test } from "bun:test";
import * as turf from "@turf/turf";
import { checkIfPointInPolygon } from "./checkIfPointInPolygon";

describe("checkIfPointInPolygon", () => {
  test("returns true when point is inside a simple polygon", () => {
    const point = turf.point([144.9631, -37.8136]);
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

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(true);
  });

  test("returns false when point is outside a simple polygon", () => {
    const point = turf.point([145.0, -37.0]);
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

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(false);
  });

  test("returns true when point is inside a multipolygon", () => {
    const point = turf.point([144.9631, -37.8136]);
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

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(true);
  });

  test("returns false when point is outside all polygons in multipolygon", () => {
    const point = turf.point([146.0, -39.0]);
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

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(false);
  });

  test("returns false when geometry type is not Polygon or MultiPolygon", () => {
    const point = turf.point([144.9631, -37.8136]);
    const feature = {
      geometry: {
        type: "Point",
        coordinates: [144.9631, -37.8136],
      },
    };

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(false);
  });

  test("returns false when invalid geometry causes turf.js to throw error", () => {
    const point = turf.point([144.9631, -37.8136]);
    const feature = {
      geometry: {
        type: "Polygon",
        coordinates: [[[144.96, -37.81]]], // Invalid - polygon needs at least 4 points
      },
    };

    const result = checkIfPointInPolygon({ feature, point });
    expect(result).toBe(false);
  });

  test("handles polygon on edge case - point on boundary", () => {
    const point = turf.point([144.96, -37.81]); // Point exactly on corner
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

    const result = checkIfPointInPolygon({ feature, point });
    // Turf.js considers points on the boundary as inside
    expect(result).toBe(true);
  });
});
