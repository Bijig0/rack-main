import { describe, expect, test } from "bun:test";
import { generateRecommendations } from "./generateRecommendations";
import { CoastalHazardZone } from "../types";

describe("generateRecommendations", () => {
  test("returns LSIO recommendations when property affected by inundation zone", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    expect(result).toContain(
      "Property subject to Land Subject to Inundation Overlay - planning permit required for most development"
    );
    expect(result).toContain(
      "Finished floor levels must be set above flood levels specified in the overlay schedule"
    );
    expect(result).toContain(
      "Obtain detailed flood and inundation assessment from qualified engineer"
    );
    expect(result).toContain(
      "Consider sea level rise and climate change impacts on coastal hazards"
    );
    expect(result).toContain(
      "Investigate coastal erosion trends and storm surge history"
    );
    expect(result).toContain(
      "Ensure adequate insurance coverage for coastal hazards"
    );
  });

  test("returns SBO recommendations when property affected by special building overlay", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Special Building Overlay",
        description: "SBO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    expect(result).toContain(
      "Special Building Overlay applies - consult with relevant authority (e.g., Melbourne Water)"
    );
    expect(result).toContain(
      "Development must not increase flood risk or be subject to flood damage"
    );
    expect(result).toContain(
      "Consider sea level rise and climate change impacts on coastal hazards"
    );
    expect(result).toContain(
      "Investigate coastal erosion trends and storm surge history"
    );
    expect(result).toContain(
      "Ensure adequate insurance coverage for coastal hazards"
    );
  });

  test("returns combined LSIO and SBO recommendations when both affect property", () => {
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

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    // Should have both LSIO and SBO recommendations
    expect(result).toContain(
      "Property subject to Land Subject to Inundation Overlay - planning permit required for most development"
    );
    expect(result).toContain(
      "Special Building Overlay applies - consult with relevant authority (e.g., Melbourne Water)"
    );
    expect(result.length).toBeGreaterThanOrEqual(8); // 3 LSIO + 2 SBO + 3 general
  });

  test("does not include overlay-specific recommendations when zones nearby but not affecting", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", zones });

    expect(result).not.toContain(
      "Property subject to Land Subject to Inundation Overlay - planning permit required for most development"
    );
    expect(result).toContain(
      "Property near coastal hazard zones - consider coastal processes in design"
    );
  });

  test("returns HIGH level recommendations", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", zones });

    expect(result).toContain(
      "Property near coastal hazard zones - consider coastal processes in design"
    );
    expect(result).toContain(
      "Check with local council regarding coastal management plans"
    );
    expect(result).toHaveLength(2);
  });

  test("returns MODERATE level recommendations", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateRecommendations({ level: "MODERATE", zones });

    expect(result).toContain(
      "Property near coastal hazard zones - consider coastal processes in design"
    );
    expect(result).toContain(
      "Check with local council regarding coastal management plans"
    );
    expect(result).toHaveLength(2);
  });

  test("returns LOW level recommendations", () => {
    const zones: CoastalHazardZone[] = [];

    const result = generateRecommendations({ level: "LOW", zones });

    expect(result).toContain(
      "Coastal property - standard coastal design considerations apply"
    );
    expect(result).toContain(
      "Consider salt spray, wind exposure, and coastal erosion in materials selection"
    );
    expect(result).toHaveLength(2);
  });

  test("returns MINIMAL level recommendations", () => {
    const zones: CoastalHazardZone[] = [];

    const result = generateRecommendations({ level: "MINIMAL", zones });

    expect(result).toContain("No coastal hazard constraints identified");
    expect(result).toContain("Property not in coastal area");
    expect(result).toHaveLength(2);
  });

  test("handles mixed affecting and non-affecting zones correctly", () => {
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
        distanceMeters: 30,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    // Should only include LSIO recommendations, not SBO (since SBO doesn't affect property)
    expect(result).toContain(
      "Property subject to Land Subject to Inundation Overlay - planning permit required for most development"
    );
    expect(result).not.toContain(
      "Special Building Overlay applies - consult with relevant authority (e.g., Melbourne Water)"
    );
  });

  test("returns empty general recommendations for VERY_HIGH with affecting zones", () => {
    const zones: CoastalHazardZone[] = [
      {
        hazardType: "Land Subject to Inundation",
        description: "LSIO area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", zones });

    // Should not include the minimal recommendations
    expect(result).not.toContain("No coastal hazard constraints identified");
    expect(result).not.toContain("Property not in coastal area");
  });
});
