#!/Users/a61403/.bun/bin/bun
import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../shared/types";
import { getLocalPlan } from "./getLocalPlan";

describe("getLocalPlan", () => {
  test("should return Melbourne local plan when LGA is Melbourne", () => {
    const address: Address = {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Melbourne",
    });

    expect(localPlan).toBe("City of Melbourne Central City Local Policy");
  });

  test("should return Boroondara local plan when LGA is Boroondara", () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Boroondara",
    });

    expect(localPlan).toBe("Boroondara Neighbourhood Character Study");
  });

  test("should return Yarra local plan when LGA is Yarra", () => {
    const address: Address = {
      addressLine: "100 Smith Street",
      suburb: "Collingwood",
      state: "VIC",
      postcode: "3066",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Yarra",
    });

    expect(localPlan).toBe("Yarra Neighbourhood Character Policy");
  });

  test("should return Port Phillip local plan when LGA is Port Phillip", () => {
    const address: Address = {
      addressLine: "123 Bay Street",
      suburb: "Port Melbourne",
      state: "VIC",
      postcode: "3207",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Port Phillip",
    });

    expect(localPlan).toBe(
      "Port Phillip Neighbourhood Character and Heritage Policy"
    );
  });

  test("should handle LGA name with City suffix", () => {
    const address: Address = {
      addressLine: "50 Test Street",
      suburb: "Frankston",
      state: "VIC",
      postcode: "3199",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Frankston City",
    });

    expect(localPlan).toBe("Frankston Neighbourhood Character Study");
  });

  test("should handle LGA name with Council suffix", () => {
    const address: Address = {
      addressLine: "789 Example Road",
      suburb: "Whitehorse",
      state: "VIC",
      postcode: "3150",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Whitehorse Council",
    });

    expect(localPlan).toBe("Whitehorse Neighbourhood Character Study");
  });

  test("should handle City of prefix", () => {
    const address: Address = {
      addressLine: "456 Beach Road",
      suburb: "St Kilda",
      state: "VIC",
      postcode: "3182",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "City of Port Phillip",
    });

    expect(localPlan).toBe(
      "Port Phillip Neighbourhood Character and Heritage Policy"
    );
  });

  test("should return Geelong local plan for Greater Geelong", () => {
    const address: Address = {
      addressLine: "123 Moorabool Street",
      suburb: "Geelong",
      state: "VIC",
      postcode: "3220",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Greater Geelong",
    });

    expect(localPlan).toBe("Greater Geelong Housing Diversity Strategy");
  });

  test("should return Ballarat local plan", () => {
    const address: Address = {
      addressLine: "50 Sturt Street",
      suburb: "Ballarat",
      state: "VIC",
      postcode: "3350",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Ballarat",
    });

    expect(localPlan).toBe("Ballarat Strategy Plan");
  });

  test("should return Bendigo local plan", () => {
    const address: Address = {
      addressLine: "100 View Street",
      suburb: "Bendigo",
      state: "VIC",
      postcode: "3550",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Greater Bendigo",
    });

    expect(localPlan).toBe("Greater Bendigo Housing Strategy");
  });

  test("should return undefined when LGA not in lookup table", () => {
    const address: Address = {
      addressLine: "1 Main Street",
      suburb: "SmallTown",
      state: "VIC",
      postcode: "3999",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Unknown Council",
    });

    expect(localPlan).toBeUndefined();
  });

  test("should return undefined when no LGA provided and suburb not found", () => {
    const address: Address = {
      addressLine: "1 Test Road",
      suburb: "UnknownSuburb",
      state: "VIC",
      postcode: "3888",
    };

    const { localPlan } = getLocalPlan({
      address,
    });

    expect(localPlan).toBeUndefined();
  });

  test("should handle case insensitive LGA name", () => {
    const address: Address = {
      addressLine: "100 High Street",
      suburb: "Armadale",
      state: "VIC",
      postcode: "3143",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "STONNINGTON",
    });

    expect(localPlan).toBe("Stonnington Built Form and Heritage Policy");
  });

  test("should return Monash local plan", () => {
    const address: Address = {
      addressLine: "50 Ferntree Gully Road",
      suburb: "Oakleigh",
      state: "VIC",
      postcode: "3166",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Monash",
    });

    expect(localPlan).toBe("Monash Neighbourhood Character Study");
  });

  test("should return Knox local plan", () => {
    const address: Address = {
      addressLine: "123 Burwood Highway",
      suburb: "Wantirna",
      state: "VIC",
      postcode: "3152",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Knox",
    });

    expect(localPlan).toBe("Knox Neighbourhood Character Study");
  });

  test("should return Darebin local plan", () => {
    const address: Address = {
      addressLine: "456 High Street",
      suburb: "Preston",
      state: "VIC",
      postcode: "3072",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Darebin",
    });

    expect(localPlan).toBe("Darebin Neighbourhood Character Study");
  });

  test("should return Moreland local plan", () => {
    const address: Address = {
      addressLine: "789 Sydney Road",
      suburb: "Brunswick",
      state: "VIC",
      postcode: "3056",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Moreland",
    });

    expect(localPlan).toBe("Moreland Neighbourhood Character Study");
  });

  test("should return Bayside local plan", () => {
    const address: Address = {
      addressLine: "100 Beach Road",
      suburb: "Brighton",
      state: "VIC",
      postcode: "3186",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Bayside",
    });

    expect(localPlan).toBe("Bayside Neighbourhood Character Study");
  });

  test("should handle partial LGA name match", () => {
    const address: Address = {
      addressLine: "50 Main Street",
      suburb: "Mornington",
      state: "VIC",
      postcode: "3931",
    };

    const { localPlan } = getLocalPlan({
      address,
      lgaName: "Mornington Peninsula Shire Council",
    });

    expect(localPlan).toBe("Mornington Peninsula Localised Planning Statement");
  });
});
