import { EstimatedValueRange, EstimatedValueRangeSchema } from "../types";

type Args = {
  lowText: string | null;
  midText: string | null;
  highText: string | null;
};

type Return = {
  cleanedEstimatedValueRange: EstimatedValueRange;
};

/**
 * Converts value text like "4.04m" or "$4.04m" to a number in dollars
 * Examples:
 * - "4.04m" -> 4040000
 * - "$5.14m" -> 5140000
 * - "450000" -> 450000
 * - "450k" -> 450000
 */
function parseValueText(text: string | null): number | null {
  if (!text) return null;

  // Remove $, commas, and whitespace
  const cleaned = text.replace(/[$,\s]/g, "");

  // Handle millions (m or M)
  if (cleaned.match(/m$/i)) {
    const value = parseFloat(cleaned.replace(/m$/i, ""));
    return Math.round(value * 1000000);
  }

  // Handle thousands (k or K)
  if (cleaned.match(/k$/i)) {
    const value = parseFloat(cleaned.replace(/k$/i, ""));
    return Math.round(value * 1000);
  }

  // Handle plain numbers
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : Math.round(value);
}

export function cleanEstimatedValueRangeText({
  lowText,
  midText,
  highText,
}: Args): Return {
  const low = parseValueText(lowText);
  const mid = parseValueText(midText);
  const high = parseValueText(highText);

  if (low === null || mid === null || high === null) {
    return { cleanedEstimatedValueRange: null };
  }

  const cleanedEstimatedValueRange = EstimatedValueRangeSchema.parse({
    low,
    mid,
    high,
    currency: "AUD",
  });

  return { cleanedEstimatedValueRange };
}
