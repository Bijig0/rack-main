import { describe, expect, it } from "bun:test";
import { Address } from "../../../../../../../../shared/types";
import { formatAddress } from "./formatAddress";

describe("formatAddress", () => {
  it("formats an address correctly", () => {
    const address: Address = {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = formatAddress({ address });

    expect(result).toEqual({
      formattedAddress: "6 English Place Kew VIC 3101",
    });
  });

  it("preserves the order and spacing of fields", () => {
    const address: Address = {
      addressLine: "123 Test Street",
      suburb: "Richmond",
      state: "NSW",
      postcode: "2000",
    };

    const { formattedAddress } = formatAddress({ address });
    expect(formattedAddress).toBe("123 Test Street Richmond NSW 2000");
  });
});
