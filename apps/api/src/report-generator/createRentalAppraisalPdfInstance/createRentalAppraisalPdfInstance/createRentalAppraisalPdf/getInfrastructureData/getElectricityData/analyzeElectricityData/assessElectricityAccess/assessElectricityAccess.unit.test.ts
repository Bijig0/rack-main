import { describe, it, expect } from "bun:test";
import { assessElectricityAccess } from "./assessElectricityAccess";
import { InferredElectricityData } from "../../getElectricityTransmissionLines/createElectricityResponseSchema/types";

describe("assessElectricityAccess", () => {
  describe("EXCELLENT classification", () => {
    it("should return EXCELLENT when substation is within 500m", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.4, // 400m
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("EXCELLENT");
    });

    it("should return EXCELLENT when substation is exactly at 500m", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.5, // 500m
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("EXCELLENT");
    });

    it("should return EXCELLENT when multiple facilities within 1km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.8, // 800m
          featureType: "power station",
        },
        {
          distance: 0.9, // 900m
          featureType: "transformer",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("EXCELLENT");
    });

    it("should return EXCELLENT with substation (case insensitive in featureSubType)", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.3,
          featureType: "electricity",
          featureSubType: "Terminal Substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("EXCELLENT");
    });
  });

  describe("GOOD classification", () => {
    it("should return GOOD when substation is within 1km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.8, // 800m
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("GOOD");
    });

    it("should return GOOD when substation is exactly at 1km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 1.0, // 1km
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("GOOD");
    });

    it("should return GOOD when at least one facility within 2km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 1.5, // 1.5km
          featureType: "power station",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("GOOD");
    });
  });

  describe("ADEQUATE classification", () => {
    it("should return ADEQUATE when facilities are within 5km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 3.5, // 3.5km
          featureType: "power station",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("ADEQUATE");
    });

    it("should return ADEQUATE when facility is exactly at 5km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 5.0, // 5km
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("ADEQUATE");
    });
  });

  describe("LIMITED classification", () => {
    it("should return LIMITED when no facilities are present", () => {
      const facilities: InferredElectricityData[] = [];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("LIMITED");
    });

    it("should return LIMITED when all facilities are beyond 5km", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 6.5, // 6.5km
          featureType: "power station",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("LIMITED");
    });

    it("should return LIMITED when facilities have no distance data", () => {
      const facilities: InferredElectricityData[] = [
        {
          featureType: "power station",
          // No distance property
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("LIMITED");
    });
  });

  describe("edge cases", () => {
    it("should handle mixed distance data correctly", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.4,
          featureType: "power station",
        },
        {
          // No distance
          featureType: "transformer",
        },
        {
          distance: 2.0,
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      // GOOD because nearest substation is at 2km (not EXCELLENT)
      expect(result).toBe("GOOD");
    });

    it("should prioritize substation distance over facility count", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.3, // Very close substation
          featureType: "substation",
        },
      ];

      const result = assessElectricityAccess({
        nearbyEnergyFacilities: facilities,
      });

      expect(result).toBe("EXCELLENT");
    });
  });
});
