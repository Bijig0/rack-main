import { describe, expect, test } from "bun:test";
import { filterValidCoords } from "./filterValidCoords";

describe("filterValidCoords", () => {
  test("filters out NaN coordinates", () => {
    const coords = [
      [144.9631, -37.8136],
      [NaN, -37.8136],
      [144.9632, NaN],
      [144.9633, -37.8137],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136],
      [144.9633, -37.8137],
    ]);
  });

  test("filters out Infinity coordinates", () => {
    const coords = [
      [144.9631, -37.8136],
      [Infinity, -37.8136],
      [144.9632, -Infinity],
      [144.9633, -37.8137],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136],
      [144.9633, -37.8137],
    ]);
  });

  test("filters out non-numeric coordinates", () => {
    const coords = [
      [144.9631, -37.8136],
      ["invalid", -37.8136],
      [144.9632, "invalid"],
      [144.9633, -37.8137],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136],
      [144.9633, -37.8137],
    ]);
  });

  test("filters out non-array coordinates", () => {
    const coords = [
      [144.9631, -37.8136],
      null,
      undefined,
      144.9632,
      [144.9633, -37.8137],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136],
      [144.9633, -37.8137],
    ]);
  });

  test("filters out coordinates with less than 2 elements", () => {
    const coords = [
      [144.9631, -37.8136],
      [144.9632],
      [],
      [144.9633, -37.8137],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136],
      [144.9633, -37.8137],
    ]);
  });

  test("keeps valid coordinates with more than 2 elements (elevation)", () => {
    const coords = [
      [144.9631, -37.8136, 100],
      [144.9632, -37.8137, 105],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([
      [144.9631, -37.8136, 100],
      [144.9632, -37.8137, 105],
    ]);
  });

  test("returns empty array when all coordinates are invalid", () => {
    const coords = [
      [NaN, -37.8136],
      [Infinity, -37.8137],
      ["invalid", "invalid"],
      null,
      undefined,
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([]);
  });

  test("returns all coordinates when all are valid", () => {
    const coords = [
      [144.9631, -37.8136],
      [144.9632, -37.8137],
      [144.9633, -37.8138],
      [144.9634, -37.8139],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual(coords);
  });

  test("handles empty input array", () => {
    const coords: any[] = [];

    const result = filterValidCoords({ coords });
    expect(result).toEqual([]);
  });

  test("handles valid coordinates at edge values", () => {
    const coords = [
      [0, 0],
      [-180, -90],
      [180, 90],
      [144.9631, -37.8136],
    ];

    const result = filterValidCoords({ coords });
    expect(result).toEqual(coords);
  });
});
