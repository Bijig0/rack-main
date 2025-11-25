import { describe, expect, it } from "bun:test";
import { YearBuiltSchema } from "../types";
import { cleanYearBuiltText } from "./cleanYearBuiltText";

describe("cleanYearBuiltText", () => {
  it("parses simple year text like '2015'", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "2015",
    });
    expect(result).toBe(2015);
    expect(YearBuiltSchema.safeParse(result).success).toBe(true);
  });

  it("parses different years", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "1998",
    });
    expect(result).toBe(1998);
  });

  it("extracts year from text with context", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "Built in 2010",
    });
    expect(result).toBe(2010);
  });

  it("handles text with extra whitespace", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "  1985  ",
    });
    expect(result).toBe(1985);
  });

  it("returns null for null input", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for empty string", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "",
    });
    expect(result).toBe(null);
  });

  it("returns null for whitespace-only string", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "   ",
    });
    expect(result).toBe(null);
  });

  it("returns null for text without a valid year", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "No year here",
    });
    expect(result).toBe(null);
  });

  it("returns null for years outside valid range", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "1700",
    });
    expect(result).toBe(null);
  });

  it("handles years in the 1900s", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "1950",
    });
    expect(result).toBe(1950);
  });

  it("handles recent years", () => {
    const { cleanedYearBuilt: result } = cleanYearBuiltText({
      yearBuiltText: "2023",
    });
    expect(result).toBe(2023);
  });
});
