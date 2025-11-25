import { FloorArea, FloorAreaSchema } from "../types";

type Return = {
  cleanedFloorArea: FloorArea;
};

type Args = {
  floorAreaText: string | null;
};

/**
 * Cleans a raw floor area text like "358m2", "358 m²", or null.
 * Returns a structured FloorArea object or "not found" if input is null/invalid.
 */
export function cleanFloorAreaText({ floorAreaText }: Args): Return {
  if (!floorAreaText) return { cleanedFloorArea: null };

  const cleaned = floorAreaText.trim().replace(/['"]+/g, "");
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s?(?:m2|m²)$/i);
  if (!match) return { cleanedFloorArea: null };

  const value = parseFloat(match[1]);
  const unit = "m²" as const;

  // Validate through schema for consistency
  const cleanedFloorArea = FloorAreaSchema.parse({ value, unit });
  return { cleanedFloorArea };
}
