import { describe, expect, test } from "bun:test";
import { generateDescription } from "./generateDescription";
import { LandslideHazardZone } from "../types";

describe("generateDescription", () => {
  test("generates VERY_HIGH description with single affecting zone", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });

    expect(result).toContain("Very high landslide risk");
    expect(result).toContain("1 landslide hazard zone");
    expect(result).toContain("LSO1");
    expect(result).toContain("Significant geotechnical constraints");
  });

  test("generates VERY_HIGH description with multiple affecting zones", () => {
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

    const result = generateDescription({ level: "VERY_HIGH", zones });

    expect(result).toContain("2 landslide hazard zone");
    expect(result).toContain("LSO1, EMO2");
  });

  test("generates VERY_HIGH description without overlay codes", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: undefined,
        description: "Landslip area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        hazardType: "Erosion Management",
        overlayCode: undefined,
        description: "Erosion area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });

    expect(result).toContain("Landslip, Erosion Management");
  });

  test("generates HIGH description", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateDescription({ level: "HIGH", zones });

    expect(result).toBe(
      "High landslide risk - property is in close proximity to landslide hazard areas. Geotechnical considerations apply."
    );
  });

  test("generates MODERATE description", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = generateDescription({ level: "MODERATE", zones });

    expect(result).toBe(
      "Moderate landslide risk - property is near landslide hazard areas. Consider slope stability in development."
    );
  });

  test("generates MINIMAL description", () => {
    const zones: LandslideHazardZone[] = [];

    const result = generateDescription({ level: "MINIMAL", zones });

    expect(result).toBe(
      "Minimal landslide risk - no identified landslide or steep land constraints."
    );
  });

  test("generates MINIMAL description for LOW level", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateDescription({ level: "LOW", zones });

    expect(result).toBe(
      "Minimal landslide risk - no identified landslide or steep land constraints."
    );
  });

  test("ignores non-affecting zones for VERY_HIGH description", () => {
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
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", zones });

    // Should only mention the affecting zone
    expect(result).toContain("1 landslide hazard zone");
    expect(result).toContain("LSO1");
    expect(result).not.toContain("EMO2");
  });
});
