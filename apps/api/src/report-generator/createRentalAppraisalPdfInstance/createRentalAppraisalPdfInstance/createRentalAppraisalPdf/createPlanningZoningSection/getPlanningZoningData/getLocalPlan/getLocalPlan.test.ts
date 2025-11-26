#!/Users/a61403/.bun/bin/bun
import { describe, expect, mock, test } from "bun:test";
import { Effect } from "effect";
import type { Address } from "../../../../../../../shared/types";

// Mock getPlanningZoneData to return LGA based on suburb
mock.module("../getPlanningZoneData/getPlanningZoneData", () => ({
  getPlanningZoneData: async ({ address }: { address: Address }) => {
    // Map suburbs to their LGAs
    const suburbToLga: Record<string, string | null> = {
      Melbourne: "Melbourne",
      Kew: "Boroondara",
      Collingwood: "Yarra",
      "Port Melbourne": "Port Phillip",
      "St Kilda": "Port Phillip",
      Geelong: "Greater Geelong",
      Ballarat: "Ballarat",
      Bendigo: "Greater Bendigo",
      Frankston: "Frankston",
      Whitehorse: "Whitehorse",
      Armadale: "Stonnington",
      Oakleigh: "Monash",
      Wantirna: "Knox",
      Preston: "Darebin",
      Brunswick: "Moreland",
      Brighton: "Bayside",
      Mornington: "Mornington Peninsula",
      SmallTown: "Unknown Council",
      UnknownSuburb: null,
    };

    const lgaName = suburbToLga[address.suburb] ?? null;

    if (lgaName === null) {
      return { planningZoneData: null };
    }

    return {
      planningZoneData: {
        zoneCode: "GRZ1",
        zoneDescription: "General Residential Zone",
        lgaName,
        lgaCode: null,
      },
    };
  },
}));

// Import after mocking
import { getLocalPlan } from "./getLocalPlan";

describe("getLocalPlan", () => {
  test("should return Melbourne local plan for Melbourne address", async () => {
    const address: Address = {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Melbourne");
    expect(result?.localPlan).toBe(
      "City of Melbourne Central City Local Policy"
    );
  });

  test("should return Boroondara local plan for Kew address", async () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Boroondara");
    expect(result?.localPlan).toBe("Boroondara Neighbourhood Character Study");
  });

  test("should return Yarra local plan for Collingwood address", async () => {
    const address: Address = {
      addressLine: "100 Smith Street",
      suburb: "Collingwood",
      state: "VIC",
      postcode: "3066",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Yarra");
    expect(result?.localPlan).toBe("Yarra Neighbourhood Character Policy");
  });

  test("should return Port Phillip local plan for Port Melbourne address", async () => {
    const address: Address = {
      addressLine: "123 Bay Street",
      suburb: "Port Melbourne",
      state: "VIC",
      postcode: "3207",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Port Phillip");
    expect(result?.localPlan).toBe(
      "Port Phillip Neighbourhood Character and Heritage Policy"
    );
  });

  test("should return Geelong local plan for Greater Geelong LGA", async () => {
    const address: Address = {
      addressLine: "123 Moorabool Street",
      suburb: "Geelong",
      state: "VIC",
      postcode: "3220",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Greater Geelong");
    expect(result?.localPlan).toBe(
      "Greater Geelong Housing Diversity Strategy"
    );
  });

  test("should return Ballarat local plan", async () => {
    const address: Address = {
      addressLine: "50 Sturt Street",
      suburb: "Ballarat",
      state: "VIC",
      postcode: "3350",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Ballarat");
    expect(result?.localPlan).toBe("Ballarat Strategy Plan");
  });

  test("should return Bendigo local plan for Greater Bendigo", async () => {
    const address: Address = {
      addressLine: "100 View Street",
      suburb: "Bendigo",
      state: "VIC",
      postcode: "3550",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Greater Bendigo");
    expect(result?.localPlan).toBe("Greater Bendigo Housing Strategy");
  });

  test("should return Frankston local plan for Frankston address", async () => {
    const address: Address = {
      addressLine: "50 Test Street",
      suburb: "Frankston",
      state: "VIC",
      postcode: "3199",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Frankston");
    expect(result?.localPlan).toBe("Frankston Neighbourhood Character Study");
  });

  test("should return Whitehorse local plan", async () => {
    const address: Address = {
      addressLine: "789 Example Road",
      suburb: "Whitehorse",
      state: "VIC",
      postcode: "3150",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Whitehorse");
    expect(result?.localPlan).toBe("Whitehorse Neighbourhood Character Study");
  });

  test("should return Stonnington local plan for Armadale address", async () => {
    const address: Address = {
      addressLine: "100 High Street",
      suburb: "Armadale",
      state: "VIC",
      postcode: "3143",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Stonnington");
    expect(result?.localPlan).toBe(
      "Stonnington Built Form and Heritage Policy"
    );
  });

  test("should return Monash local plan for Oakleigh address", async () => {
    const address: Address = {
      addressLine: "50 Ferntree Gully Road",
      suburb: "Oakleigh",
      state: "VIC",
      postcode: "3166",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Monash");
    expect(result?.localPlan).toBe("Monash Neighbourhood Character Study");
  });

  test("should return Knox local plan for Wantirna address", async () => {
    const address: Address = {
      addressLine: "123 Burwood Highway",
      suburb: "Wantirna",
      state: "VIC",
      postcode: "3152",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Knox");
    expect(result?.localPlan).toBe("Knox Neighbourhood Character Study");
  });

  test("should return Darebin local plan for Preston address", async () => {
    const address: Address = {
      addressLine: "456 High Street",
      suburb: "Preston",
      state: "VIC",
      postcode: "3072",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Darebin");
    expect(result?.localPlan).toBe("Darebin Neighbourhood Character Study");
  });

  test("should return Moreland local plan for Brunswick address", async () => {
    const address: Address = {
      addressLine: "789 Sydney Road",
      suburb: "Brunswick",
      state: "VIC",
      postcode: "3056",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Moreland");
    expect(result?.localPlan).toBe("Moreland Neighbourhood Character Study");
  });

  test("should return Bayside local plan for Brighton address", async () => {
    const address: Address = {
      addressLine: "100 Beach Road",
      suburb: "Brighton",
      state: "VIC",
      postcode: "3186",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Bayside");
    expect(result?.localPlan).toBe("Bayside Neighbourhood Character Study");
  });

  test("should return Mornington Peninsula local plan", async () => {
    const address: Address = {
      addressLine: "50 Main Street",
      suburb: "Mornington",
      state: "VIC",
      postcode: "3931",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Mornington Peninsula");
    expect(result?.localPlan).toBe(
      "Mornington Peninsula Localised Planning Statement"
    );
  });

  test("should return null localPlan when LGA not in lookup table", async () => {
    const address: Address = {
      addressLine: "1 Main Street",
      suburb: "SmallTown",
      state: "VIC",
      postcode: "3999",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBe("Unknown Council");
    expect(result?.localPlan).toBeNull();
  });

  test("should return null when LGA cannot be determined and suburb not found", async () => {
    const address: Address = {
      addressLine: "1 Test Road",
      suburb: "UnknownSuburb",
      state: "VIC",
      postcode: "3888",
    };

    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.lgaName).toBeNull();
    expect(result?.localPlan).toBeNull();
  });
});

describe("getLocalPlan - Effect behavior", () => {
  test("should return an Effect that can be run with runPromise", async () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const effect = getLocalPlan({ address });

    // Verify it's an Effect by checking we can run it
    const result = await Effect.runPromise(effect);

    expect(result).toHaveProperty("localPlan");
    expect(result).toHaveProperty("lgaName");
  });

  test("should never fail (returns null values instead)", async () => {
    const address: Address = {
      addressLine: "Unknown Address",
      suburb: "UnknownSuburb",
      state: "VIC",
      postcode: "9999",
    };

    // This should not throw, even for unknown addresses
    const result = await Effect.runPromise(getLocalPlan({ address }));

    expect(result?.localPlan).toBeNull();
  });
});
