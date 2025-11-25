import { z } from "zod";

export const SimilarPropertyForSaleSchema = z.object({
  address: z.string().min(1),
  price: z.string().min(1), // Can be range like "$3,900,000 - $4,150,000" or expression like "Expressions of Interest"
  bedrooms: z.number().nonnegative(),
  bathrooms: z.number().nonnegative(),
  parking: z.number().nonnegative(),
  propertyType: z.string().min(1), // e.g., "House", "Apartment"
});

export const SimilarPropertiesForSaleSchema = z
  .array(SimilarPropertyForSaleSchema)
  .nullish();

export type SimilarPropertyForSale = z.infer<
  typeof SimilarPropertyForSaleSchema
>;
export type SimilarPropertiesForSale = z.infer<
  typeof SimilarPropertiesForSaleSchema
>;
