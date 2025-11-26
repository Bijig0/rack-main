import { CharacterOverlay, CharacterSignificanceLevel } from "../types";

type Args = {
  overlays: CharacterOverlay[];
};

type Return = CharacterSignificanceLevel;

/**
 * Determines the character significance level based on proximity to character overlays
 *
 * Significance Classification:
 * - VERY_HIGH: Property is within a character overlay (NCO or SLO)
 * - HIGH: Property is within 50m of a character overlay
 * - MODERATE: Property is within 100m of a character overlay
 * - LOW: Property is within 200m of a character overlay
 * - MINIMAL: No character overlays identified in vicinity
 *
 * @param overlays - Array of character overlays with distance information
 * @returns Significance level classification
 *
 * @example
 * ```typescript
 * const overlays = [
 *   { overlayCode: "NCO1", overlayType: "NCO", overlayName: "Character Area 1", affectsProperty: true },
 * ];
 * const level = determineSignificanceLevel({ overlays });
 * // Returns: "VERY_HIGH"
 * ```
 */
export const determineSignificanceLevel = ({ overlays }: Args): Return => {
  const affecting = overlays.filter((o) => o.affectsProperty);
  if (affecting.length > 0) return "VERY_HIGH";

  const veryNear = overlays.filter((o) => o.distanceMeters !== undefined && o.distanceMeters < 50);
  if (veryNear.length > 0) return "HIGH";

  const near = overlays.filter((o) => o.distanceMeters !== undefined && o.distanceMeters < 100);
  if (near.length > 0) return "MODERATE";

  const moderate = overlays.filter((o) => o.distanceMeters !== undefined && o.distanceMeters < 200);
  if (moderate.length > 0) return "LOW";

  return "MINIMAL";
};
