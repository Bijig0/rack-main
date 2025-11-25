import { describe, expect, test } from "bun:test";
import { determineRiskLevel } from "./determineRiskLevel";
import { CoastalHazardZone } from "../types";

describe("determineRiskLevel", () => {
  test("returns VERY_HIGH when property is affected by hazard zone", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns VERY_HIGH when multiple zones affect property", () => {
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

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns VERY_HIGH even when not in coastal area if zone affects property", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: false });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when zone is within 100m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("HIGH");
  });

  test("returns HIGH when zone is exactly at 99m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: false,
        distanceMeters: 99,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("HIGH");
  });

  test("returns MODERATE when zone is between 100m and 250m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when zone is exactly at 100m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 100,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when zone is exactly at 249m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 249,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("MODERATE");
  });

  test("returns LOW when in coastal area but zone is beyond 250m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 300,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("LOW");
  });

  test("returns LOW when in coastal area with no zones", () => {
    const zones: CoastalHazardZone[] = [];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("LOW");
  });

  test("returns MINIMAL when not in coastal area and no zones", () => {
    const zones: CoastalHazardZone[] = [];

    const result = determineRiskLevel({ zones, isCoastal: false });
    expect(result).toBe("MINIMAL");
  });

  test("returns MINIMAL when not in coastal area and zones are far", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 400,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: false });
    expect(result).toBe("MINIMAL");
  });

  test("prioritizes VERY_HIGH over closer non-affecting zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: false,
        distanceMeters: 10, // Very close but not affecting
      },
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true, // Affecting property
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when multiple zones within 100m", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 30,
      },
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: false,
        distanceMeters: 80,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("HIGH");
  });

  test("returns correct level with mixed distances", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "Far zone",
        affectsProperty: false,
        distanceMeters: 400,
      },
      {
        hazardType: "Special Building Overlay",
        description: "Near zone",
        affectsProperty: false,
        distanceMeters: 120,
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: true });
    expect(result).toBe("MODERATE"); // Based on the closest (120m)
  });

  test("handles zones with undefined distanceMeters when not affecting", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: undefined, // Unusual but possible
      },
    ];

    const result = determineRiskLevel({ zones, isCoastal: false });
    expect(result).toBe("MINIMAL"); // No valid distance to evaluate
  });
});
