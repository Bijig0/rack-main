import { describe, expect, test } from "bun:test";
import { generateRecommendations } from "./generateRecommendations";
import { LandslideHazardZone } from "../types";

describe("generateRecommendations", () => {
  test("generates LSO recommendations when Landslip zone affects property", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    expect(result).toContain(
      "Landslip Overlay applies - planning permit required for most development"
    );
    expect(result).toContain(
      "Geotechnical report required demonstrating slope stability and landslip risk mitigation"
    );
    expect(result).toContain(
      "Development must not increase landslip risk on or off site"
    );
    expect(result).toContain(
      "Engage qualified geotechnical engineer for site assessment"
    );
  });

  test("generates EMO recommendations when Erosion Management zone affects property", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Erosion Management",
        overlayCode: "EMO1",
        description: "Erosion area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    expect(result).toContain(
      "Erosion Management Overlay applies - erosion control measures required"
    );
    expect(result).toContain(
      "Prepare erosion and sediment control plan for construction"
    );
  });

  test("generates combined LSO and EMO recommendations", () => {
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
        overlayCode: "EMO1",
        description: "Erosion area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    // Should include both LSO and EMO recommendations
    expect(result).toContain(
      "Landslip Overlay applies - planning permit required for most development"
    );
    expect(result).toContain(
      "Erosion Management Overlay applies - erosion control measures required"
    );
  });

  test("generates general mitigation recommendations for affecting zones", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Steep Slopes",
        overlayCode: "ESO5",
        description: "Steep slopes area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    expect(result).toContain(
      "Engage qualified geotechnical engineer for site assessment"
    );
    expect(result).toContain(
      "Consider slope stability in foundation design and drainage"
    );
    expect(result).toContain(
      "Implement measures to prevent soil erosion and manage stormwater"
    );
    expect(result).toContain(
      "Maintain vegetation on slopes to prevent erosion"
    );
    expect(result).toContain(
      "Avoid cut and fill operations that could destabilize slopes"
    );
  });

  test("generates HIGH level recommendations", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", zones });

    expect(result).toEqual([
      "Property near landslide hazard areas - obtain geotechnical advice",
      "Assess slope stability and erosion potential",
      "Design drainage to prevent slope saturation",
    ]);
  });

  test("generates MODERATE level recommendations", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = generateRecommendations({ level: "MODERATE", zones });

    expect(result).toEqual([
      "Property near landslide hazard areas - obtain geotechnical advice",
      "Assess slope stability and erosion potential",
      "Design drainage to prevent slope saturation",
    ]);
  });

  test("generates MINIMAL level recommendations", () => {
    const zones: LandslideHazardZone[] = [];

    const result = generateRecommendations({ level: "MINIMAL", zones });

    expect(result).toEqual([
      "No significant landslide or steep land constraints identified",
      "Standard foundation and drainage practices apply",
    ]);
  });

  test("generates MINIMAL recommendations for LOW level", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateRecommendations({ level: "LOW", zones });

    expect(result).toEqual([
      "No significant landslide or steep land constraints identified",
      "Standard foundation and drainage practices apply",
    ]);
  });

  test("does not include LSO recommendations when only nearby but not affecting", () => {
    const zones: LandslideHazardZone[] = [
      {
        hazardType: "Landslip",
        overlayCode: "LSO1",
        description: "Landslip area",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", zones });

    expect(result).not.toContain(
      "Landslip Overlay applies - planning permit required for most development"
    );
    expect(result).toContain(
      "Property near landslide hazard areas - obtain geotechnical advice"
    );
  });

  test("includes all recommendations when multiple affecting zones with different types", () => {
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
        overlayCode: "EMO1",
        description: "Erosion area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    // Should have LSO (3) + EMO (2) + General (5) = 10 recommendations
    expect(result.length).toBe(10);
  });
});
