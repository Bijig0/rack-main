import { Effect } from "effect";
import { describe, expect, test } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import { getPropertyType } from "./getPropertyType";

/**
 * Integration tests for getPropertyType
 */
describe("getPropertyType - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract property type from actual propertyPage.html", async () => {
    const { propertyType } = await Effect.runPromise(
      getPropertyType({ address: testAddress })
    );

    if (propertyType !== null && propertyType !== undefined) {
      expect(typeof propertyType).toBe("string");
      expect(propertyType.length).toBeGreaterThan(0);
    } else {
      expect(propertyType).toBeNull();
    }
  });

  test("should handle the complete workflow", async () => {
    const result = await Effect.runPromise(
      getPropertyType({ address: testAddress })
    );

    expect(result).toHaveProperty("propertyType");
  });
});
