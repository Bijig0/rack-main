import { NearbySchools, NearbySchoolsSchema, NearbySchool } from "../types";

type Return = {
  cleanedSchools: NearbySchools;
};

type Args = {
  schools: NearbySchool[];
};

/**
 * Validates and cleans the nearby schools array
 * Ensures all schools have the required discriminated union type
 */
export function cleanNearbySchoolsText({ schools }: Args): Return {
  if (!schools || schools.length === 0) return { cleanedSchools: null };

  // Validate through schema (ensures discriminated union is correct)
  const cleanedSchools = NearbySchoolsSchema.parse(schools);
  return { cleanedSchools };
}
