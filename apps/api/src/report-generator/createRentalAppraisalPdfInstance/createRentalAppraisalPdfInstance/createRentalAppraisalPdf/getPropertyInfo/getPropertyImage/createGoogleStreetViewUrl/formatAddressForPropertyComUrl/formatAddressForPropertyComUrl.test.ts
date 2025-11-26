import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatAddressForPropertyComUrl } from "./formatAddressForPropertyComUrl";

describe("formatAddressForPropertyComUrl", () => {
  test("formats standard address with Place correctly", () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = formatAddressForPropertyComUrl(address, "11097147");
    expect(result).toBe("vic/kew-3101/english-pl/7-pid-11097147");
  });

  test("formats address with Street type", () => {
    const address: Address = {
      addressLine: "123 Main Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const result = formatAddressForPropertyComUrl(address, "12345678");
    expect(result).toBe("vic/melbourne-3000/main-st/123-pid-12345678");
  });

  test("formats address with Road type", () => {
    const address: Address = {
      addressLine: "45 Queen Road",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
    };

    const result = formatAddressForPropertyComUrl(address, "87654321");
    expect(result).toBe("nsw/sydney-2000/queen-rd/45-pid-87654321");
  });

  test("formats address with Avenue type", () => {
    const address: Address = {
      addressLine: "100 Park Avenue",
      suburb: "Adelaide",
      state: "SA",
      postcode: "5000",
    };

    const result = formatAddressForPropertyComUrl(address, "11111111");
    expect(result).toBe("sa/adelaide-5000/park-ave/100-pid-11111111");
  });

  test("formats address with Crescent type", () => {
    const address: Address = {
      addressLine: "22 Moon Crescent",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    };

    const result = formatAddressForPropertyComUrl(address, "22222222");
    expect(result).toBe("qld/brisbane-4000/moon-cr/22-pid-22222222");
  });

  test("formats address with Drive type", () => {
    const address: Address = {
      addressLine: "88 Ocean Drive",
      suburb: "Perth",
      state: "WA",
      postcode: "6000",
    };

    const result = formatAddressForPropertyComUrl(address, "33333333");
    expect(result).toBe("wa/perth-6000/ocean-dr/88-pid-33333333");
  });

  test("handles multi-word suburbs", () => {
    const address: Address = {
      addressLine: "15 King Street",
      suburb: "North Sydney",
      state: "NSW",
      postcode: "2060",
    };

    const result = formatAddressForPropertyComUrl(address, "44444444");
    expect(result).toBe("nsw/north-sydney-2060/king-st/15-pid-44444444");
  });

  test("handles multi-word street names", () => {
    const address: Address = {
      addressLine: "10 St Kilda Road",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3004",
    };

    const result = formatAddressForPropertyComUrl(address, "55555555");
    expect(result).toBe("vic/melbourne-3004/st-kilda-rd/10-pid-55555555");
  });

  test("handles street without known type suffix", () => {
    const address: Address = {
      addressLine: "42 The Esplanade",
      suburb: "Cairns",
      state: "QLD",
      postcode: "4870",
    };

    const result = formatAddressForPropertyComUrl(address, "66666666");
    expect(result).toBe("qld/cairns-4870/the-esplanade/42-pid-66666666");
  });

  test("handles unit numbers in address line", () => {
    const address: Address = {
      addressLine: "2A George Street",
      suburb: "Perth",
      state: "WA",
      postcode: "6000",
    };

    const result = formatAddressForPropertyComUrl(address, "77777777");
    expect(result).toBe("wa/perth-6000/george-st/2a-pid-77777777");
  });
});
