import { describe, expect, test } from "bun:test";
import { PlanningOverlayItem } from "../getPlanningOverlay/types";
import { getZonePrecinct } from "./getZonePrecinct";

describe("getZonePrecinct", () => {
  test("should identify Heritage Precinct with multiple heritage overlays", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "HO485", overlayDescription: "Heritage Overlay 485" },
      { overlayCode: "HO109", overlayDescription: "Heritage Overlay 109" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "NRZ1",
    });

    expect(zonePrecinct).toBe("Heritage Precinct");
  });

  test("should identify Heritage Precinct with single heritage overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "HO485", overlayDescription: "Heritage Overlay 485" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBe("Heritage Precinct");
  });

  test("should identify Heritage Precinct with HO and NCO combination", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "HO200", overlayDescription: "Heritage Overlay 200" },
      { overlayCode: "NCO1", overlayDescription: "Neighbourhood Character Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "NRZ2",
    });

    expect(zonePrecinct).toBe("Heritage Precinct");
  });

  test("should identify Design and Development Precinct with DDO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "RGZ1",
    });

    expect(zonePrecinct).toBe("Design and Development Precinct");
  });

  test("should identify Design and Development Precinct with multiple DDO overlays", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
      { overlayCode: "DDO2", overlayDescription: "Design and Development Overlay 2" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "C1Z",
    });

    expect(zonePrecinct).toBe("Design and Development Precinct");
  });

  test("should identify Environmental Precinct with ESO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      {
        overlayCode: "ESO1",
        overlayDescription: "Environmental Significance Overlay 1",
      },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBe("Environmental Precinct");
  });

  test("should identify Environmental Precinct with VPO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "VPO1", overlayDescription: "Vegetation Protection Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "RLZ1",
    });

    expect(zonePrecinct).toBe("Environmental Precinct");
  });

  test("should identify Environmental Precinct with SLO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "SLO1", overlayDescription: "Significant Landscape Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ2",
    });

    expect(zonePrecinct).toBe("Environmental Precinct");
  });

  test("should identify Activity Centre Precinct with PO in commercial zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "PO1", overlayDescription: "Parking Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "C1Z",
    });

    expect(zonePrecinct).toBe("Activity Centre Precinct");
  });

  test("should identify Activity Centre Precinct with PO in mixed use zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "PO2", overlayDescription: "Parking Overlay 2" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "MUZ",
    });

    expect(zonePrecinct).toBe("Activity Centre Precinct");
  });

  test("should identify Activity Centre Precinct with PO in activity centre zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "PO3", overlayDescription: "Parking Overlay 3" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "ACZ1",
    });

    expect(zonePrecinct).toBe("Activity Centre Precinct");
  });

  test("should identify Special Use Precinct with SBO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "SBO1", overlayDescription: "Special Building Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBe("Special Use Precinct");
  });

  test("should identify Special Use Precinct with FO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "FO1", overlayDescription: "Floodway Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "FZ",
    });

    expect(zonePrecinct).toBe("Special Use Precinct");
  });

  test("should identify Special Use Precinct with LSIO overlay", () => {
    const overlays: PlanningOverlayItem[] = [
      {
        overlayCode: "LSIO1",
        overlayDescription: "Land Subject to Inundation Overlay 1",
      },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "RLZ1",
    });

    expect(zonePrecinct).toBe("Special Use Precinct");
  });

  test("should identify Mixed Use Precinct with DPO in mixed use zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DPO3", overlayDescription: "Development Plan Overlay 3" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "MUZ",
    });

    expect(zonePrecinct).toBe("Mixed Use Precinct");
  });

  test("should identify Mixed Use Precinct with DPO in residential growth zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DPO1", overlayDescription: "Development Plan Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "RGZ1",
    });

    expect(zonePrecinct).toBe("Mixed Use Precinct");
  });

  test("should identify Mixed Use Precinct with DPO in commercial zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DPO2", overlayDescription: "Development Plan Overlay 2" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "C2Z",
    });

    expect(zonePrecinct).toBe("Mixed Use Precinct");
  });

  test("should return undefined when no precinct pattern is identified", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "PAO1", overlayDescription: "Public Acquisition Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBeUndefined();
  });

  test("should return undefined when overlays array is empty", () => {
    const { zonePrecinct } = getZonePrecinct({
      overlays: [],
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBeUndefined();
  });

  test("should prioritize Heritage Precinct over other types when HO+NCO present", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "HO100", overlayDescription: "Heritage Overlay 100" },
      { overlayCode: "NCO1", overlayDescription: "Neighbourhood Character Overlay 1" },
      { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "NRZ1",
    });

    expect(zonePrecinct).toBe("Heritage Precinct");
  });

  test("should prioritize DDO over Environmental when both present (no heritage)", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
      { overlayCode: "ESO1", overlayDescription: "Environmental Significance Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1",
    });

    expect(zonePrecinct).toBe("Design and Development Precinct");
  });

  test("should not identify Activity Centre without commercial/mixed use zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "PO1", overlayDescription: "Parking Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "GRZ1", // Residential zone
    });

    // Should fall through to undefined as PO alone in residential doesn't make an Activity Centre
    expect(zonePrecinct).toBeUndefined();
  });

  test("should not identify Mixed Use Precinct without appropriate zone", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "DPO1", overlayDescription: "Development Plan Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "NRZ1", // Not a mixed use zone
    });

    // Should return undefined as DPO in NRZ doesn't indicate Mixed Use Precinct
    expect(zonePrecinct).toBeUndefined();
  });

  test("should handle complex overlay combinations", () => {
    const overlays: PlanningOverlayItem[] = [
      { overlayCode: "HO485", overlayDescription: "Heritage Overlay 485" },
      { overlayCode: "HO109", overlayDescription: "Heritage Overlay 109" },
      { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
      { overlayCode: "VPO1", overlayDescription: "Vegetation Protection Overlay 1" },
      { overlayCode: "SLO1", overlayDescription: "Significant Landscape Overlay 1" },
    ];

    const { zonePrecinct } = getZonePrecinct({
      overlays,
      zoneCode: "NRZ1",
    });

    // Should prioritize Heritage Precinct due to multiple HO overlays
    expect(zonePrecinct).toBe("Heritage Precinct");
  });
});
