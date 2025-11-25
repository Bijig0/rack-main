import { describe, it, expect } from "bun:test";
import { assessTransmissionLineRisk } from "./assessTransmissionLineRisk";
import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

describe("assessTransmissionLineRisk", () => {
  describe("VERY_HIGH risk", () => {
    it("should return VERY_HIGH for high voltage line within 30m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 25, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("VERY_HIGH");
    });

    it("should return VERY_HIGH for 330kV line at 29m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 29, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("VERY_HIGH");
    });

    it("should return VERY_HIGH for 500kV line at 15m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 15, unit: "m" },
          capacityKv: 500,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("VERY_HIGH");
    });
  });

  describe("HIGH risk", () => {
    it("should return HIGH for high voltage line within 100m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 75, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for high voltage line exactly at 99m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 99, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for any line within 30m regardless of voltage", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 20, unit: "m" },
          capacityKv: 66, // Lower voltage
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });

    it("should return HIGH for line at 29m with no voltage data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 29, unit: "m" },
          // No capacityKv
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH");
    });
  });

  describe("MODERATE risk", () => {
    it("should return MODERATE for any line within 100m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 75, unit: "m" },
          capacityKv: 66,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });

    it("should return MODERATE for line exactly at 99m with low voltage", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 99, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });

    it("should return MODERATE for line at 50m with no voltage data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 50, unit: "m" },
          // No capacityKv
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MODERATE");
    });
  });

  describe("LOW risk", () => {
    it("should return LOW for lines between 100m-500m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 250, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });

    it("should return LOW for line exactly at 100m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 100, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });

    it("should return LOW for line exactly at 500m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 500, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW");
    });
  });

  describe("MINIMAL risk", () => {
    it("should return MINIMAL for lines beyond 500m", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 750, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MINIMAL");
    });

    it("should return MINIMAL when no lines are present", () => {
      const lines: InferredTransmissionLineData[] = [];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MINIMAL");
    });

    it("should return MINIMAL when lines have no distance data", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          capacityKv: 275,
          // No distance
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("MINIMAL");
    });
  });

  describe("edge cases", () => {
    it("should use nearest line when multiple lines present", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 200, unit: "m" },
          capacityKv: 110,
        },
        {
          distance: { measurement: 50, unit: "m" },
          capacityKv: 330, // Nearest and high voltage
        },
        {
          distance: { measurement: 300, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH"); // Based on 50m + 330kV
    });

    it("should handle mixed distance data correctly", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 150, unit: "m" },
          capacityKv: 275,
        },
        {
          // No distance
          capacityKv: 330,
        },
        {
          distance: { measurement: 400, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("LOW"); // Based on nearest valid distance (150m)
    });

    it("should correctly classify 220kV as NOT high voltage", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 25, unit: "m" },
          capacityKv: 220, // Exactly at threshold
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("HIGH"); // HIGH because <30m, not VERY_HIGH
    });

    it("should correctly classify 221kV as high voltage", () => {
      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 25, unit: "m" },
          capacityKv: 221, // Just over threshold
        },
      ];

      const result = assessTransmissionLineRisk({
        electricityTransmissionLines: lines,
      });

      expect(result).toBe("VERY_HIGH");
    });
  });
});
