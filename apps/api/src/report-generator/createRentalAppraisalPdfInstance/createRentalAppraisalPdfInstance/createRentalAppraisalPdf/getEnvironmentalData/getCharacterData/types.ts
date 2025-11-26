import { z } from "zod";

// Character significance level
export const CharacterSignificanceLevelSchema = z.enum([
  "VERY_HIGH", // Within Neighbourhood Character Overlay or Significant Landscape Overlay
  "HIGH", // Near character overlay (within 50m)
  "MODERATE", // In area with character context (within 100m)
  "LOW", // Some character considerations (within 200m)
  "MINIMAL", // No significant character constraints
]);

export type CharacterSignificanceLevel = z.infer<typeof CharacterSignificanceLevelSchema>;

// Character overlay data
export const CharacterOverlaySchema = z.object({
  overlayCode: z.string(),
  overlayType: z.string(), // "NCO" or "SLO"
  overlayName: z.string(),
  description: z.string().optional(),
  lga: z.string().optional(),
  affectsProperty: z.boolean(),
  distanceMeters: z.number().optional(),
});

export type CharacterOverlay = z.infer<typeof CharacterOverlaySchema>;

// Character analysis data
export const CharacterDataSchema = z.object({
  significanceLevel: CharacterSignificanceLevelSchema,
  characterOverlays: z.array(CharacterOverlaySchema),
  affectedByCharacterOverlay: z.boolean(),
  requiresCharacterAssessment: z.boolean(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type CharacterData = z.infer<typeof CharacterDataSchema>;
