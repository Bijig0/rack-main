// schemas/places.schema.ts
import { z } from "zod";

const API_URL =
  "https://propertyhub.corelogic.asia/clspa-gateway/propertyhub/user/places/au/16062963?lat=-37.79679918&lon=145.02505558&size=10";
// schemas/schools.schema.ts

// School Metadata Schema
export const SchoolMetadataSchema = z.object({
  schoolName: z.string(),
  schoolType: z.enum(["Primary", "Secondary", "Combined", "Special", "Other"]),
  schoolGender: z.enum(["C", "B", "G"]), // C = Coeducational, B = Boys, G = Girls
  schoolSector: z.enum(["Government", "Non-Government", "Catholic"]),
  schoolWebsite: z.string().url().optional(),
  schoolYearLow: z.number().int().min(0).max(12),
  schoolYearHigh: z.number().int().min(0).max(12),
  schoolEnrolments: z.number().int().min(0),
});

// Place Metadata Schema
export const PlaceMetadataSchema = z.object({
  school: z.array(SchoolMetadataSchema),
});

// School Place Schema
export const SchoolPlaceSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  distanceFromTarget: z.number(), // in kilometers
  localityName: z.string(),
  placeId: z.number(),
  placeMetaData: PlaceMetadataSchema,
  placeName: z.string(),
  postcodeName: z.string(),
  placeSingleLineAddress: z.string(),
  shape: z.string().optional(), // KML Polygon
  targetInShape: z.boolean(),
});

// Schools Response Schema (array of schools)
export const SchoolsResponseSchema = z.array(SchoolPlaceSchema);

// Grouped Schools Schema
export const GroupedSchoolsSchema = z.object({
  primary: z.array(SchoolPlaceSchema),
  secondary: z.array(SchoolPlaceSchema),
  combined: z.array(SchoolPlaceSchema),
  special: z.array(SchoolPlaceSchema),
  other: z.array(SchoolPlaceSchema),
});

// School Summary Schema
export const SchoolSummarySchema = z.object({
  totalSchools: z.number(),
  schoolsInCatchment: z.number(),
  closestSchools: z.object({
    primary: z
      .object({
        name: z.string(),
        distance: z.number(),
        sector: z.string(),
        enrolments: z.number(),
        inCatchment: z.boolean(),
      })
      .optional(),
    secondary: z
      .object({
        name: z.string(),
        distance: z.number(),
        sector: z.string(),
        enrolments: z.number(),
        inCatchment: z.boolean(),
      })
      .optional(),
    combined: z
      .object({
        name: z.string(),
        distance: z.number(),
        sector: z.string(),
        enrolments: z.number(),
        inCatchment: z.boolean(),
      })
      .optional(),
  }),
  schoolsByType: z.object({
    primary: z.number(),
    secondary: z.number(),
    combined: z.number(),
    special: z.number(),
  }),
  schoolsBySector: z.object({
    government: z.number(),
    nonGovernment: z.number(),
    catholic: z.number(),
  }),
  within2km: z.number(),
  within5km: z.number(),
});

// Detailed School Info Schema (for individual school details)
export const DetailedSchoolInfoSchema = SchoolPlaceSchema.extend({
  schoolDetails: SchoolMetadataSchema,
  distanceInMeters: z.number(),
  isGovernment: z.boolean(),
  isNonGovernment: z.boolean(),
  isCoeducational: z.boolean(),
  yearRange: z.string(), // e.g., "Prep-6", "7-12"
  catchmentStatus: z.enum(["in_catchment", "out_of_catchment", "unknown"]),
});

// Type exports
export type SchoolMetadata = z.infer<typeof SchoolMetadataSchema>;
export type PlaceMetadata = z.infer<typeof PlaceMetadataSchema>;
export type SchoolPlace = z.infer<typeof SchoolPlaceSchema>;
export type SchoolsResponse = z.infer<typeof SchoolsResponseSchema>;
export type GroupedSchools = z.infer<typeof GroupedSchoolsSchema>;
export type SchoolSummary = z.infer<typeof SchoolSummarySchema>;
export type DetailedSchoolInfo = z.infer<typeof DetailedSchoolInfoSchema>;

// Validation functions
export function validateSchoolsResponse(data: unknown): SchoolsResponse {
  return SchoolsResponseSchema.parse(data);
}

export function validateSchoolPlace(data: unknown): SchoolPlace {
  return SchoolPlaceSchema.parse(data);
}

export function validateSchoolSummary(data: unknown): SchoolSummary {
  return SchoolSummarySchema.parse(data);
}

// Helper functions
export function groupSchoolsByType(schools: SchoolPlace[]): GroupedSchools {
  const grouped: GroupedSchools = {
    primary: [],
    secondary: [],
    combined: [],
    special: [],
    other: [],
  };

  schools.forEach((school) => {
    const schoolInfo = school.placeMetaData.school[0];
    const type = schoolInfo.schoolType.toLowerCase();

    switch (type) {
      case "primary":
        grouped.primary.push(school);
        break;
      case "secondary":
        grouped.secondary.push(school);
        break;
      case "combined":
        grouped.combined.push(school);
        break;
      case "special":
        grouped.special.push(school);
        break;
      default:
        grouped.other.push(school);
    }
  });

  return grouped;
}

export function findClosestSchoolByType(
  schools: SchoolPlace[],
  type: "Primary" | "Secondary" | "Combined"
): SchoolPlace | null {
  const filtered = schools.filter(
    (s) => s.placeMetaData.school[0].schoolType === type
  );

  if (filtered.length === 0) return null;

  return filtered.reduce((closest, current) =>
    current.distanceFromTarget < closest.distanceFromTarget ? current : closest
  );
}

export function getSchoolsInCatchment(schools: SchoolPlace[]): SchoolPlace[] {
  return schools.filter((school) => school.targetInShape);
}

export function getSchoolsWithinDistance(
  schools: SchoolPlace[],
  maxDistance: number
): SchoolPlace[] {
  return schools.filter((school) => school.distanceFromTarget <= maxDistance);
}

export function createSchoolSummary(schools: SchoolPlace[]): SchoolSummary {
  const grouped = groupSchoolsByType(schools);
  const inCatchment = getSchoolsInCatchment(schools);
  const within2km = getSchoolsWithinDistance(schools, 2);
  const within5km = getSchoolsWithinDistance(schools, 5);

  const closestPrimary = findClosestSchoolByType(schools, "Primary");
  const closestSecondary = findClosestSchoolByType(schools, "Secondary");
  const closestCombined = findClosestSchoolByType(schools, "Combined");

  // Count by sector
  const sectors = schools.reduce(
    (acc, school) => {
      const sector = school.placeMetaData.school[0].schoolSector;
      if (sector === "Government") acc.government++;
      else if (sector === "Catholic") acc.catholic++;
      else acc.nonGovernment++;
      return acc;
    },
    { government: 0, nonGovernment: 0, catholic: 0 }
  );

  return {
    totalSchools: schools.length,
    schoolsInCatchment: inCatchment.length,
    closestSchools: {
      primary: closestPrimary
        ? {
            name: closestPrimary.placeName,
            distance: closestPrimary.distanceFromTarget,
            sector: closestPrimary.placeMetaData.school[0].schoolSector,
            enrolments: closestPrimary.placeMetaData.school[0].schoolEnrolments,
            inCatchment: closestPrimary.targetInShape,
          }
        : undefined,
      secondary: closestSecondary
        ? {
            name: closestSecondary.placeName,
            distance: closestSecondary.distanceFromTarget,
            sector: closestSecondary.placeMetaData.school[0].schoolSector,
            enrolments:
              closestSecondary.placeMetaData.school[0].schoolEnrolments,
            inCatchment: closestSecondary.targetInShape,
          }
        : undefined,
      combined: closestCombined
        ? {
            name: closestCombined.placeName,
            distance: closestCombined.distanceFromTarget,
            sector: closestCombined.placeMetaData.school[0].schoolSector,
            enrolments:
              closestCombined.placeMetaData.school[0].schoolEnrolments,
            inCatchment: closestCombined.targetInShape,
          }
        : undefined,
    },
    schoolsByType: {
      primary: grouped.primary.length,
      secondary: grouped.secondary.length,
      combined: grouped.combined.length,
      special: grouped.special.length,
    },
    schoolsBySector: sectors,
    within2km: within2km.length,
    within5km: within5km.length,
  };
}

export function getSchoolYearRange(school: SchoolMetadata): string {
  if (school.schoolYearLow === 0 && school.schoolYearHigh === 0) {
    return "Not specified";
  }

  const lowYear =
    school.schoolYearLow === 0 ? "Prep" : `Year ${school.schoolYearLow}`;
  const highYear =
    school.schoolYearHigh === 0 ? "?" : school.schoolYearHigh.toString();

  return `${lowYear}-${highYear}`;
}

export function enhanceSchoolInfo(school: SchoolPlace): DetailedSchoolInfo {
  const schoolData = school.placeMetaData.school[0];

  return {
    ...school,
    schoolDetails: schoolData,
    distanceInMeters: Math.round(school.distanceFromTarget * 1000),
    isGovernment: schoolData.schoolSector === "Government",
    isNonGovernment: schoolData.schoolSector === "Non-Government",
    isCoeducational: schoolData.schoolGender === "C",
    yearRange: getSchoolYearRange(schoolData),
    catchmentStatus: school.targetInShape ? "in_catchment" : "out_of_catchment",
  };
}

export function sortSchoolsByDistance(schools: SchoolPlace[]): SchoolPlace[] {
  return [...schools].sort(
    (a, b) => a.distanceFromTarget - b.distanceFromTarget
  );
}

export function filterGovernmentSchools(schools: SchoolPlace[]): SchoolPlace[] {
  return schools.filter(
    (s) => s.placeMetaData.school[0].schoolSector === "Government"
  );
}

export function getGenderLabel(gender: "C" | "B" | "G"): string {
  const labels = {
    C: "Coeducational",
    B: "Boys",
    G: "Girls",
  };
  return labels[gender];
}
