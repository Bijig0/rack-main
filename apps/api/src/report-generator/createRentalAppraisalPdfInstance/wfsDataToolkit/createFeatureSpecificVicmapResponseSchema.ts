import { z, ZodTypeAny } from "zod";
import { VicmapResponseSchema } from "./types";

type Args = {
  featureSchema: ZodTypeAny;
}

/**
 * Create a new Vicmap-style response schema with a custom feature schema
 */
export const createFeatureSpecificVicmapResponseSchema = <T extends ZodTypeAny>(
  featureSchema: T
) => {
  // Replace the "features" property, keep all other keys from VicmapResponseSchema
  return VicmapResponseSchema.extend({
    features: z.array(featureSchema),
  });
};

// Example usage:

// import { VicmapFeatureSchema } from "./VicmapFeatureSchema";
// const defaultHeritageSchema = createHeritageVicmapResponseSchema(VicmapFeatureSchema);

// Custom feature schema
// const MyFeatureSchema = z.object({ id: z.string(), properties: z.any() });
// const customHeritageSchema = createHeritageVicmapResponseSchema(MyFeatureSchema);
