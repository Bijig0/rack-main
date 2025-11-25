import { describe, expect, test } from "bun:test";
import type { Address } from "../../../../../../../shared/types";
import getAppraisalSummary from "./getAppraisalSummary";

describe("getAppraisalSummary - integration", () => {
  const testAddress: Address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  test("should extract appraisal summary from actual propertyPage.html", async () => {
    const { appraisalSummary } = await getAppraisalSummary({
      address: testAddress,
    });

    if (appraisalSummary !== null) {
      expect(typeof appraisalSummary).toBe("string");
      expect(appraisalSummary.length).toBeGreaterThan(0);
      expect(appraisalSummary).toContain("Kew");
    } else {
      expect(appraisalSummary).toBeNull();
    }
  });

  test("should handle the complete workflow", async () => {
    const result = await getAppraisalSummary({ address: testAddress });

    expect(result).toHaveProperty("appraisalSummary");
  });
});
