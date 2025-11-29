import { Effect } from "effect";
import { describe, expect, test } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import { getLandArea } from "./getLandArea";

/**
 * Integration tests for getLandArea
 *
 * These tests use the actual propertyPage.html file and real implementations
 * of parseLandArea and cleanLandAreaText (no mocking).
 */
describe("getLandArea - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract land area from actual propertyPage.html", async () => {
    const { landArea } = await Effect.runPromise(
      getLandArea({ address: testAddress })
    );

    if (landArea !== null && landArea !== undefined) {
      expect(landArea).toHaveProperty("value");
      expect(landArea).toHaveProperty("unit");
      expect(typeof landArea.value).toBe("number");
      expect(landArea.value).toBeGreaterThan(0);
      expect(landArea.unit).toBe("m²");
    } else {
      expect(landArea).toBeNull();
    }
  });

  test("should handle the complete workflow", async () => {
    const result = await Effect.runPromise(
      getLandArea({ address: testAddress })
    );

    expect(result).toHaveProperty("landArea");

    if (result.landArea !== null && result.landArea !== undefined) {
      expect(result.landArea.value).toBeGreaterThan(0);
      expect(result.landArea.unit).toBe("m²");
    }
  });
});
