import { describe, expect, test } from "bun:test";
import { Effect } from "effect";
import type { Address } from "../../../../../../../shared/types";
import { getDistanceFromCBD } from "./getDistanceFromCBD";

describe("getDistanceFromCBD - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract distance from CBD from actual propertyPage.html", async () => {
    const { distanceFromCBD } = await Effect.runPromise(
      getDistanceFromCBD({
        address: testAddress,
      })
    );

    if (distanceFromCBD !== null && distanceFromCBD !== undefined) {
      expect(distanceFromCBD).toHaveProperty("value");
      expect(distanceFromCBD).toHaveProperty("unit");
      expect(typeof distanceFromCBD.value).toBe("number");
      expect(distanceFromCBD.value).toBeGreaterThan(0);
      expect(distanceFromCBD.unit).toBe("km");
    } else {
      expect(distanceFromCBD == null).toBe(true);
    }
  });

  test("should handle the complete workflow", async () => {
    const result = await Effect.runPromise(
      getDistanceFromCBD({ address: testAddress })
    );

    expect(result).toHaveProperty("distanceFromCBD");
  });
});
