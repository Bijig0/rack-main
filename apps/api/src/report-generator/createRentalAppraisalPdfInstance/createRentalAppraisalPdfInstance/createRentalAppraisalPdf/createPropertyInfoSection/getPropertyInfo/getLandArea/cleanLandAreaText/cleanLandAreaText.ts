import { LandArea, LandAreaSchema } from "../types";

type Return = {
  cleanedLandArea: LandArea;
};

type Args = {
  landAreaText: string | null;
};

/**
 * Cleans a raw land area text like "537m2", "537 m²", or null.
 * Returns a structured LandArea object or null if input is null/invalid.
 */
export function cleanLandAreaText({ landAreaText }: Args): Return {
  if (!landAreaText) return { cleanedLandArea: null };

  const cleaned = landAreaText.trim().replace(/['"]+/g, "");
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s?(?:m2|m²)$/i);
  if (!match) return { cleanedLandArea: null };

  const value = parseFloat(match[1]);
  const unit = "m²" as const;

  // Validate through schema for consistency
  const cleanedLandArea = LandAreaSchema.parse({ value, unit });
  return { cleanedLandArea };
}
