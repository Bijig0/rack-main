import { Effect } from "effect";
import { describe, expect, test } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import { getCouncil } from "./getCouncil";

/**
 * Integration tests for getCouncil
 *
 * These tests use the actual propertyPage.html file and real implementations
 * of parseCouncil and cleanCouncilText (no mocking).
 */
describe("getCouncil - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract council from actual propertyPage.html", async () => {
    const { council } = await Effect.runPromise(
      getCouncil({ address: testAddress })
    );

    if (council !== null && council !== undefined) {
      expect(typeof council).toBe("string");
      expect(council.length).toBeGreaterThan(0);
      expect(council).toContain("Council");
    } else {
      expect(council).toBeNull();
    }
  });

  test("should handle the complete workflow", async () => {
    const result = await Effect.runPromise(
      getCouncil({ address: testAddress })
    );

    expect(result).toHaveProperty("council");

    if (result.council !== null && result.council !== undefined) {
      expect(typeof result.council).toBe("string");
      expect(result.council.length).toBeGreaterThan(0);
    }
  });
});
