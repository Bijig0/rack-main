import { describe, expect, test } from "bun:test";
import { simplifyCoords } from "./simplifyCoords";

describe("simplifyCoords", () => {
  test("simplifies a complex line to fewer points", () => {
    // Create a zigzag line with many points
    const coords: [number, number][] = [];
    for (let i = 0; i < 100; i++) {
      coords.push([144.96 + i * 0.0001, -37.81 + (i % 2 === 0 ? 0 : 0.00001)]);
    }

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // Simplified should have fewer points than original
    expect(result.length).toBeLessThan(coords.length);
    expect(result.length).toBeGreaterThanOrEqual(2); // At least start and end points
  });

  test("keeps simple straight line mostly unchanged", () => {
    const coords: [number, number][] = [
      [144.96, -37.81],
      [144.97, -37.82],
      [144.98, -37.83],
      [144.99, -37.84],
    ];

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // A straight line should simplify to just start and end points (or close to it)
    expect(result.length).toBeLessThanOrEqual(4);
    expect(result.length).toBeGreaterThanOrEqual(2);

    // First and last points should be preserved
    expect(result[0]).toEqual(coords[0]);
    expect(result[result.length - 1]).toEqual(coords[coords.length - 1]);
  });

  test("preserves first and last coordinate", () => {
    const coords: [number, number][] = [];
    for (let i = 0; i < 50; i++) {
      coords.push([144.96 + i * 0.001, -37.81 + Math.sin(i) * 0.001]);
    }

    const result = simplifyCoords({ coords, tolerance: 0.001 });

    expect(result[0]).toEqual(coords[0]);
    expect(result[result.length - 1]).toEqual(coords[coords.length - 1]);
  });

  test("uses custom tolerance value", () => {
    const coords: [number, number][] = [];
    for (let i = 0; i < 100; i++) {
      coords.push([144.96 + i * 0.0001, -37.81 + (i % 2 === 0 ? 0 : 0.00001)]);
    }

    const resultLowTolerance = simplifyCoords({
      coords,
      tolerance: 0.00001,
    });
    const resultHighTolerance = simplifyCoords({ coords, tolerance: 0.001 });

    // Higher tolerance should result in fewer points
    expect(resultHighTolerance.length).toBeLessThanOrEqual(
      resultLowTolerance.length
    );
  });

  test("handles minimum coordinate array (2 points)", () => {
    const coords: [number, number][] = [
      [144.96, -37.81],
      [144.97, -37.82],
    ];

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // Cannot simplify below 2 points
    expect(result.length).toBe(2);
    expect(result).toEqual(coords);
  });

  test("handles closed ring (polygon)", () => {
    // Create a closed polygon ring (first and last point are same)
    const coords: [number, number][] = [
      [144.96, -37.81],
      [144.97, -37.81],
      [144.97, -37.82],
      [144.96, -37.82],
      [144.96, -37.81], // Closing point
    ];

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // Should maintain closed ring
    expect(result.length).toBeGreaterThanOrEqual(3); // Minimum for polygon
    expect(result[0]).toEqual(result[result.length - 1]); // Still closed
  });

  test("simplifies very large polygon (>5000 points)", () => {
    // Create a large complex polygon
    const coords: [number, number][] = [];
    for (let i = 0; i < 6000; i++) {
      const angle = (i / 6000) * 2 * Math.PI;
      const radius = 0.01 + Math.sin(i * 0.1) * 0.005;
      coords.push([
        144.96 + radius * Math.cos(angle),
        -37.81 + radius * Math.sin(angle),
      ]);
    }

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // Should significantly reduce point count
    expect(result.length).toBeLessThan(1000);
    expect(result.length).toBeGreaterThan(10);
  });

  test("returns all coordinate pairs as tuples", () => {
    const coords: [number, number][] = [
      [144.96, -37.81],
      [144.97, -37.82],
      [144.98, -37.83],
    ];

    const result = simplifyCoords({ coords, tolerance: 0.0001 });

    // Check each coordinate is a proper tuple
    result.forEach((coord) => {
      expect(coord).toBeArrayOfSize(2);
      expect(typeof coord[0]).toBe("number");
      expect(typeof coord[1]).toBe("number");
    });
  });
});
