import { z } from "zod";

const NearbySchoolSchema = z
  .object({
    type: z.string(),
    name: z.string().min(1),
    address: z.string().min(1),
    distance: z.string().min(1),
  })
  .nullish();

export const NearbySchoolsSchema = z.array(NearbySchoolSchema).nullish();

export type NearbySchool = z.infer<typeof NearbySchoolSchema>;
export type NearbySchools = z.infer<typeof NearbySchoolsSchema> | null;

// Legacy export for backward compatibility
export type School = NearbySchool;
export type SchoolsPropertyInCatchmentOf = NearbySchools;
export const SchoolSchema = NearbySchoolSchema;
export const SchoolsPropertyInCatchmentOfSchema = NearbySchoolsSchema;
