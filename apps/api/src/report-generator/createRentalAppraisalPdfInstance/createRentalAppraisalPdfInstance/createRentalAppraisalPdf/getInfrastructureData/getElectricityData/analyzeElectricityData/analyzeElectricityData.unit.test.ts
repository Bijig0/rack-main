import { describe, it, expect } from "bun:test";
import { analyzeElectricityData } from "./analyzeElectricityData";
import { InferredElectricityData } from "../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { InferredTransmissionLineData } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

describe("analyzeElectricityData", () => {
  describe("excellent access scenarios", () => {
    it("should analyze excellent access with nearby substation and no transmission line risks", () => {
      const facilities: InferredElectricityData[] = [
        {
          distance: 0.4,
          featureType: "substation",
          voltage: "66kV",
        },
        {
          distance: 0.8,
          featureType: "power station",
          voltage: "220kV",
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 600, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.accessLevel).toBe("EXCELLENT");
      expect(result.hasReliableAccess).toBe(true);
      expect(result.facilityCount).toBe(2);
      expect(result.transmissionLineRisk).toBe("MINIMAL");
      expect(result.emfExposure).toBe("NEGLIGIBLE");
      expect(result.networkRedundancy).toBeGreaterThan(60);
      expect(result.nearestSubstation).toBeDefined();
      expect(result.nearestSubstation?.distance).toBe(0.4);
      expect(result.nearestTransmissionLine).toBeDefined();
      expect(result.nearestTransmissionLine?.distance).toBe(600);
      expect(result.description).toContain("Excellent electricity access");
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should identify high network redundancy with multiple facilities", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.3, voltage: "66kV", featureType: "substation" },
        { distance: 0.5, voltage: "220kV", featureType: "transformer" },
        { distance: 0.7, voltage: "500kV", featureType: "power station" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 400, unit: "m" }, capacityKv: 110 },
        { distance: { measurement: 600, unit: "m" }, capacityKv: 275 },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.networkRedundancy).toBe(100);
      expect(result.description).toContain("Very high network redundancy");
    });
  });

  describe("transmission line risk scenarios", () => {
    it("should identify VERY_HIGH risk with close high voltage line", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 25, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.transmissionLineRisk).toBe("VERY_HIGH");
      expect(result.emfExposure).toBe("HIGH");
      expect(result.description).toContain("poses property development constraints");
      expect(result.recommendations).toContain(
        "CRITICAL: Very high voltage line proximity - mandatory easement restrictions"
      );
    });

    it("should identify HIGH risk with high voltage line within 100m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 75, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.transmissionLineRisk).toBe("HIGH");
      expect(result.emfExposure).toBe("MODERATE");
      expect(result.recommendations).toContain(
        "High voltage transmission line nearby - check easement restrictions"
      );
    });

    it("should identify MODERATE risk with line within 100m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 80, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.transmissionLineRisk).toBe("MODERATE");
      expect(result.emfExposure).toBe("LOW"); // 110kV at 80m is LOW, not MODERATE
    });

    it("should identify LOW risk with line 100-500m away", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 250, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.transmissionLineRisk).toBe("LOW");
      expect(result.emfExposure).toBe("LOW");
    });

    it("should identify MINIMAL risk with distant lines", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 750, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.transmissionLineRisk).toBe("MINIMAL");
      expect(result.emfExposure).toBe("NEGLIGIBLE");
    });
  });

  describe("access level scenarios", () => {
    it("should classify GOOD access with substation within 1km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.8, featureType: "substation" },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.accessLevel).toBe("GOOD");
      expect(result.hasReliableAccess).toBe(true);
      expect(result.description).toContain("Good electricity access");
    });

    it("should classify ADEQUATE access with facilities within 5km", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 3.5, featureType: "power station" },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.accessLevel).toBe("ADEQUATE");
      expect(result.hasReliableAccess).toBe(false);
      expect(result.description).toContain("Adequate electricity access");
    });

    it("should classify LIMITED access with no nearby facilities", () => {
      const result = analyzeElectricityData({
        nearbyEnergyFacilities: [],
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.accessLevel).toBe("LIMITED");
      expect(result.hasReliableAccess).toBe(false);
      expect(result.facilityCount).toBe(0);
      expect(result.networkRedundancy).toBe(0);
      expect(result.description).toContain("Limited electricity infrastructure");
      expect(result.recommendations).toContain(
        "Limited electricity infrastructure - consult distributor before purchase"
      );
    });
  });

  describe("EMF exposure scenarios", () => {
    it("should classify HIGH EMF with 330kV line at 45m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 1.0, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 45, unit: "m" },
          capacityKv: 330,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.emfExposure).toBe("HIGH");
      expect(result.description).toContain("HIGH EMF exposure");
      expect(result.recommendations).toContain(
        "HIGH EMF exposure - professional assessment mandatory before development"
      );
    });

    it("should classify MODERATE EMF with 275kV line at 80m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 80, unit: "m" },
          capacityKv: 275,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.emfExposure).toBe("MODERATE");
      expect(result.description).toContain("Moderate EMF exposure");
    });

    it("should classify LOW EMF with lines at 200m", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 200, unit: "m" },
          capacityKv: 110,
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.emfExposure).toBe("LOW");
      expect(result.recommendations).toContain(
        "EMF exposure within normal urban background levels"
      );
    });

    it("should classify NEGLIGIBLE EMF with no transmission lines", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.emfExposure).toBe("NEGLIGIBLE");
    });
  });

  describe("edge cases", () => {
    it("should handle empty data gracefully", () => {
      const result = analyzeElectricityData({
        nearbyEnergyFacilities: [],
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.accessLevel).toBe("LIMITED");
      expect(result.hasReliableAccess).toBe(false);
      expect(result.facilityCount).toBe(0);
      expect(result.transmissionLineRisk).toBe("MINIMAL");
      expect(result.emfExposure).toBe("NEGLIGIBLE");
      expect(result.networkRedundancy).toBe(0);
      expect(result.nearestSubstation).toBeUndefined();
      expect(result.nearestTransmissionLine).toBeUndefined();
      expect(result.description).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should handle facilities without distance data", () => {
      const facilities: InferredElectricityData[] = [
        { featureType: "substation" }, // No distance
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: [],
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.facilityCount).toBe(1);
      expect(result.nearestSubstation).toBeUndefined(); // No distance means it won't be selected
    });

    it("should handle transmission lines without distance data", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { capacityKv: 275 }, // No distance
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.nearestTransmissionLine).toBeUndefined();
      expect(result.transmissionLineRisk).toBe("MINIMAL");
    });

    it("should generate appropriate recommendations for ideal scenario", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.3, voltage: "66kV", featureType: "substation" },
        { distance: 0.5, voltage: "220kV", featureType: "transformer" },
        { distance: 0.7, voltage: "500kV", featureType: "power station" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 600, unit: "m" }, capacityKv: 110 },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.recommendations).toContain(
        "Excellent electricity infrastructure with no significant constraints"
      );
      expect(result.recommendations).toContain(
        "Property well-suited for any electricity-dependent development"
      );
    });

    it("should handle multiple transmission lines and select nearest", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.5, featureType: "substation" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 500, unit: "m" }, capacityKv: 110 },
        { distance: { measurement: 200, unit: "m" }, capacityKv: 275 }, // Nearest
        { distance: { measurement: 800, unit: "m" }, capacityKv: 330 },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.nearestTransmissionLine?.distance).toBe(200);
      expect(result.nearestTransmissionLine?.capacityKv).toBe(275);
    });
  });

  describe("description generation", () => {
    it("should include all key information in description", () => {
      const facilities: InferredElectricityData[] = [
        { distance: 0.4, featureType: "substation", voltage: "66kV" },
        { distance: 0.8, featureType: "power station", voltage: "220kV" },
      ];

      const lines: InferredTransmissionLineData[] = [
        { distance: { measurement: 150, unit: "m" }, capacityKv: 275 },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      expect(result.description).toContain("Excellent electricity access");
      expect(result.description).toContain("2 nearby energy facilities");
      expect(result.description).toContain("400m away");
      expect(result.description).toContain("network redundancy");
    });
  });
});
