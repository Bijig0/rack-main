import { YearBuilt, YearBuiltSchema } from "../types";

type Return = {
  cleanedYearBuilt: YearBuilt;
};

type Args = {
  yearBuiltText: string | null;
};

/**
 * Cleans a raw year built text like "2015", "1998", etc.
 * Returns a number or null if input is null/invalid.
 */
export function cleanYearBuiltText({ yearBuiltText }: Args): Return {
  if (!yearBuiltText) return { cleanedYearBuilt: null };

  const cleaned = yearBuiltText.trim();

  if (cleaned.length === 0) return { cleanedYearBuilt: null };

  // Extract year from text (e.g., "Built in 2015" -> 2015)
  const match = cleaned.match(/\b(19|20)\d{2}\b/);
  if (!match) return { cleanedYearBuilt: null };

  const year = parseInt(match[0], 10);

  // Validate through schema for consistency
  const cleanedYearBuilt = YearBuiltSchema.parse(year);
  return { cleanedYearBuilt };
}
