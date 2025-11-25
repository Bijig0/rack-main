import { describe, expect, test } from "bun:test";
import { generateDescription } from "./generateDescription";
import { CharacterOverlay } from "../types";

describe("generateDescription", () => {
  test("generates VERY_HIGH description with single affecting overlay", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", overlays });
    expect(result).toBe(
      "Very high character significance - property is within 1 character overlay(s): NCO1. Development must respect neighbourhood character."
    );
  });

  test("generates VERY_HIGH description with multiple affecting overlays", () => {
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

    const result = generateDescription({ level: "VERY_HIGH", overlays });
    expect(result).toBe(
      "Very high character significance - property is within 2 character overlay(s): NCO1, SLO2. Development must respect neighbourhood character."
    );
  });

  test("generates VERY_HIGH description with mixed affecting and non-affecting overlays", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: true,
        distanceMeters: undefined,
      },
      {
        overlayCode: "NCO2",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 2",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", overlays });
    expect(result).toBe(
      "Very high character significance - property is within 1 character overlay(s): NCO1. Development must respect neighbourhood character."
    );
  });

  test("generates HIGH description", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateDescription({ level: "HIGH", overlays });
    expect(result).toBe(
      "High character significance - property is in close proximity to character overlay areas. Development should consider neighbourhood character context."
    );
  });

  test("generates HIGH description with multiple overlays", () => {
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
        distanceMeters: 45,
      },
    ];

    const result = generateDescription({ level: "HIGH", overlays });
    expect(result).toBe(
      "High character significance - property is in close proximity to character overlay areas. Development should consider neighbourhood character context."
    );
  });

  test("generates MODERATE description", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = generateDescription({ level: "MODERATE", overlays });
    expect(result).toBe(
      "Moderate character significance - property is near character-protected areas. Consider character impacts in development design."
    );
  });

  test("generates LOW description", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateDescription({ level: "LOW", overlays });
    expect(result).toBe(
      "Low character significance - property is in an area with some character context."
    );
  });

  test("generates MINIMAL description with no overlays", () => {
    const overlays: CharacterOverlay[] = [];

    const result = generateDescription({ level: "MINIMAL", overlays });
    expect(result).toBe(
      "Minimal character significance - no identified character constraints in the immediate vicinity."
    );
  });

  test("generates MINIMAL description with distant overlays", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 300,
      },
    ];

    const result = generateDescription({ level: "MINIMAL", overlays });
    expect(result).toBe(
      "Minimal character significance - no identified character constraints in the immediate vicinity."
    );
  });

  test("handles SLO overlay type correctly", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "SLO3",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 3",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", overlays });
    expect(result).toBe(
      "Very high character significance - property is within 1 character overlay(s): SLO3. Development must respect neighbourhood character."
    );
  });
});
