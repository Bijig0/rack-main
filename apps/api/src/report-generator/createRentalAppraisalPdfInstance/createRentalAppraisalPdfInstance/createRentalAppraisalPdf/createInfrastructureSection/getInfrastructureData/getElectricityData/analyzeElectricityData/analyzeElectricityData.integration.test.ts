import { describe, it, expect } from "bun:test";
import { analyzeElectricityData } from "./analyzeElectricityData";
import { InferredElectricityData } from "../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { InferredTransmissionLineData } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

describe("analyzeElectricityData - Integration Tests", () => {
  describe("realistic Melbourne CBD scenario", () => {
    it("should analyze Melbourne CBD property with excellent infrastructure", () => {
      // Realistic data for Melbourne CBD area with multiple substations
      const facilities: InferredElectricityData[] = [
        {
          assetId: "ESS_123",
          featureType: "Electricity",
          featureSubType: "Terminal Substation",
          voltage: "66kV",
          capacity: "150MVA",
          owner: "CitiPower",
          status: "Operational",
          distance: 0.35, // 350m
          coordinates: { lat: -37.8145, lon: 144.9650 },
        },
        {
          assetId: "ESS_456",
          featureType: "Electricity",
          featureSubType: "Zone Substation",
          voltage: "220kV",
          capacity: "300MVA",
          owner: "CitiPower",
          status: "Operational",
          distance: 0.72, // 720m
          coordinates: { lat: -37.8160, lon: 144.9680 },
        },
        {
          assetId: "EPS_789",
          featureType: "Power Station",
          featureSubType: "Distribution",
          voltage: "66kV",
          owner: "AusNet Services",
          status: "Operational",
          distance: 1.15, // 1.15km
          coordinates: { lat: -37.8190, lon: 144.9700 },
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          id: "TL_001",
          name: "Melbourne CBD Ring Main",
          description: "66kV Distribution",
          featureType: "Transmission Line",
          class: "Overhead",
          operationalStatus: "Operational",
          state: "VIC",
          capacityKv: 66,
          length: { measurement: 2500, unit: "m" },
          distance: { measurement: 450, unit: "m" },
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8136,
        propertyLon: 144.9631,
      });

      // Verify excellent access
      expect(result.accessLevel).toBe("EXCELLENT");
      expect(result.hasReliableAccess).toBe(true);
      expect(result.facilityCount).toBe(3);

      // Verify substation details
      expect(result.nearestSubstation).toBeDefined();
      expect(result.nearestSubstation?.distance).toBe(0.35);
      expect(result.nearestSubstation?.voltage).toBe("66kV");
      expect(result.nearestSubstation?.capacity).toBe("150MVA");

      // Verify low risk from transmission lines
      expect(result.transmissionLineRisk).toBe("LOW");
      expect(result.emfExposure).toBe("NEGLIGIBLE");

      // Verify high network redundancy
      expect(result.networkRedundancy).toBeGreaterThan(70);

      // Verify nearest transmission line
      expect(result.nearestTransmissionLine).toBeDefined();
      expect(result.nearestTransmissionLine?.distance).toBe(450);
      expect(result.nearestTransmissionLine?.capacityKv).toBe(66);

      // Verify description content
      expect(result.description).toContain("Excellent electricity access");
      expect(result.description).toContain("3 nearby energy facilities");
      expect(result.description).toContain("350m away");

      // Verify positive recommendations
      expect(result.recommendations).toContain(
        "Property has excellent access to reliable electricity infrastructure"
      );
      expect(result.recommendations).toContain(
        "Suitable for high electricity demand uses (commercial, industrial, data centers)"
      );
    });
  });

  describe("realistic suburban Melbourne scenario", () => {
    it("should analyze suburban property with good infrastructure but nearby transmission line", () => {
      // Realistic data for outer Melbourne suburb
      const facilities: InferredElectricityData[] = [
        {
          assetId: "ESS_890",
          featureType: "Electricity",
          featureSubType: "Zone Substation",
          voltage: "66kV",
          capacity: "80MVA",
          owner: "AusNet Services",
          status: "Operational",
          distance: 1.2, // 1.2km
          coordinates: { lat: -37.8500, lon: 145.1000 },
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          id: "TL_500",
          name: "Yallourn-Thomastown 500kV",
          description: "High Voltage Transmission",
          featureType: "Transmission Line",
          class: "Overhead",
          operationalStatus: "Operational",
          state: "VIC",
          capacityKv: 500,
          length: { measurement: 85000, unit: "m" },
          distance: { measurement: 85, unit: "m" }, // 85m - moderate concern
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -37.8475,
        propertyLon: 145.0950,
      });

      // Verify access level
      expect(result.accessLevel).toBe("GOOD");
      expect(result.hasReliableAccess).toBe(true);

      // Verify transmission line risk
      expect(result.transmissionLineRisk).toBe("HIGH"); // High voltage within 100m
      expect(result.emfExposure).toBe("MODERATE"); // 500kV at 85m

      // Verify critical recommendations present
      expect(result.recommendations).toContain(
        "High voltage transmission line nearby - check easement restrictions"
      );
      expect(result.recommendations).toContain(
        "Consider EMF assessment for sensitive uses (childcare, healthcare)"
      );

      // Verify description mentions the concern
      expect(result.description).toContain("500kV");
      expect(result.description).toContain("85m");
    });
  });

  describe("realistic regional Victoria scenario", () => {
    it("should analyze regional property with limited infrastructure", () => {
      // Realistic data for regional area with distant infrastructure
      const facilities: InferredElectricityData[] = [
        {
          assetId: "ESS_999",
          featureType: "Electricity",
          featureSubType: "Distribution Substation",
          voltage: "22kV",
          capacity: "10MVA",
          owner: "Powercor",
          status: "Operational",
          distance: 4.5, // 4.5km - adequate but not close
          coordinates: { lat: -36.7500, lon: 144.2800 },
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          id: "TL_220",
          name: "Regional Distribution Line",
          featureType: "Transmission Line",
          class: "Overhead",
          operationalStatus: "Operational",
          state: "VIC",
          capacityKv: 22,
          distance: { measurement: 1200, unit: "m" }, // 1.2km away
        },
      ];

      const result = analyzeElectricityData({
        nearbyEnergyFacilities: facilities,
        electricityTransmissionLines: lines,
        propertyLat: -36.7350,
        propertyLon: 144.2650,
      });

      // Verify adequate but limited access
      expect(result.accessLevel).toBe("ADEQUATE");
      expect(result.hasReliableAccess).toBe(false);
      expect(result.facilityCount).toBe(1);

      // Verify minimal transmission line risk
      expect(result.transmissionLineRisk).toBe("MINIMAL");
      expect(result.emfExposure).toBe("NEGLIGIBLE");

      // Verify low network redundancy
      expect(result.networkRedundancy).toBeLessThanOrEqual(30);

      // Verify appropriate recommendations
      expect(result.recommendations).toContain(
        "Adequate electricity infrastructure for residential and light commercial use"
      );
      expect(result.recommendations).toContain(
        "Consult electricity distributor for high-demand developments"
      );
    });
  });

  describe("worst case scenario - high voltage line very close", () => {
    it("should analyze property with VERY_HIGH risk from nearby 330kV line", () => {
      const facilities: InferredElectricityData[] = [
        {
          featureType: "Substation",
          distance: 0.8,
          voltage: "66kV",
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          id: "TL_HV",
          name: "Major Transmission Line",
          capacityKv: 330,
          distance: { measurement: 22, unit: "m" }, // Very close!
          operationalStatus: "Operational",
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

      // Verify critical warnings in recommendations
      expect(result.recommendations).toContain(
        "CRITICAL: Very high voltage line proximity - mandatory easement restrictions"
      );
      expect(result.recommendations).toContain(
        "Obtain easement documentation and building restrictions from electricity authority"
      );
      expect(result.recommendations).toContain(
        "Property development severely constrained - building setbacks required"
      );
      expect(result.recommendations).toContain(
        "Professional EMF assessment required before development or occupation"
      );
      expect(result.recommendations).toContain(
        "May significantly impact property value and insurance premiums"
      );

      // EMF recommendations
      expect(result.recommendations).toContain(
        "HIGH EMF exposure - professional assessment mandatory before development"
      );
      expect(result.recommendations).toContain(
        "Property unsuitable for sensitive uses (childcare, schools, hospitals) without mitigation"
      );
    });
  });

  describe("ideal property scenario", () => {
    it("should identify perfect infrastructure setup", () => {
      const facilities: InferredElectricityData[] = [
        {
          featureType: "Terminal Substation",
          distance: 0.25,
          voltage: "66kV",
          capacity: "200MVA",
        },
        {
          featureType: "Zone Substation",
          distance: 0.45,
          voltage: "220kV",
          capacity: "400MVA",
        },
        {
          featureType: "Distribution Substation",
          distance: 0.55,
          voltage: "11kV",
          capacity: "20MVA",
        },
      ];

      const lines: InferredTransmissionLineData[] = [
        {
          distance: { measurement: 800, unit: "m" },
          capacityKv: 66,
        },
        {
          distance: { measurement: 1000, unit: "m" },
          capacityKv: 220,
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
      expect(result.transmissionLineRisk).toBe("MINIMAL");
      expect(result.emfExposure).toBe("NEGLIGIBLE");
      expect(result.networkRedundancy).toBeGreaterThanOrEqual(90);

      // Should have the best possible recommendations
      expect(result.recommendations).toContain(
        "Excellent electricity infrastructure with no significant constraints"
      );
      expect(result.recommendations).toContain(
        "Property well-suited for any electricity-dependent development"
      );
    });
  });

  describe("no infrastructure scenario", () => {
    it("should handle complete absence of electricity infrastructure", () => {
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

      // Should recommend alternative solutions
      expect(result.recommendations).toContain(
        "Limited electricity infrastructure - consult distributor before purchase"
      );
      expect(result.recommendations).toContain(
        "May require significant infrastructure upgrades for development"
      );
      expect(result.recommendations).toContain(
        "Consider alternative energy sources (solar, battery storage)"
      );
      expect(result.recommendations).toContain(
        "Low network redundancy - consider backup power systems (UPS, generators)"
      );
    });
  });
});

// Manual test if run directly
if (import.meta.main) {
  console.log("\n=== Manual Test: Melbourne CBD Property ===\n");

  const facilities: InferredElectricityData[] = [
    {
      featureType: "Terminal Substation",
      featureSubType: "Zone Substation",
      voltage: "66kV",
      capacity: "150MVA",
      owner: "CitiPower",
      distance: 0.35,
    },
    {
      featureType: "Power Station",
      voltage: "220kV",
      capacity: "300MVA",
      owner: "AusNet Services",
      distance: 0.72,
    },
  ];

  const lines: InferredTransmissionLineData[] = [
    {
      name: "Melbourne CBD Distribution",
      capacityKv: 66,
      distance: { measurement: 450, unit: "m" },
      operationalStatus: "Operational",
    },
  ];

  const analysis = analyzeElectricityData({
    nearbyEnergyFacilities: facilities,
    electricityTransmissionLines: lines,
    propertyLat: -37.8136,
    propertyLon: 144.9631,
  });

  console.log("Analysis Results:");
  console.log(JSON.stringify(analysis, null, 2));
}
