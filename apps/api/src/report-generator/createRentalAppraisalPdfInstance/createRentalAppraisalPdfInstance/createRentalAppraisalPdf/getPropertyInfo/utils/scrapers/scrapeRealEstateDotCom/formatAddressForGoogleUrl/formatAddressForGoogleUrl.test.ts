import { describe, expect, it } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatAddressForGoogleUrl } from "./formatAddressForGoogleUrl";

describe("formatAddressForGoogleUrl", () => {
  it("formats a simple address correctly", () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = formatAddressForGoogleUrl(address);
    expect(result).toBe("7-english-pl-kew-vic-3101");
  });

  it("replaces different street types with abbreviations", () => {
    const address: Address = {
      addressLine: "123 Main Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const result = formatAddressForGoogleUrl(address);
    expect(result).toBe("123-main-st-melbourne-vic-3000");
  });

  it("removes commas and extra whitespace", () => {
    const address: Address = {
      addressLine: "456 High Road,",
      suburb: "Brighton",
      state: "VIC",
      postcode: "3186",
    };

    const result = formatAddressForGoogleUrl(address);
    expect(result).toBe("456-high-rd-brighton-vic-3186");
  });

  it("handles multiple street types in address", () => {
    const address: Address = {
      addressLine: "789 Elizabeth Crescent",
      suburb: "St Kilda",
      state: "VIC",
      postcode: "3182",
    };

    const result = formatAddressForGoogleUrl(address);
    expect(result).toBe("789-elizabeth-cr-st-kilda-vic-3182");
  });

  it("leaves words untouched if no abbreviation matches", () => {
    const address: Address = {
      addressLine: "101 Random Lane",
      suburb: "Fitzroy",
      state: "VIC",
      postcode: "3065",
    };

    const result = formatAddressForGoogleUrl(address);
    expect(result).toBe("101-random-lane-fitzroy-vic-3065");
  });
});
