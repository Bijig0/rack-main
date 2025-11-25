import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../../shared/types";
import { normalizeAddressObjToString } from "./normalizeAddressObjToString";

describe("normalizeAddressObjToString", () => {
  describe("standard normalization", () => {
    test("should normalize a complete address to lowercase with pipe separators", () => {
      const address: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = normalizeAddressObjToString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });

    test("should convert all uppercase to normal uppercase", () => {
      const address: Address = {
        addressLine: "123 MAIN STREET",
        suburb: "MELBOURNE",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToString(address);

      expect(result).toBe("123 Main Street Melbourne VIC 3000");
    });

    test("should convert mixed case to uppercase", () => {
      const address: Address = {
        addressLine: "456 CoLLiNs St",
        suburb: "MeLbOuRnE",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToString(address);

      expect(result).toBe("456 Collins St Melbourne VIC 3000");
    });
  });
});
