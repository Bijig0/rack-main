import { Council, CouncilSchema } from "../types";

type Return = {
  cleanedCouncil: Council;
};

type Args = {
  councilText: string | null;
};

/**
 * Cleans a raw council text like "Boroondara Council", "Melbourne Council", etc.
 * Returns a cleaned string or null if input is null/invalid.
 */
export function cleanCouncilText({ councilText }: Args): Return {
  if (!councilText) return { cleanedCouncil: null };

  const cleaned = councilText.trim();

  if (cleaned.length === 0) return { cleanedCouncil: null };

  // Validate through schema for consistency
  const cleanedCouncil = CouncilSchema.parse(cleaned);
  return { cleanedCouncil };
}
