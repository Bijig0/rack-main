import { describe, it, expect } from "bun:test";
import { getStormwaterData } from "./getStormwaterData";
import { Address } from "../../../../../../../shared/types";

describe("getStormwaterData - Integration Tests", () => {
  // Melbourne CBD address - should have good infrastructure
  const melbourneCBDAddress: Address = {
    addressLine: "1 Flinders Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  // Suburban address - variable infrastructure
  const suburbanAddress: Address = {
    addressLine: "Melbourne Cricket Ground",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3002",
  };

  // Regional address - potentially less infrastructure
  const regionalAddress: Address = {
    addressLine: "50 Welsford Street",
    suburb: "Shepparton",
    state: "VIC",
    postcode: "3630",
  };

  it("should return valid stormwater data for Melbourne CBD", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    expect(stormwaterData).toBeDefined();
    expect(stormwaterData.stormwaterRiskLevel).toBeDefined();
    expect(["LOW", "MODERATE", "HIGH", "VERY_HIGH"]).toContain(
      stormwaterData.stormwaterRiskLevel
    );
    expect(typeof stormwaterData.hasStormwaterDrainage).toBe("boolean");
    expect(stormwaterData.description).toBeTruthy();
    expect(Array.isArray(stormwaterData.recommendations)).toBe(true);
    expect(stormwaterData.recommendations.length).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for API calls

  it("should return valid stormwater data for suburban address", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: suburbanAddress,
      bufferMeters: 3000,
    });

    expect(stormwaterData).toBeDefined();
    expect(stormwaterData.stormwaterRiskLevel).toBeDefined();
    expect(stormwaterData.description).toBeTruthy();
    expect(Array.isArray(stormwaterData.nearbyRetardingBasins)).toBe(true);
  }, 30000);

  it("should return valid stormwater data for regional address", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: regionalAddress,
      bufferMeters: 3000,
    });

    expect(stormwaterData).toBeDefined();
    expect(stormwaterData.stormwaterRiskLevel).toBeDefined();
    expect(stormwaterData.description).toBeTruthy();
    expect(Array.isArray(stormwaterData.recommendations)).toBe(true);
  }, 30000);

  it("should respect buffer parameter", async () => {
    const result1 = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 1000,
    });

    const result2 = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 5000,
    });

    // Larger buffer should find same or more basins
    expect(result2.stormwaterData.nearbyRetardingBasins.length).toBeGreaterThanOrEqual(
      result1.stormwaterData.nearbyRetardingBasins.length
    );
  }, 45000);

  it("should limit retarding basins to 10 maximum", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 10000, // Large buffer to potentially find many basins
    });

    expect(stormwaterData.nearbyRetardingBasins.length).toBeLessThanOrEqual(10);
  }, 30000);

  it("should include drainage catchment when available", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    if (stormwaterData.drainageCatchment) {
      expect(stormwaterData.drainageCatchment.name).toBeTruthy();
      expect(stormwaterData.drainageCatchment.area).toBeGreaterThan(0);
      expect(stormwaterData.drainageCatchment.waterway).toBeTruthy();
    }
  }, 30000);

  it("should sort retarding basins by distance", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 5000,
    });

    const basins = stormwaterData.nearbyRetardingBasins;
    if (basins.length > 1) {
      for (let i = 1; i < basins.length; i++) {
        expect(basins[i].distance).toBeGreaterThanOrEqual(basins[i - 1].distance);
      }
    }
  }, 30000);

  it("should include all required properties in retarding basins", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 5000,
    });

    stormwaterData.nearbyRetardingBasins.forEach((basin) => {
      expect(basin.name).toBeTruthy();
      expect(typeof basin.distance).toBe("number");
      expect(basin.distance).toBeGreaterThanOrEqual(0);
      expect(basin.type).toBeTruthy();
      // capacity and owner are optional
    });
  }, 30000);

  it("should provide risk-appropriate recommendations", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    if (stormwaterData.stormwaterRiskLevel === "VERY_HIGH") {
      expect(
        stormwaterData.recommendations.some((r) => r.includes("CRITICAL"))
      ).toBe(true);
    }

    if (stormwaterData.stormwaterRiskLevel === "LOW") {
      expect(
        stormwaterData.recommendations.some((r) => r.includes("excellent"))
      ).toBe(true);
    }
  }, 30000);

  it("should set hasStormwaterDrainage correctly", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    // Should have drainage if catchment identified OR basins nearby
    const shouldHaveDrainage =
      stormwaterData.drainageCatchment !== undefined ||
      stormwaterData.nearbyRetardingBasins.length > 0;

    expect(stormwaterData.hasStormwaterDrainage).toBe(shouldHaveDrainage);
  }, 30000);

  it("should handle addresses with no nearby infrastructure gracefully", async () => {
    // Use a very small buffer to simulate no infrastructure
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 10, // Very small buffer
    });

    expect(stormwaterData).toBeDefined();
    expect(stormwaterData.description).toBeTruthy();
    expect(stormwaterData.recommendations.length).toBeGreaterThan(0);
  }, 30000);

  it("should include waterway information in catchment", async () => {
    const { stormwaterData } = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    if (stormwaterData.drainageCatchment) {
      expect(stormwaterData.drainageCatchment.waterway).toBeTruthy();
      expect(
        stormwaterData.recommendations.some((r) =>
          r.includes(stormwaterData.drainageCatchment!.waterway)
        )
      ).toBe(true);
    }
  }, 30000);

  it("should provide different risk assessments for different locations", async () => {
    const result1 = await getStormwaterData({
      address: melbourneCBDAddress,
      bufferMeters: 3000,
    });

    const result2 = await getStormwaterData({
      address: regionalAddress,
      bufferMeters: 3000,
    });

    // Results should be different (different infrastructure)
    // Either different risk levels OR different number of basins
    const isDifferent =
      result1.stormwaterData.stormwaterRiskLevel !==
        result2.stormwaterData.stormwaterRiskLevel ||
      result1.stormwaterData.nearbyRetardingBasins.length !==
        result2.stormwaterData.nearbyRetardingBasins.length;

    expect(isDifferent).toBe(true);
  }, 45000);
});
