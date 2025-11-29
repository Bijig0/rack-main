import { describe, expect, it } from "bun:test";
import { PropertyTypeSchema } from "../types";
import { cleanPropertyTypeText } from "./cleanPropertyTypeText";

describe("cleanPropertyTypeText", () => {
  it("cleans simple property type text like 'house'", () => {
    const { cleanedPropertyType: result } = cleanPropertyTypeText({
      propertyTypeText: "house",
    });
    expect(result).toEqual("house");
    expect(PropertyTypeSchema.safeParse(result).success).toBe(true);
  });

  it("converts to lowercase", () => {
    const { cleanedPropertyType: result } = cleanPropertyTypeText({
      propertyTypeText: "APARTMENT",
    });
    expect(result).toEqual("apartment");
  });

  it("trims whitespace", () => {
    const { cleanedPropertyType: result } = cleanPropertyTypeText({
      propertyTypeText: "  townhouse  ",
    });
    expect(result).toEqual("townhouse");
  });

  it("returns null for null input", () => {
    const { cleanedPropertyType: result } = cleanPropertyTypeText({
      propertyTypeText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for empty strings", () => {
    const { cleanedPropertyType: result } = cleanPropertyTypeText({
      propertyTypeText: "   ",
    });
    expect(result).toBe(null);
  });
});
