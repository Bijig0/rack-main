import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatSuburbForMicroBurbsUrl } from "./formatSuburbForMicroBurbsUrl";

describe("formatSuburbForMicroBurbsUrl", () => {
  test("formats VIC suburb correctly", () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Kew+(Vic.)");
  });

  test("formats NSW suburb correctly", () => {
    const address: Address = {
      addressLine: "123 Main Street",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Sydney+(N.S.W.)");
  });

  test("formats QLD suburb correctly", () => {
    const address: Address = {
      addressLine: "45 Queen Road",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Brisbane+(Qld.)");
  });

  test("formats SA suburb correctly", () => {
    const address: Address = {
      addressLine: "100 Park Avenue",
      suburb: "Adelaide",
      state: "SA",
      postcode: "5000",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Adelaide+(S.A.)");
  });

  test("formats WA suburb correctly", () => {
    const address: Address = {
      addressLine: "88 Ocean Drive",
      suburb: "Perth",
      state: "WA",
      postcode: "6000",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Perth+(W.A.)");
  });

  test("formats TAS suburb correctly", () => {
    const address: Address = {
      addressLine: "22 Beach Road",
      suburb: "Hobart",
      state: "TAS",
      postcode: "7000",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Hobart+(Tas.)");
  });

  test("formats ACT suburb correctly", () => {
    const address: Address = {
      addressLine: "15 Capital Street",
      suburb: "Canberra",
      state: "ACT",
      postcode: "2600",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Canberra+(A.C.T.)");
  });

  test("formats NT suburb correctly", () => {
    const address: Address = {
      addressLine: "10 Tropical Road",
      suburb: "Darwin",
      state: "NT",
      postcode: "0800",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("Darwin+(N.T.)");
  });

  test("handles multi-word suburbs", () => {
    const address: Address = {
      addressLine: "15 King Street",
      suburb: "North Sydney",
      state: "NSW",
      postcode: "2060",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("North+Sydney+(N.S.W.)");
  });

  test("handles suburbs with multiple spaces", () => {
    const address: Address = {
      addressLine: "20 Main Road",
      suburb: "St  Kilda  East",
      state: "VIC",
      postcode: "3183",
    };

    const result = formatSuburbForMicroBurbsUrl(address);
    expect(result).toBe("St+Kilda+East+(Vic.)");
  });
});
