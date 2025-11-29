import { z } from "zod";

export const SimilarPropertyForRentSchema = z.object({
  address: z.string().min(1),
  pricePerWeek: z.number().positive(),
  bedrooms: z.number().nonnegative(),
  bathrooms: z.number().nonnegative(),
  parking: z.number().nonnegative(),
  propertyType: z.string().min(1), // e.g., "House", "Apartment"
});

export const SimilarPropertiesForRentSchema = z
  .array(SimilarPropertyForRentSchema)
  .nullish();

export type SimilarPropertyForRent = z.infer<
  typeof SimilarPropertyForRentSchema
>;
export type SimilarPropertiesForRent = z.infer<
  typeof SimilarPropertiesForRentSchema
>;
