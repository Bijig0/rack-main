import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { normalizeAddressObjToCoreLogicString } from "./normalizeAddressObjToCoreLogicString";

describe("normalizeAddressObjToCoreLogicString", () => {
  describe("standard normalization", () => {
    test("should normalize a complete address to title case with space separators", () => {
      const address: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });

    test("should convert all uppercase to title case", () => {
      const address: Address = {
        addressLine: "123 MAIN STREET",
        suburb: "MELBOURNE",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("123 Main Street Melbourne VIC 3000");
    });

    test("should convert mixed case to title case", () => {
      const address: Address = {
        addressLine: "456 CoLLiNs St",
        suburb: "MeLbOuRnE",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("456 Collins St Melbourne VIC 3000");
    });
  });

  describe("whitespace handling", () => {
    test("should trim leading whitespace from all fields", () => {
      const address = {
        addressLine: "  6 English Place",
        suburb: "  Kew",
        state: "  VIC",
        postcode: "  3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });

    test("should trim trailing whitespace from all fields", () => {
      const address = {
        addressLine: "6 English Place  ",
        suburb: "Kew  ",
        state: "VIC  ",
        postcode: "3101  ",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });

    test("should trim both leading and trailing whitespace", () => {
      const address = {
        addressLine: "  6 English Place  ",
        suburb: "  Kew  ",
        state: "  VIC  ",
        postcode: "  3101  ",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });

    test("should preserve internal whitespace within fields", () => {
      const address: Address = {
        addressLine: "123   Main     Street",
        suburb: "North   Melbourne",
        state: "VIC",
        postcode: "3051",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("123   Main     Street North   Melbourne VIC 3051");
    });

    test("should handle tabs and other whitespace characters", () => {
      const address = {
        addressLine: "\t6 English Place\t",
        suburb: "\nKew\n",
        state: " VIC ",
        postcode: "3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });
  });

  describe("missing or empty field handling", () => {
    test("should handle undefined addressLine", () => {
      const address = {
        addressLine: undefined,
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe(" Kew VIC 3101");
    });

    test("should handle empty string addressLine", () => {
      const address = {
        addressLine: "",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe(" Kew VIC 3101");
    });

    test("should handle undefined suburb", () => {
      const address = {
        addressLine: "6 English Place",
        suburb: undefined,
        state: "VIC",
        postcode: "3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place  VIC 3101");
    });

    test("should handle undefined state", () => {
      const address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: undefined,
        postcode: "3101",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew  3101");
    });

    test("should handle undefined postcode", () => {
      const address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: undefined,
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC ");
    });

    test("should handle all fields undefined", () => {
      const address = {
        addressLine: undefined,
        suburb: undefined,
        state: undefined,
        postcode: undefined,
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("   ");
    });

    test("should handle all fields as empty strings", () => {
      const address = {
        addressLine: "",
        suburb: "",
        state: "",
        postcode: "",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("   ");
    });

    test("should handle whitespace-only fields as empty", () => {
      const address = {
        addressLine: "   ",
        suburb: "\t\t",
        state: "\n",
        postcode: "  ",
      } as unknown as Address;

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("   ");
    });
  });

  describe("different Australian states", () => {
    test("should normalize NSW address", () => {
      const address: Address = {
        addressLine: "123 George Street",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("123 George Street Sydney NSW 2000");
    });

    test("should normalize QLD address", () => {
      const address: Address = {
        addressLine: "456 Queen Street",
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("456 Queen Street Brisbane QLD 4000");
    });

    test("should normalize SA address", () => {
      const address: Address = {
        addressLine: "789 King William Street",
        suburb: "Adelaide",
        state: "SA",
        postcode: "5000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("789 King William Street Adelaide SA 5000");
    });

    test("should normalize WA address", () => {
      const address: Address = {
        addressLine: "101 Murray Street",
        suburb: "Perth",
        state: "WA",
        postcode: "6000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("101 Murray Street Perth WA 6000");
    });

    test("should normalize TAS address", () => {
      const address: Address = {
        addressLine: "202 Elizabeth Street",
        suburb: "Hobart",
        state: "TAS",
        postcode: "7000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("202 Elizabeth Street Hobart TAS 7000");
    });

    test("should normalize ACT address", () => {
      const address: Address = {
        addressLine: "303 Constitution Avenue",
        suburb: "Canberra",
        state: "ACT",
        postcode: "2600",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("303 Constitution Avenue Canberra ACT 2600");
    });

    test("should normalize NT address", () => {
      const address: Address = {
        addressLine: "404 Mitchell Street",
        suburb: "Darwin",
        state: "NT",
        postcode: "0800",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("404 Mitchell Street Darwin NT 0800");
    });
  });

  describe("special characters and edge cases", () => {
    test("should preserve special characters in address", () => {
      const address: Address = {
        addressLine: "Unit 5/123 O'Brien Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("Unit 5/123 O'brien Street St Kilda VIC 3182");
    });

    test("should handle hyphens in street names", () => {
      const address: Address = {
        addressLine: "45 Smith-Jones Avenue",
        suburb: "North-East Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("45 Smith-jones Avenue North-east Melbourne VIC 3000");
    });

    test("should handle numbers in suburb names", () => {
      const address: Address = {
        addressLine: "78 Beach Road",
        suburb: "St Kilda 3182",
        state: "VIC",
        postcode: "3182",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("78 Beach Road St Kilda 3182 VIC 3182");
    });

    test("should handle apartment/unit numbers", () => {
      const address: Address = {
        addressLine: "Apartment 12B, 456 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("Apartment 12b, 456 Collins Street Melbourne VIC 3000");
    });

    test("should handle PO Box addresses", () => {
      const address: Address = {
        addressLine: "PO Box 1234",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3001",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("Po Box 1234 Melbourne VIC 3001");
    });
  });

  describe("consistency and determinism", () => {
    test("should produce identical output for identical addresses", () => {
      const address1: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const address2: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      expect(normalizeAddressObjToCoreLogicString(address1)).toBe(
        normalizeAddressObjToCoreLogicString(address2)
      );
    });

    test("should produce identical output for addresses with different casing", () => {
      const address1: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const address2: Address = {
        addressLine: "6 ENGLISH PLACE",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };

      expect(normalizeAddressObjToCoreLogicString(address1)).toBe(
        normalizeAddressObjToCoreLogicString(address2)
      );
    });

    test("should produce identical output for addresses with different whitespace", () => {
      const address1: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const address2 = {
        addressLine: "  6 English Place  ",
        suburb: "  Kew  ",
        state: "  VIC  ",
        postcode: "  3101  ",
      } as unknown as Address;

      expect(normalizeAddressObjToCoreLogicString(address1)).toBe(
        normalizeAddressObjToCoreLogicString(address2)
      );
    });

    test("should produce different output for different addresses", () => {
      const address1: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const address2: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      expect(normalizeAddressObjToCoreLogicString(address1)).not.toBe(
        normalizeAddressObjToCoreLogicString(address2)
      );
    });
  });

  describe("real-world examples", () => {
    test("should normalize typical Melbourne address", () => {
      const address: Address = {
        addressLine: "123 Flinders Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("123 Flinders Street Melbourne VIC 3000");
    });

    test("should normalize typical Sydney address", () => {
      const address: Address = {
        addressLine: "45 Circular Quay",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("45 Circular Quay Sydney NSW 2000");
    });

    test("should normalize address with long street name", () => {
      const address: Address = {
        addressLine: "12 Captain Cook Crescent",
        suburb: "Griffith",
        state: "ACT",
        postcode: "2603",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("12 Captain Cook Crescent Griffith ACT 2603");
    });

    test("should normalize the example from documentation", () => {
      const address: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("6 English Place Kew VIC 3101");
    });
  });

  describe("CoreLogic-specific formatting", () => {
    test("should use space separators instead of pipes", () => {
      const address: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).not.toContain("|");
      expect(result).toContain(" ");
    });

    test("should use title case instead of lowercase", () => {
      const address: Address = {
        addressLine: "123 main street",
        suburb: "melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toBe("123 Main Street Melbourne VIC 3000");
      expect(result).not.toBe("123 main street melbourne vic 3000");
    });

    test("should keep state codes in uppercase", () => {
      const address: Address = {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = normalizeAddressObjToCoreLogicString(address);

      expect(result).toContain("VIC");
      expect(result).not.toContain("vic");
      expect(result).not.toContain("Vic");
    });
  });
});
