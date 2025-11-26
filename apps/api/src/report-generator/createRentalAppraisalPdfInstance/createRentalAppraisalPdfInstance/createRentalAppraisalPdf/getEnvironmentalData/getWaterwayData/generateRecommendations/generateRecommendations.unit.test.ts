import { describe, expect, test } from "bun:test";
import { generateRecommendations } from "./generateRecommendations";
import { WaterwayFeature } from "../types";

describe("generateRecommendations", () => {
  test("returns Floodway recommendations when Floodway feature in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    expect(result).toContain(
      "Floodway Overlay applies - most development prohibited to protect waterway conveyance"
    );
    expect(result).toContain(
      "Consult with waterway management authority (e.g., Melbourne Water)"
    );
    expect(result).toContain(
      "Development must not increase flood risk or obstruct floodway"
    );
    expect(result).toContain(
      "Maintain riparian vegetation and waterway buffers"
    );
    expect(result).toContain(
      "Implement water sensitive urban design (WSUD) principles"
    );
    expect(result).toContain(
      "Prevent stormwater pollution and erosion during construction"
    );
  });

  test("returns PAO recommendations when Waterway Reservation feature in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway Reservation",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    expect(result).toContain(
      "Public Acquisition Overlay for waterway - land may be acquired for waterway purposes"
    );
    expect(result).toContain(
      "Consult with the acquiring authority before undertaking development"
    );
    expect(result).toContain(
      "Maintain riparian vegetation and waterway buffers"
    );
  });

  test("returns combined recommendations when both Floodway and PAO in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Waterway Reservation",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    expect(result).toContain(
      "Floodway Overlay applies - most development prohibited to protect waterway conveyance"
    );
    expect(result).toContain(
      "Public Acquisition Overlay for waterway - land may be acquired for waterway purposes"
    );
    expect(result.length).toBeGreaterThan(5);
  });

  test("returns general waterway recommendations for other features in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Wetland",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    expect(result).toContain(
      "Maintain riparian vegetation and waterway buffers"
    );
    expect(result).toContain(
      "Implement water sensitive urban design (WSUD) principles"
    );
    expect(result).toContain(
      "Prevent stormwater pollution and erosion during construction"
    );
  });

  test("returns HIGH level recommendations for nearby waterways", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 30,
        inBuffer: false,
      },
    ];

    const result = generateRecommendations({ level: "HIGH", features });

    expect(result).toContain(
      "Property near waterway - implement setbacks and buffer zones"
    );
    expect(result).toContain(
      "Protect water quality through appropriate stormwater management"
    );
    expect(result).toContain(
      "Consider waterway health in landscape design"
    );
    expect(result.length).toBe(3);
  });

  test("returns MODERATE level recommendations for moderately nearby waterways", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "River",
        distanceMeters: 75,
        inBuffer: false,
      },
    ];

    const result = generateRecommendations({ level: "MODERATE", features });

    expect(result).toContain(
      "Property near waterway - implement setbacks and buffer zones"
    );
    expect(result).toContain(
      "Protect water quality through appropriate stormwater management"
    );
    expect(result).toContain(
      "Consider waterway health in landscape design"
    );
    expect(result.length).toBe(3);
  });

  test("returns LOW level recommendations for distant waterways", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 150,
        inBuffer: false,
      },
    ];

    const result = generateRecommendations({ level: "LOW", features });

    expect(result).toContain("No significant waterway constraints identified");
    expect(result).toContain("Standard stormwater management practices apply");
    expect(result.length).toBe(2);
  });

  test("returns MINIMAL level recommendations when no features", () => {
    const features: WaterwayFeature[] = [];

    const result = generateRecommendations({ level: "MINIMAL", features });

    expect(result).toContain("No significant waterway constraints identified");
    expect(result).toContain("Standard stormwater management practices apply");
    expect(result.length).toBe(2);
  });

  test("ignores non-buffer features when buffer features exist", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Creek",
        distanceMeters: 30,
        inBuffer: false,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    // Should get buffer-specific recommendations, not HIGH level ones
    expect(result).toContain(
      "Floodway Overlay applies - most development prohibited to protect waterway conveyance"
    );
    expect(result).not.toContain(
      "Property near waterway - implement setbacks and buffer zones"
    );
  });

  test("handles multiple Floodway features in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    // Should not duplicate recommendations
    const floodwayRecs = result.filter(r =>
      r.includes("Floodway Overlay applies")
    );
    expect(floodwayRecs.length).toBe(1);
  });

  test("handles multiple PAO features in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway Reservation",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Waterway Reservation",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    // Should not duplicate recommendations
    const paoRecs = result.filter(r =>
      r.includes("Public Acquisition Overlay")
    );
    expect(paoRecs.length).toBe(1);
  });

  test("returns only standard recommendations for MINIMAL with features far away", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "River",
        distanceMeters: 500,
        inBuffer: false,
      },
    ];

    const result = generateRecommendations({ level: "MINIMAL", features });

    expect(result).toContain("No significant waterway constraints identified");
    expect(result).toContain("Standard stormwater management practices apply");
    expect(result.length).toBe(2);
  });

  test("handles mixed feature types in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Wetland",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateRecommendations({ level: "VERY_HIGH", features });

    expect(result).toContain(
      "Floodway Overlay applies - most development prohibited to protect waterway conveyance"
    );
    expect(result).toContain(
      "Maintain riparian vegetation and waterway buffers"
    );
  });
});
