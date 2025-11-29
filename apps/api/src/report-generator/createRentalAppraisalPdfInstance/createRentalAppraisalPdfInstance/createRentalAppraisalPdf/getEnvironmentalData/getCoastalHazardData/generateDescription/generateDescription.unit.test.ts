import { describe, expect, test } from "bun:test";
import { generateDescription } from "./generateDescription";
import { CoastalHazardZone } from "../types";

describe("generateDescription", () => {
  test("returns VERY_HIGH description with single affecting zone", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });
    expect(result).toBe(
      "Very high coastal hazard risk - property is within 1 coastal hazard zone(s): Land Subject to Inundation. Development subject to coastal hazard controls."
    );
  });

  test("returns VERY_HIGH description with multiple affecting zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });
    expect(result).toBe(
      "Very high coastal hazard risk - property is within 2 coastal hazard zone(s): Land Subject to Inundation, Special Building Overlay. Development subject to coastal hazard controls."
    );
  });

  test("returns VERY_HIGH description with mixed affecting and non-affecting zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });
    expect(result).toBe(
      "Very high coastal hazard risk - property is within 1 coastal hazard zone(s): Land Subject to Inundation. Development subject to coastal hazard controls."
    );
  });

  test("returns HIGH description", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = generateDescription({ level: "HIGH", zones });
    expect(result).toBe(
      "High coastal hazard risk - property is in close proximity to coastal hazard zones. Consider coastal processes in development."
    );
  });

  test("returns HIGH description with no zones (edge case)", () => {
    const zones: CoastalHazardZone[] = [];

    const result = generateDescription({ level: "HIGH", zones });
    expect(result).toBe(
      "High coastal hazard risk - property is in close proximity to coastal hazard zones. Consider coastal processes in development."
    );
  });

  test("returns MODERATE description", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateDescription({ level: "MODERATE", zones });
    expect(result).toBe(
      "Moderate coastal hazard risk - property is near coastal hazard areas. Coastal considerations apply."
    );
  });

  test("returns MODERATE description with multiple zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 150,
      },
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: false,
        distanceMeters: 200,
      },
    ];

    const result = generateDescription({ level: "MODERATE", zones });
    expect(result).toBe(
      "Moderate coastal hazard risk - property is near coastal hazard areas. Coastal considerations apply."
    );
  });

  test("returns LOW description", () => {
    const zones: CoastalHazardZone[] = [];

    const result = generateDescription({ level: "LOW", zones });
    expect(result).toBe(
      "Low coastal hazard risk - property is in coastal area but outside identified hazard zones."
    );
  });

  test("returns LOW description with distant zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 400,
      },
    ];

    const result = generateDescription({ level: "LOW", zones });
    expect(result).toBe(
      "Low coastal hazard risk - property is in coastal area but outside identified hazard zones."
    );
  });

  test("returns MINIMAL description", () => {
    const zones: CoastalHazardZone[] = [];

    const result = generateDescription({ level: "MINIMAL", zones });
    expect(result).toBe("Minimal coastal hazard risk - property not in coastal area.");
  });

  test("returns MINIMAL description with zones (edge case)", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 500,
      },
    ];

    const result = generateDescription({ level: "MINIMAL", zones });
    expect(result).toBe("Minimal coastal hazard risk - property not in coastal area.");
  });
});
