import { z } from "zod";
import {
  BBoxSchema,
  GeometrySchema,
} from "../../../../../../wfsDataToolkit/types";

// --- Properties schema ---

// Fauna schema
export const FaunaPropertiesSchema = z.object({
  record_id: z.number(),
  locn_desc: z.string(),
  sci_name: z.string(),
  comm_name: z.string(),
  taxon_type: z.string(),
});

export const FaunaFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string(),
  properties: FaunaPropertiesSchema,
  bbox: BBoxSchema,
});
export const FaunaFeaturesSchema = z.array(FaunaFeatureSchema);

// Flora schema
export const FloraPropertiesSchema = z.object({
  record_id: z.number(),
  sci_name: z.string(),
  comm_name: z.string(),
  locn_desc: z.string(),
  origin: z.string().nullable(),
  vic_lf: z.string().nullable(),
});

export const FloraFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string(),
  properties: FloraPropertiesSchema,
  bbox: BBoxSchema,
});

export const FloraFeaturesSchema = z.array(FloraFeatureSchema);
// Fauna schema with discriminator
export const InferredFaunaDataSchema = z.object({
  type: z.literal("fauna"), // discriminator
  recordId: z.string(),
  locationDescription: z.string(),
  scientificName: z.string(),
  commonName: z.string(),
  taxonType: z.string(),
});

// Flora schema with discriminator
export const InferredFloraDataSchema = z.object({
  type: z.literal("flora"), // discriminator
  recordId: z.string(),
  scientificName: z.string(),
  commonName: z.string(),
  locationDescription: z.string(),
  origin: z.string().nullable(),
  victorianLifeCategory: z.string().nullable(),
});

// Discriminated union
export const InferredBiodiversityDataSchema = z.discriminatedUnion("type", [
  InferredFaunaDataSchema,
  InferredFloraDataSchema,
]);

export type FaunaFeature = z.infer<typeof FaunaFeatureSchema>;

export type FaunaFeatures = z.infer<typeof FaunaFeaturesSchema>;

export type FloraFeature = z.infer<typeof FloraFeatureSchema>;

export type FloraFeatures = z.infer<typeof FloraFeaturesSchema>;

export type InferredFaunaData = z.infer<typeof InferredFaunaDataSchema>;

export type InferredFloraData = z.infer<typeof InferredFloraDataSchema>;

export type InferredBiodiversityData = z.infer<
  typeof InferredBiodiversityDataSchema
>;

// --- Heritage feature schema ---
export const BiodiversityFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string(),
  properties: InferredBiodiversityDataSchema,
  bbox: BBoxSchema,
});

/**
 * Simplified biodiversity data for property reports
 *
 * This is the new format optimized for rental appraisal reports, focusing on
 * information that matters to landlords and tenants rather than technical species data.
 */
export const BiodiversityDataSchema = z.object({
  /** Whether the property is inside any biodiversity, vegetation, or habitat overlay */
  isInBiodiversityOverlay: z.boolean(),

  /** Level of sensitivity or restriction */
  sensitivityLevel: z.enum(["none", "low", "medium", "high"]),

  /** Distance to nearest mapped sensitive habitat or protected vegetation */
  distanceToNearestHabitat: z.number().nullable(),

  /** Simple explanation for the report */
  summary: z.string().optional(),

  /** Optional alerts for compliance, tree controls, etc. */
  alerts: z.array(z.string()).optional(),
});

export type BiodiversityData = z.infer<typeof BiodiversityDataSchema>;
