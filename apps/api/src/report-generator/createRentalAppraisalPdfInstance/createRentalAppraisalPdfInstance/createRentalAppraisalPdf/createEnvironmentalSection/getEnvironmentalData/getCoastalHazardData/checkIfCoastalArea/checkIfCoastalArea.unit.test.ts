import { describe, expect, test } from "bun:test";
import { checkIfCoastalArea } from "./checkIfCoastalArea";

describe("checkIfCoastalArea", () => {
  // Port Phillip Bay tests
  test("returns true for Melbourne CBD (Port Phillip Bay)", () => {
    const result = checkIfCoastalArea({ lat: -37.8406, lon: 144.9631 });
    expect(result).toBe(true);
  });

  test("returns true for St Kilda (Port Phillip Bay)", () => {
    const result = checkIfCoastalArea({ lat: -37.8617, lon: 144.9731 });
    expect(result).toBe(true);
  });

  test("returns true for center of Port Phillip Bay region", () => {
    const result = checkIfCoastalArea({ lat: -38.0, lon: 145.0 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Port Phillip Bay region (north)", () => {
    const result = checkIfCoastalArea({ lat: -37.5, lon: 145.0 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Port Phillip Bay region (south)", () => {
    const result = checkIfCoastalArea({ lat: -38.5, lon: 145.0 });
    expect(result).toBe(true);
  });

  // Western Coast tests
  test("returns true for Warrnambool (Western Coast)", () => {
    const result = checkIfCoastalArea({ lat: -38.3829, lon: 142.4853 });
    expect(result).toBe(true);
  });

  test("returns true for center of Western Coast region", () => {
    const result = checkIfCoastalArea({ lat: -38.35, lon: 142.5 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Western Coast region (north)", () => {
    const result = checkIfCoastalArea({ lat: -38.0, lon: 142.0 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Western Coast region (south)", () => {
    const result = checkIfCoastalArea({ lat: -38.7, lon: 142.0 });
    expect(result).toBe(true);
  });

  // Eastern Coast (Gippsland) tests
  test("returns true for Lakes Entrance (Eastern Coast)", () => {
    const result = checkIfCoastalArea({ lat: -37.8745, lon: 147.9827 });
    expect(result).toBe(true);
  });

  test("returns true for center of Eastern Coast region", () => {
    const result = checkIfCoastalArea({ lat: -38.25, lon: 147.0 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Eastern Coast region (north)", () => {
    const result = checkIfCoastalArea({ lat: -37.5, lon: 146.0 });
    expect(result).toBe(true);
  });

  test("returns true for edge of Eastern Coast region (south)", () => {
    const result = checkIfCoastalArea({ lat: -39.0, lon: 146.0 });
    expect(result).toBe(true);
  });

  // Non-coastal tests
  test("returns false for Shepparton (inland)", () => {
    const result = checkIfCoastalArea({ lat: -36.3814, lon: 145.3980 });
    expect(result).toBe(false);
  });

  test("returns false for Bendigo (inland)", () => {
    const result = checkIfCoastalArea({ lat: -36.7570, lon: 144.2794 });
    expect(result).toBe(false);
  });

  test("returns false for location north of all coastal regions", () => {
    const result = checkIfCoastalArea({ lat: -36.0, lon: 145.0 });
    expect(result).toBe(false);
  });

  test("returns false for location south of all coastal regions", () => {
    const result = checkIfCoastalArea({ lat: -40.0, lon: 145.0 });
    expect(result).toBe(false);
  });

  test("returns false for location west of all coastal regions", () => {
    const result = checkIfCoastalArea({ lat: -38.0, lon: 140.0 });
    expect(result).toBe(false);
  });

  test("returns false for location east of all coastal regions", () => {
    const result = checkIfCoastalArea({ lat: -38.0, lon: 149.0 });
    expect(result).toBe(false);
  });

  test("returns false for location between Port Phillip and Western Coast (gap)", () => {
    const result = checkIfCoastalArea({ lat: -38.0, lon: 144.0 });
    expect(result).toBe(false);
  });

  test("returns false for location between Port Phillip and Eastern Coast (gap)", () => {
    // lon 145.51 is just outside Port Phillip (144.5-145.5) and just outside Eastern Coast (145.5+)
    const result = checkIfCoastalArea({ lat: -39.5, lon: 145.3 });
    expect(result).toBe(false);
  });
});
