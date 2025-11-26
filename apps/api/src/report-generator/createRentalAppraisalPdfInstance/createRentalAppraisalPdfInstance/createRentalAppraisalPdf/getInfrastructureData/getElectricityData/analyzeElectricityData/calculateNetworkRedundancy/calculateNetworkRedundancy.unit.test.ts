import { describe, it, expect } from "bun:test";
import { calculateNetworkRedundancy } from "./calculateNetworkRedundancy";
import { InferredElectricityData } from "../../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

describe("calculateNetworkRedundancy", () => {
  describe("facility count scoring (40% weight)", () => {
    it("should score 0 with no facilities", () => {
      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: [],
        electricityTransmissionLines: [],
      });

      expect(score).toBe(0);
    });

    it("should score 10 with one facility", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 15 (distance >=1km, <2km) = 25
      expect(score).toBe(25);
    });

    it("should score 25 with two facilities", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
        { distance: 2.0, featureType: "power station" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 25 (2 facilities) + 15 (distance >=1km, <2km) = 40
      expect(score).toBe(40);
    });

    it("should score 40 with three or more facilities", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
        { distance: 2.0, featureType: "power station" },
        { distance: 3.0, featureType: "transformer" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 40 (3 facilities) + 15 (distance >=1km, <2km) = 55
      expect(score).toBe(55);
    });
  });

  describe("distance scoring (30% weight)", () => {
    it("should score 30 for facility within 500m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.4, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 30 (distance <500m) = 40
      expect(score).toBe(40);
    });

    it("should score 22 for facility within 1km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.8, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 22 (distance <1km) = 32
      expect(score).toBe(32);
    });

    it("should score 15 for facility within 2km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.5, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 15 (distance <2km) = 25
      expect(score).toBe(25);
    });

    it("should score 8 for facility within 5km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 4.0, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 8 (distance <5km) = 18
      expect(score).toBe(18);
    });

    it("should score 0 for facility beyond 5km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 6.0, featureType: "substation" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 0 (distance >5km) = 10
      expect(score).toBe(10);
    });

    it("should use nearest facility for distance scoring", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.3, featureType: "substation" }, // Nearest
        { distance: 2.0, featureType: "power station" },
        { distance: 4.0, featureType: "transformer" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 40 (3 facilities) + 30 (distance <500m) = 70
      expect(score).toBe(70);
    });
  });

  describe("voltage diversity scoring (20% weight)", () => {
    it("should score 7 with one voltage level", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, voltage: "66kV" },
        { distance: 2.0, voltage: "66kV" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 25 (2 facilities) + 15 (distance >=1km, <2km) + 7 (1 voltage) = 47
      expect(score).toBe(47);
    });

    it("should score 14 with two voltage levels", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, voltage: "66kV" },
        { distance: 2.0, voltage: "220kV" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 25 (2 facilities) + 15 (distance >=1km, <2km) + 14 (2 voltages) = 54
      expect(score).toBe(54);
    });

    it("should score 20 with three or more voltage levels", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, voltage: "66kV" },
        { distance: 2.0, voltage: "220kV" },
        { distance: 3.0, voltage: "500kV" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 40 (3 facilities) + 15 (distance >=1km, <2km) + 20 (3 voltages) = 75
      expect(score).toBe(75);
    });

    it("should ignore facilities without voltage data", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, voltage: "66kV" },
        { distance: 2.0 }, // No voltage
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 25 (2 facilities) + 15 (distance >=1km, <2km) + 7 (1 voltage) = 47
      expect(score).toBe(47);
    });
  });

  describe("transmission line connectivity scoring (10% weight)", () => {
    it("should score 5 with one transmission line", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 500, unit: "m" } },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
      });

      // 10 (1 facility) + 15 (distance >=1km, <2km) + 5 (1 line) = 30
      expect(score).toBe(30);
    });

    it("should score 10 with two or more transmission lines", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 500, unit: "m" } },
        { distance: { measurement: 800, unit: "m" } },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
      });

      // 10 (1 facility) + 15 (distance >=1km, <2km) + 10 (2 lines) = 35
      expect(score).toBe(35);
    });
  });

  describe("comprehensive scenarios", () => {
    it("should calculate perfect score (100) for ideal infrastructure", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.3, voltage: "66kV" },
        { distance: 0.5, voltage: "220kV" },
        { distance: 0.7, voltage: "500kV" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 400, unit: "m" } },
        { distance: { measurement: 600, unit: "m" } },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
      });

      // 40 (3 facilities) + 30 (distance <500m) + 20 (3 voltages) + 10 (2 lines) = 100
      expect(score).toBe(100);
    });

    it("should calculate high score for good infrastructure", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.8, voltage: "66kV" },
        { distance: 1.2, voltage: "220kV" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 500, unit: "m" } },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
      });

      // 25 (2 facilities) + 22 (distance <1km) + 14 (2 voltages) + 5 (1 line) = 66
      expect(score).toBe(66);
    });

    it("should calculate moderate score for adequate infrastructure", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 2.5, voltage: "66kV" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 8 (distance <5km) + 7 (1 voltage) = 25
      expect(score).toBe(25);
    });

    it("should calculate low score for limited infrastructure", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 6.0 }, // No voltage, far away
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 10 (1 facility) + 0 (distance >5km) + 0 (no voltage) = 10
      expect(score).toBe(10);
    });
  });

  describe("edge cases", () => {
    it("should handle facilities with no distance data", () => {
      const facilities: InferredElectricityData[] = [
        { featureType: "substation" }, // No distance
        { voltage: "66kV" }, // No distance
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 25 (2 facilities) + 0 (no valid distance) + 7 (1 voltage) = 32
      expect(score).toBe(32);
    });

    it("should round score to nearest integer", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, voltage: "66kV" },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      expect(Number.isInteger(score)).toBe(true);
    });

    it("should never exceed 100", () => {
      // Even if logic changes, score should be capped
      const facilities: InferredElectricityData[] = [
        { distance: 0.1, voltage: "66kV" },
        { distance: 0.2, voltage: "220kV" },
        { distance: 0.3, voltage: "500kV" },
        { distance: 0.4, voltage: "132kV" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 100, unit: "m" } },
        { distance: { measurement: 200, unit: "m" } },
        { distance: { measurement: 300, unit: "m" } },
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
      });

      expect(score).toBeLessThanOrEqual(100);
    });

    it("should never go below 0", () => {
      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: [],
        electricityTransmissionLines: [],
      });

      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("should handle duplicate voltages correctly", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, voltage: "66kV" },
        { distance: 0.6, voltage: "66kV" }, // Duplicate
        { distance: 0.7, voltage: "66kV" }, // Duplicate
      ];

      const score = calculateNetworkRedundancy({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
      });

      // 40 (3 facilities) + 22 (distance 0.5 <1km, not <500m) + 7 (1 unique voltage) = 69
      expect(score).toBe(69);
    });
  });
});
