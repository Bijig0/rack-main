import { DistanceFromCBD, DistanceFromCBDSchema } from "../types";

type Return = {
  cleanedDistanceFromCBD: DistanceFromCBD;
};

type Args = {
  distanceFromCBDText: string | null;
};

/**
 * Cleans a raw distance from CBD text like "7 km", "5.5 km", etc.
 * Returns a structured DistanceFromCBD object or null if input is null/invalid.
 */
export function cleanDistanceFromCBDText({ distanceFromCBDText }: Args): Return {
  if (!distanceFromCBDText) return { cleanedDistanceFromCBD: null };

  const cleaned = distanceFromCBDText.trim().replace(/['"]+/g, "");
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s?km$/i);
  if (!match) return { cleanedDistanceFromCBD: null };

  const value = parseFloat(match[1]);
  const unit = "km" as const;

  const cleanedDistanceFromCBD = DistanceFromCBDSchema.parse({ value, unit });
  return { cleanedDistanceFromCBD };
}
