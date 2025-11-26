import { describe, expect, test } from "bun:test";
import { determineRiskLevel } from "./determineRiskLevel";
import { LandslideHazardZone } from "../types";

describe("determineRiskLevel", () => {
  test("returns VERY_HIGH when property is affected by hazard zone", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns VERY_HIGH when multiple zones affect property", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        hazardType: "Erosion Management",
        overlayCode: "EMO2",
        description: "Erosion area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when zone is within 50m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("HIGH");
  });

  test("returns HIGH when zone is exactly at 49m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 49,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("HIGH");
  });

  test("returns MODERATE when zone is between 50m and 100m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when zone is exactly at 50m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when zone is exactly at 99m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 99,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MODERATE");
  });

  test("returns MINIMAL when zone is beyond 100m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MINIMAL");
  });

  test("returns MINIMAL when no zones are provided", () => {
    const zones: LandslideHazardZone[] = [];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MINIMAL");
  });

  test("prioritizes VERY_HIGH over closer non-affecting zones", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Erosion Management",
        overlayCode: "EMO1",
        description: "Erosion area",
        affectsProperty: false,
        distanceMeters: 10, // Very close but not affecting
      },
      {
        hazardType: "Landslip",
        overlayCode: "LSO2",
        description: "Landslip area",
        affectsProperty: true, // Affecting property
        distanceMeters: undefined,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when multiple zones within 50m", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 20,
      },
      {
        hazardType: "Erosion Management",
        overlayCode: "EMO1",
        description: "Erosion area",
        affectsProperty: false,
        distanceMeters: 40,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("HIGH");
  });

  test("returns correct level with mixed distances", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Far zone",
        affectsProperty: false,
        distanceMeters: 200,
      },
      {
        hazardType: "Erosion Management",
        overlayCode: "EMO1",
        description: "Near zone",
        affectsProperty: false,
        distanceMeters: 60,
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MODERATE"); // Based on the closest (60m)
  });

  test("handles zones with undefined distanceMeters when not affecting", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: undefined, // Unusual but possible
      },
    ];

    const result = determineRiskLevel({ zones });
    expect(result).toBe("MINIMAL"); // No valid distance to evaluate
  });
});
