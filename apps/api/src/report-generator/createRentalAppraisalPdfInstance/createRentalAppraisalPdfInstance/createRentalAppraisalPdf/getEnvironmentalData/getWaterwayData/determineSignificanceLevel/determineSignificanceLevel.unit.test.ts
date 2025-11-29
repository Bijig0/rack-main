import { describe, expect, test } from "bun:test";
import { determineSignificanceLevel } from "./determineSignificanceLevel";
import { WaterwayFeature } from "../types";

describe("determineSignificanceLevel", () => {
  test("returns VERY_HIGH when property is in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns VERY_HIGH when in buffer even with no features", () => {
    const features: WaterwayFeature[] = [];

    const result = determineSignificanceLevel({ features, inBuffer: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("returns HIGH when feature is within 50m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway",
        distanceMeters: 30,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("HIGH");
  });

  test("returns HIGH when feature is exactly at 49m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 49,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("HIGH");
  });

  test("returns MODERATE when feature is between 50m and 100m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway Reservation",
        distanceMeters: 75,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when feature is exactly at 50m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "River",
        distanceMeters: 50,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MODERATE");
  });

  test("returns MODERATE when feature is exactly at 99m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Wetland",
        distanceMeters: 99,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MODERATE");
  });

  test("returns LOW when feature is between 100m and 200m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway",
        distanceMeters: 150,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("LOW");
  });

  test("returns LOW when feature is exactly at 100m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 100,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("LOW");
  });

  test("returns LOW when feature is exactly at 199m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 199,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("LOW");
  });

  test("returns MINIMAL when feature is beyond 200m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway",
        distanceMeters: 250,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MINIMAL");
  });

  test("returns MINIMAL when no features are provided", () => {
    const features: WaterwayFeature[] = [];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MINIMAL");
  });

  test("prioritizes VERY_HIGH over closer non-buffer features", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway",
        distanceMeters: 10, // Very close but not in buffer
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: true });
    expect(result).toBe("VERY_HIGH");
  });

  test("uses closest feature when multiple features present", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Wetland",
        distanceMeters: 40, // Closest - should determine HIGH
        inBuffer: false,
      },
      {
        featureType: "River",
        distanceMeters: 120,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("HIGH");
  });

  test("handles multiple features with mixed distances", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 80, // Closest - should determine MODERATE
        inBuffer: false,
      },
      {
        featureType: "Floodway",
        distanceMeters: 150,
        inBuffer: false,
      },
      {
        featureType: "Wetland",
        distanceMeters: 220,
        inBuffer: false,
      },
    ];

    const result = determineSignificanceLevel({ features, inBuffer: false });
    expect(result).toBe("MODERATE");
  });
});
