import { describe, expect, test, mock } from "bun:test";
import type { Address } from "../../../../../../../shared/types";

// Mock getPlanningZoneData to return various LGA name formats
mock.module("../getPlanningZoneData/getPlanningZoneData", () => ({
  getPlanningZoneData: async ({ address }: { address: Address }) => {
    // Map suburbs to LGA names with various casing to test title case conversion
    const suburbToLga: Record<string, string | null> = {
      Melbourne: "MELBOURNE",
      Kew: "BOROONDARA",
      Geelong: "GREATER GEELONG",
      Frankston: "frankston",
      Preston: "darebin",
      Mornington: "mornington peninsula",
      Ballarat: "BaLlArAt",
      UnknownSuburb: null,
    };

    const lgaName = suburbToLga[address.suburb] ?? null;

    if (lgaName === null) {
      return { planningZoneData: null };
    }

    return {
      planningZoneData: {
        zoneCode: "GRZ1",
        zoneDescription: "General Residential Zone",
        lgaName,
        lgaCode: null,
      },
    };
  },
}));

// Import after mocking
import { getPlanningScheme } from "./getPlanningScheme";

describe("getPlanningScheme", () => {
  test("should return title case planning scheme for uppercase LGA", async () => {
    const address: Address = {
      addressLine: "123 Collins Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Melbourne Planning Scheme");
  });

  test("should return title case planning scheme for another uppercase LGA", async () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Boroondara Planning Scheme");
  });

  test("should return title case planning scheme for multi-word uppercase LGA", async () => {
    const address: Address = {
      addressLine: "123 Moorabool Street",
      suburb: "Geelong",
      state: "VIC",
      postcode: "3220",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Greater Geelong Planning Scheme");
  });

  test("should return title case planning scheme for lowercase LGA", async () => {
    const address: Address = {
      addressLine: "50 Test Street",
      suburb: "Frankston",
      state: "VIC",
      postcode: "3199",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Frankston Planning Scheme");
  });

  test("should return title case planning scheme for another lowercase LGA", async () => {
    const address: Address = {
      addressLine: "456 High Street",
      suburb: "Preston",
      state: "VIC",
      postcode: "3072",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Darebin Planning Scheme");
  });

  test("should return title case planning scheme for multi-word lowercase LGA", async () => {
    const address: Address = {
      addressLine: "50 Main Street",
      suburb: "Mornington",
      state: "VIC",
      postcode: "3931",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Mornington Peninsula Planning Scheme");
  });

  test("should return title case planning scheme for mixed case LGA", async () => {
    const address: Address = {
      addressLine: "50 Sturt Street",
      suburb: "Ballarat",
      state: "VIC",
      postcode: "3350",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBe("Ballarat Planning Scheme");
  });

  test("should return null when LGA cannot be determined", async () => {
    const address: Address = {
      addressLine: "1 Test Road",
      suburb: "UnknownSuburb",
      state: "VIC",
      postcode: "3888",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toBeNull();
  });

  test("result should have all words capitalized (title case)", async () => {
    const address: Address = {
      addressLine: "123 Moorabool Street",
      suburb: "Geelong",
      state: "VIC",
      postcode: "3220",
    };

    const result = await getPlanningScheme({ address });

    // Check each word starts with uppercase and rest is lowercase
    const words = result!.split(" ");
    for (const word of words) {
      const firstChar = word[0];
      const restOfWord = word.slice(1);

      expect(firstChar).toBe(firstChar.toUpperCase());
      expect(restOfWord).toBe(restOfWord.toLowerCase());
    }
  });

  test("result should end with 'Planning Scheme'", async () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = await getPlanningScheme({ address });

    expect(result).toEndWith("Planning Scheme");
  });
});
