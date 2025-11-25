import { describe, it, expect } from "bun:test";
import { analyzeStormwaterRisk } from "./analyzeStormwaterRisk";
import { DrainageCatchment, RetardingBasin } from "../types";

describe("analyzeStormwaterRisk", () => {
  const mockCatchment: DrainageCatchment = {
    name: "Yarra River",
    area: 4000,
    waterway: "Yarra River",
  };

  it("should classify as LOW risk with multiple close basins", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 500,
        capacity: 80,
        type: "Retarding Basin",
        owner: "Melbourne Water",
      },
      {
        name: "Basin 2",
        distance: 900,
        capacity: 60,
        type: "Retarding Basin",
        owner: "Melbourne Water",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("LOW");
    expect(result.description).toContain("Low stormwater risk");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("should classify as LOW risk with one close basin and high capacity", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Large Basin",
        distance: 800,
        capacity: 150,
        type: "Retarding Basin",
        owner: "Melbourne Water",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("LOW");
  });

  it("should classify as MODERATE risk with one basin within 2km", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 1500,
        capacity: 40,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("MODERATE");
    expect(result.description).toContain("Moderate stormwater risk");
  });

  it("should classify as MODERATE risk with two basins within 3km and decent capacity", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 2500,
        capacity: 20,
        type: "Retarding Basin",
      },
      {
        name: "Basin 2",
        distance: 2800,
        capacity: 15,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("MODERATE");
  });

  it("should classify as HIGH risk with one basin within 3km", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Distant Basin",
        distance: 2800,
        capacity: 10,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("HIGH");
    expect(result.description).toContain("High stormwater risk");
  });

  it("should classify as HIGH risk with basin between 3-5km away", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Very Distant Basin",
        distance: 4500,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("HIGH");
  });

  it("should classify as VERY_HIGH risk with no nearby basins", () => {
    const basins: RetardingBasin[] = [];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("VERY_HIGH");
    expect(result.description).toContain("Very high stormwater risk");
    expect(result.recommendations).toContain(
      "CRITICAL: Minimal flood protection - comprehensive mitigation essential"
    );
  });

  it("should classify as VERY_HIGH risk with only very distant basins", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Far Basin",
        distance: 8000,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBe("VERY_HIGH");
  });

  it("should handle undefined drainage catchment", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 1000,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: undefined,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("should handle basins without capacity data", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin No Capacity",
        distance: 500,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.riskLevel).toBeDefined();
    expect(result.description).toBeDefined();
  });

  it("should include total capacity in description when available", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 500,
        capacity: 80,
        type: "Retarding Basin",
      },
      {
        name: "Basin 2",
        distance: 700,
        capacity: 60,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.description).toContain("140ML");
  });

  it("should include nearest basin distance in description", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Nearest Basin",
        distance: 750,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.description).toContain("750m");
  });

  it("should include catchment name in description when available", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin",
        distance: 1000,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.description).toContain("Yarra River");
  });

  it("should provide appropriate recommendations for LOW risk", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Basin 1",
        distance: 500,
        capacity: 100,
        type: "Retarding Basin",
      },
      {
        name: "Basin 2",
        distance: 800,
        capacity: 50,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.recommendations).toContain(
      "Property benefits from excellent stormwater management infrastructure"
    );
    expect(result.recommendations.some((r) => r.includes("flood protection"))).toBe(true);
  });

  it("should provide flood mitigation recommendations for HIGH risk", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Distant Basin",
        distance: 4000,
        type: "Retarding Basin",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.recommendations.some((r) => r.includes("flood"))).toBe(true);
    expect(result.recommendations.some((r) => r.includes("Melbourne Water"))).toBe(true);
  });

  it("should provide critical recommendations for VERY_HIGH risk", () => {
    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: [],
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.recommendations).toContain(
      "CRITICAL: Minimal flood protection - comprehensive mitigation essential"
    );
    expect(result.recommendations.some((r) => r.includes("LSIO"))).toBe(true);
    expect(result.recommendations.some((r) => r.includes("insurance"))).toBe(true);
  });

  it("should mention basin owner in recommendations when available", () => {
    const basins: RetardingBasin[] = [
      {
        name: "Council Basin",
        distance: 1000,
        type: "Retarding Basin",
        owner: "City of Melbourne",
      },
    ];

    const result = analyzeStormwaterRisk({
      drainageCatchment: mockCatchment,
      retardingBasins: basins,
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.recommendations.some((r) => r.includes("City of Melbourne"))).toBe(true);
  });

  it("should mention large catchment in recommendations", () => {
    const largeCatchment: DrainageCatchment = {
      name: "Large Catchment",
      area: 6000,
      waterway: "Major River",
    };

    const result = analyzeStormwaterRisk({
      drainageCatchment: largeCatchment,
      retardingBasins: [],
      lat: -37.8136,
      lon: 144.9631,
    });

    expect(result.recommendations.some((r) => r.includes("large catchment"))).toBe(true);
  });
});
