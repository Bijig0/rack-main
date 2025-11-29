import { describe, it, expect } from "bun:test";
import { calculateEMFExposure } from "./calculateEMFExposure";
import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

describe("calculateEMFExposure", () => {
  describe("HIGH exposure", () => {
    it("should return HIGH for 275kV line within 50m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 45, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for 330kV line at exactly 50m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 50, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for 500kV line within 50m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 30, unit: "m" },
          capacityKv: 500,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for 221kV line at 49m (just over voltage threshold)", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 49, unit: "m" },
          capacityKv: 221,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });
  });

  describe("MODERATE exposure", () => {
    it("should return MODERATE for 275kV line within 100m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 75, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });

    it("should return MODERATE for 330kV line at exactly 100m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 100, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });

    it("should return MODERATE for 110kV line within 50m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 40, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });

    it("should return MODERATE for 67kV line at exactly 50m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 50, unit: "m" },
          capacityKv: 67,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });
  });

  describe("LOW exposure", () => {
    it("should return LOW for lines between 100-300m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 150, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });

    it("should return LOW for high voltage line at 250m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 250, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });

    it("should return LOW for line at exactly 300m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 300, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });

    it("should return LOW for 66kV line at 51m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 51, unit: "m" },
          capacityKv: 66,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });
  });

  describe("NEGLIGIBLE exposure", () => {
    it("should return NEGLIGIBLE for lines beyond 300m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 500, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("NEGLIGIBLE");
    });

    it("should return NEGLIGIBLE when no lines are present", () => {
      const lines: InferredTransmissionLineData[] = [];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("NEGLIGIBLE");
    });

    it("should return NEGLIGIBLE when lines have no distance data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          capacityKv: 330,
          // No distance
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("NEGLIGIBLE");
    });

    it("should return NEGLIGIBLE for very distant high voltage lines", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 1000, unit: "m" },
          capacityKv: 500,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("NEGLIGIBLE");
    });
  });

  describe("edge cases", () => {
    it("should prioritize line with highest EMF impact when multiple lines present", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 200, unit: "m" },
          capacityKv: 110, // Low impact
        },
        {
          distance: { measurement: 45, unit: "m" },
          capacityKv: 275, // Highest EMF impact
        },
        {
          distance: { measurement: 150, unit: "m" },
          capacityKv: 330, // Moderate impact
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH"); // Based on 45m + 275kV
    });

    it("should handle lines with missing voltage data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 50, unit: "m" },
          // No capacityKv
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("NEGLIGIBLE"); // No voltage = no EMF impact
    });

    it("should handle mixed valid and invalid data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          // No distance
          capacityKv: 330,
        },
        {
          distance: { measurement: 80, unit: "m" },
          capacityKv: 275, // Valid data
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE"); // Based on valid line at 80m + 275kV
    });

    it("should classify 220kV at 50m as MODERATE (not HIGH)", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 50, unit: "m" },
          capacityKv: 220, // Exactly at threshold
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE"); // >220kV required for HIGH
    });

    it("should handle zero distance gracefully", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 0, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      // Should not cause division by zero error
      expect(result).toBe("NEGLIGIBLE");
    });

    it("should prefer closer high voltage line over distant lower voltage", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 60, unit: "m" },
          capacityKv: 66, // Lower voltage but closer
        },
        {
          distance: { measurement: 200, unit: "m" },
          capacityKv: 330, // Higher voltage but further
        },
      ];

      const result = calculateEMFExposure({
        electricityTransmissionLines: lines,
      });

      // EMF impact score: 66/60 = 1.1 vs 330/200 = 1.65
      // Higher voltage at distance has higher impact
      expect(result).toBe("LOW");
    });
  });
});
