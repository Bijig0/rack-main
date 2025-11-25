import { describe, expect, test } from "bun:test";
import { determineSignificanceLevel } from "./determineSignificanceLevel";
import { CharacterOverlay } from "../types";

describe("determineSignificanceLevel", () => {
  test("returns VERY_HIGH when property is affected by character overlay", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        description: "Character area",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns VERY_HIGH when multiple overlays affect property", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        overlayCode: "SLO2",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 2",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when overlay is within 50m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("HIGH");
  });

  test("returns HIGH when overlay is exactly at 49m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 49,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("HIGH");
  });

  test("returns MODERATE when overlay is between 50m and 100m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "SLO1",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 1",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when overlay is exactly at 50m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 50,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when overlay is exactly at 99m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 99,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MODERATE");
  });

  test("returns LOW when overlay is between 100m and 200m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("LOW");
  });

  test("returns LOW when overlay is exactly at 100m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 100,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("LOW");
  });

  test("returns LOW when overlay is exactly at 199m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 199,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("LOW");
  });

  test("returns MINIMAL when overlay is beyond 200m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 250,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MINIMAL");
  });

  test("returns MINIMAL when no overlays are provided", () => {
    const overlays: CharacterOverlay[] = [];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MINIMAL");
  });

  test("prioritizes VERY_HIGH over closer non-affecting overlays", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "SLO1",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 1",
        affectsProperty: false,
        distanceMeters: 10, // Very close but not affecting
      },
      {
        overlayCode: "NCO2",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 2",
        affectsProperty: true, // Affecting property
        distanceMeters: undefined,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when multiple overlays within 50m", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 20,
      },
      {
        overlayCode: "SLO1",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 1",
        affectsProperty: false,
        distanceMeters: 40,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("HIGH");
  });

  test("returns correct level with mixed distances", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Far overlay",
        affectsProperty: false,
        distanceMeters: 250,
      },
      {
        overlayCode: "SLO1",
        overlayType: "SLO",
        overlayName: "Near overlay",
        affectsProperty: false,
        distanceMeters: 60,
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MODERATE"); // Based on the closest (60m)
  });

  test("handles overlays with undefined distanceMeters when not affecting", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: undefined, // Unusual but possible
      },
    ];

    const result = determineSignificanceLevel({ overlays });
    expect(result).toBe("MINIMAL"); // No valid distance to evaluate
  });
});
