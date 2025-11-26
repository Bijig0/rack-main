import { describe, expect, test } from "bun:test";
import { generateRecommendations } from "./generateRecommendations";
import { CharacterOverlay } from "../types";

describe("generateRecommendations", () => {
  test("generates NCO recommendations when property is affected by NCO", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", overlays });

    expect(result).toContain(
      "Planning permit required for most residential development including subdivisions, buildings and works"
    );
    expect(result).toContain(
      "Development must meet neighbourhood character objectives specified in the NCO schedule"
    );
    expect(result).toContain(
      "Prepare a neighbourhood character assessment to demonstrate design response"
    );
    expect(result).toContain(
      "Engage an architect or designer experienced with character overlay requirements"
    );
    expect(result).toContain(
      "Review local character guidelines and preferred character statements"
    );
  });

  test("generates SLO recommendations when property is affected by SLO", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "SLO2",
        overlayType: "SLO",
        overlayName: "Significant Landscape Overlay 2",
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", overlays });

    expect(result).toContain(
      "Development must protect significant landscape features and vegetation"
    );
    expect(result).toContain(
      "Consult the Significant Landscape Overlay schedule for specific requirements"
    );
    expect(result).toContain(
      "Engage an architect or designer experienced with character overlay requirements"
    );
    expect(result).toContain(
      "Review local character guidelines and preferred character statements"
    );
  });

  test("generates combined recommendations when affected by both NCO and SLO", () => {
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

    const result = generateRecommendations({ level: "VERY_HIGH", overlays });

    // Should contain NCO recommendations
    expect(result).toContain(
      "Planning permit required for most residential development including subdivisions, buildings and works"
    );
    expect(result).toContain(
      "Development must meet neighbourhood character objectives specified in the NCO schedule"
    );
    expect(result).toContain(
      "Prepare a neighbourhood character assessment to demonstrate design response"
    );

    // Should contain SLO recommendations
    expect(result).toContain(
      "Development must protect significant landscape features and vegetation"
    );
    expect(result).toContain(
      "Consult the Significant Landscape Overlay schedule for specific requirements"
    );

    // Should contain general recommendations
    expect(result).toContain(
      "Engage an architect or designer experienced with character overlay requirements"
    );
    expect(result).toContain(
      "Review local character guidelines and preferred character statements"
    );
  });

  test("generates recommendations only for affecting overlays, not nearby ones", () => {
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
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", overlays });

    // Should contain NCO recommendations
    expect(result).toContain(
      "Planning permit required for most residential development including subdivisions, buildings and works"
    );

    // Should NOT contain SLO-specific recommendations (not affecting)
    expect(result).not.toContain(
      "Development must protect significant landscape features and vegetation"
    );
    expect(result).not.toContain(
      "Consult the Significant Landscape Overlay schedule for specific requirements"
    );
  });

  test("generates HIGH level recommendations for nearby overlays", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 30,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", overlays });

    expect(result).toContain(
      "Consider neighbourhood character in development design even though not directly affected by overlay"
    );
    expect(result).toContain(
      "Respect existing building scale, setbacks, and landscape character"
    );
    expect(result).toHaveLength(2);
  });

  test("generates MODERATE level recommendations", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 75,
      },
    ];

    const result = generateRecommendations({ level: "MODERATE", overlays });

    expect(result).toContain(
      "Consider neighbourhood character in development design even though not directly affected by overlay"
    );
    expect(result).toContain(
      "Respect existing building scale, setbacks, and landscape character"
    );
    expect(result).toHaveLength(2);
  });

  test("generates LOW level recommendations", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 150,
      },
    ];

    const result = generateRecommendations({ level: "LOW", overlays });

    expect(result).toContain("No specific character overlay constraints identified");
    expect(result).toContain("Standard residential design provisions apply");
    expect(result).toHaveLength(2);
  });

  test("generates MINIMAL level recommendations with no overlays", () => {
    const overlays: CharacterOverlay[] = [];

    const result = generateRecommendations({ level: "MINIMAL", overlays });

    expect(result).toContain("No specific character overlay constraints identified");
    expect(result).toContain("Standard residential design provisions apply");
    expect(result).toHaveLength(2);
  });

  test("generates MINIMAL level recommendations with distant overlays", () => {
    const overlays: CharacterOverlay[] = [
      {
        overlayCode: "NCO1",
        overlayType: "NCO",
        overlayName: "Neighbourhood Character Overlay 1",
        affectsProperty: false,
        distanceMeters: 300,
      },
    ];

    const result = generateRecommendations({ level: "MINIMAL", overlays });

    expect(result).toContain("No specific character overlay constraints identified");
    expect(result).toContain("Standard residential design provisions apply");
    expect(result).toHaveLength(2);
  });

  test("generates multiple NCO recommendations for multiple affecting NCO overlays", () => {
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
        affectsProperty: true,
        distanceMeters: undefined,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", overlays });

    expect(result).toContain(
      "Planning permit required for most residential development including subdivisions, buildings and works"
    );
    expect(result).toContain(
      "Development must meet neighbourhood character objectives specified in the NCO schedule"
    );
    expect(result).toContain(
      "Prepare a neighbourhood character assessment to demonstrate design response"
    );
  });
});
