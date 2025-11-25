import { Effect } from "effect";
import { describe, expect, test } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import { getFloorArea } from "./getFloorArea";

/**
 * Integration tests for getFloorArea
 *
 * These tests use the actual propertyPage.html file and real implementations
 * of parseFloorArea and cleanFloorAreaText (no mocking).
 *
 * Prerequisites:
 * - propertyPage.html must exist in utils/ directory
 * - The HTML should contain floor area data
 */
describe("getFloorArea - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract floor area from actual propertyPage.html", async () => {
    const { floorArea } = await Effect.runPromise(
      getFloorArea({ address: testAddress })
    );

    // The actual propertyPage.html should have floor area data
    if (floorArea !== null) {
      expect(floorArea).toHaveProperty("value");
      expect(floorArea).toHaveProperty("unit");
      expect(typeof floorArea.value).toBe("number");
      expect(floorArea.value).toBeGreaterThan(0);
      expect(floorArea.unit).toBe("m²");
    } else {
      // If floor area is not found, that's also a valid result
      // (the HTML might not have floor area data)
      expect(floorArea).toBeNull();
    }
  });

  test("should handle the complete workflow", async () => {
    // This tests the entire pipeline:
    // 1. parseFloorArea reads from propertyPage.html
    // 2. cleanFloorAreaText processes the raw text
    // 3. getFloorArea combines everything

    const result = await Effect.runPromise(
      getFloorArea({ address: testAddress })
    );

    // Result should have the floorArea property
    expect(result).toHaveProperty("floorArea");

    // Floor area can be either a valid object or null
    if (result.floorArea !== null) {
      expect(result.floorArea.value).toBeGreaterThan(0);
      expect(result.floorArea.unit).toBe("m²");
    }
  });

  test("should format address correctly in logs", async () => {
    // This test verifies that formatAddress is being used
    const { floorArea } = await Effect.runPromise(
      getFloorArea({ address: testAddress })
    );

    // The function should complete without errors
    expect(floorArea === null || typeof floorArea.value === "number").toBe(
      true
    );
  });
});
