import { CharacterOverlay, CharacterSignificanceLevel } from "../types";

type Args = {
  level: CharacterSignificanceLevel;
  overlays: CharacterOverlay[];
};

type Return = string[];

/**
 * Generates planning and development recommendations based on character significance
 *
 * @param level - The determined significance level
 * @param overlays - Array of character overlays
 * @returns Array of recommendation strings
 *
 * @example
 * ```typescript
 * const recommendations = generateRecommendations({
 *   level: "VERY_HIGH",
 *   overlays: [{
 *     overlayCode: "NCO1",
 *     overlayType: "NCO",
 *     overlayName: "Neighbourhood Character Overlay 1",
 *     affectsProperty: true
 *   }]
 * });
 * // Returns: ["Planning permit required for most residential development including subdivisions, buildings and works", ...]
 * ```
 */
export const generateRecommendations = ({ level, overlays }: Args): Return => {
  const recommendations: string[] = [];
  const affecting = overlays.filter((o) => o.affectsProperty);

  if (affecting.length > 0) {
    const hasNCO = affecting.some((o) => o.overlayType === "NCO");
    const hasSLO = affecting.some((o) => o.overlayType === "SLO");

    if (hasNCO) {
      recommendations.push(
        "Planning permit required for most residential development including subdivisions, buildings and works"
      );
      recommendations.push(
        "Development must meet neighbourhood character objectives specified in the NCO schedule"
      );
      recommendations.push(
        "Prepare a neighbourhood character assessment to demonstrate design response"
      );
    }

    if (hasSLO) {
      recommendations.push(
        "Development must protect significant landscape features and vegetation"
      );
      recommendations.push(
        "Consult the Significant Landscape Overlay schedule for specific requirements"
      );
    }

    recommendations.push(
      "Engage an architect or designer experienced with character overlay requirements"
    );
    recommendations.push(
      "Review local character guidelines and preferred character statements"
    );
  } else if (level === "HIGH" || level === "MODERATE") {
    recommendations.push(
      "Consider neighbourhood character in development design even though not directly affected by overlay"
    );
    recommendations.push(
      "Respect existing building scale, setbacks, and landscape character"
    );
  } else {
    recommendations.push("No specific character overlay constraints identified");
    recommendations.push("Standard residential design provisions apply");
  }

  return recommendations;
};
