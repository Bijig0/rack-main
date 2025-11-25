import { describe, expect, it } from "bun:test";
import { AppraisalSummarySchema } from "../types";
import { cleanAppraisalSummaryText } from "./cleanAppraisalSummaryText";

describe("cleanAppraisalSummaryText", () => {
  it("cleans and validates summary text", () => {
    const { cleanedAppraisalSummary: result } = cleanAppraisalSummaryText({
      appraisalSummaryText: "The size of Kew is approximately 10.5 square kilometres.",
    });
    expect(result).toBe("The size of Kew is approximately 10.5 square kilometres.");
    expect(AppraisalSummarySchema.safeParse(result).success).toBe(true);
  });

  it("trims whitespace", () => {
    const { cleanedAppraisalSummary: result } = cleanAppraisalSummaryText({
      appraisalSummaryText: "  Some summary text  ",
    });
    expect(result).toBe("Some summary text");
  });

  it("returns null for null input", () => {
    const { cleanedAppraisalSummary: result } = cleanAppraisalSummaryText({
      appraisalSummaryText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for empty string", () => {
    const { cleanedAppraisalSummary: result } = cleanAppraisalSummaryText({
      appraisalSummaryText: "   ",
    });
    expect(result).toBe(null);
  });
});
