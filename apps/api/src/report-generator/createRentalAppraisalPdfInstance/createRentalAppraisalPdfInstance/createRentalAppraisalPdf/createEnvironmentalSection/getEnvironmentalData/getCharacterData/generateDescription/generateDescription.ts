import { CharacterOverlay, CharacterSignificanceLevel } from "../types";

type Args = {
  level: CharacterSignificanceLevel;
  overlays: CharacterOverlay[];
};

type Return = string;

/**
 * Generates a human-readable description of the character significance
 *
 * @param level - The determined significance level
 * @param overlays - Array of character overlays
 * @returns Descriptive text explaining the character significance
 *
 * @example
 * ```typescript
 * const description = generateDescription({
 *   level: "VERY_HIGH",
 *   overlays: [{
 *     overlayCode: "NCO1",
 *     overlayType: "NCO",
 *     overlayName: "Neighbourhood Character Overlay 1",
 *     affectsProperty: true
 *   }]
 * });
 * // Returns: "Very high character significance - property is within 1 character overlay(s): NCO1. Development must respect neighbourhood character."
 * ```
 */
export const generateDescription = ({ level, overlays }: Args): Return => {
  const affecting = overlays.filter((o) => o.affectsProperty);

  if (level === "VERY_HIGH" && affecting.length > 0) {
    const overlayList = affecting.map((o) => o.overlayCode).join(", ");
    return `Very high character significance - property is within ${affecting.length} character overlay(s): ${overlayList}. Development must respect neighbourhood character.`;
  }

  if (level === "HIGH") {
    return "High character significance - property is in close proximity to character overlay areas. Development should consider neighbourhood character context.";
  }

  if (level === "MODERATE") {
    return "Moderate character significance - property is near character-protected areas. Consider character impacts in development design.";
  }

  if (level === "LOW") {
    return "Low character significance - property is in an area with some character context.";
  }

  return "Minimal character significance - no identified character constraints in the immediate vicinity.";
};
