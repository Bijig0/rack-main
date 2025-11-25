import { describe, expect, test } from "bun:test";
import { generateDescription } from "./generateDescription";
import { WaterwayFeature } from "../types";

describe("generateDescription", () => {
  test("returns VERY_HIGH description with single feature in buffer", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", features });
    expect(result).toBe(
      "Very high waterway significance - property is within waterway buffer or Floodway zone. Significant waterway constraints apply."
    );
  });

  test("returns VERY_HIGH description with multiple features in buffer", () => {
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

    const result = generateDescription({ level: "VERY_HIGH", features });
    expect(result).toBe(
      "Very high waterway significance - property is within waterway buffer or Floodway, Waterway Reservation zone. Significant waterway constraints apply."
    );
  });

  test("returns HIGH description with feature at 30m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 30,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "HIGH", features });
    expect(result).toBe(
      "High waterway significance - property is within 30m of Creek. Waterway setbacks and protections apply."
    );
  });

  test("returns HIGH description with feature at 49.6m (rounds to 50m)", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "River",
        distanceMeters: 49.6,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "HIGH", features });
    expect(result).toBe(
      "High waterway significance - property is within 50m of River. Waterway setbacks and protections apply."
    );
  });

  test("returns MODERATE description with feature at 75m", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Waterway",
        distanceMeters: 75,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "MODERATE", features });
    expect(result).toBe(
      "Moderate waterway significance - property is 75m from Waterway. Consider waterway impacts."
    );
  });

  test("returns MODERATE description with feature at 99.4m (rounds to 99m)", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Wetland",
        distanceMeters: 99.4,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "MODERATE", features });
    expect(result).toBe(
      "Moderate waterway significance - property is 99m from Wetland. Consider waterway impacts."
    );
  });

  test("returns LOW description", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        distanceMeters: 150,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "LOW", features });
    expect(result).toBe(
      "Low waterway significance - property has some proximity to waterways."
    );
  });

  test("returns MINIMAL description with no features", () => {
    const features: WaterwayFeature[] = [];

    const result = generateDescription({ level: "MINIMAL", features });
    expect(result).toBe(
      "Minimal waterway significance - no identified waterway constraints."
    );
  });

  test("returns MINIMAL description even with distant features", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "River",
        distanceMeters: 500,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "MINIMAL", features });
    expect(result).toBe(
      "Minimal waterway significance - no identified waterway constraints."
    );
  });

  test("handles features with optional name property", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Creek",
        name: "Merri Creek",
        distanceMeters: 40,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "HIGH", features });
    expect(result).toBe(
      "High waterway significance - property is within 40m of Creek. Waterway setbacks and protections apply."
    );
  });

  test("uses first feature for HIGH level when multiple features present", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 25,
        inBuffer: false,
      },
      {
        featureType: "Creek",
        distanceMeters: 80,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "HIGH", features });
    expect(result).toBe(
      "High waterway significance - property is within 25m of Floodway. Waterway setbacks and protections apply."
    );
  });

  test("uses first feature for MODERATE level when multiple features present", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Wetland",
        distanceMeters: 65,
        inBuffer: false,
      },
      {
        featureType: "River",
        distanceMeters: 120,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "MODERATE", features });
    expect(result).toBe(
      "Moderate waterway significance - property is 65m from Wetland. Consider waterway impacts."
    );
  });

  test("handles mixed in-buffer and out-of-buffer features for VERY_HIGH", () => {
    const features: WaterwayFeature[] = [
      {
        featureType: "Floodway",
        distanceMeters: 0,
        inBuffer: true,
      },
      {
        featureType: "Creek",
        distanceMeters: 150,
        inBuffer: false,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", features });
    expect(result).toBe(
      "Very high waterway significance - property is within waterway buffer or Floodway zone. Significant waterway constraints apply."
    );
  });

  test("handles three different feature types in buffer", () => {
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
      {
        featureType: "Waterway Reservation",
        distanceMeters: 0,
        inBuffer: true,
      },
    ];

    const result = generateDescription({ level: "VERY_HIGH", features });
    expect(result).toBe(
      "Very high waterway significance - property is within waterway buffer or Floodway, Wetland, Waterway Reservation zone. Significant waterway constraints apply."
    );
  });
});
