/**
 * Expected data structure for each section of the property report PDF.
 * This file defines what data should be present in each section for validation purposes.
 */

export type ExpectedSectionData = {
  sectionName: string;
  requiredFields: string[];
  optionalFields?: string[];
  headerField?: string; // The field that contains the section title/header
  expectedHeaderText?: string; // The expected text for the header
};

export const expectedSectionsData: ExpectedSectionData[] = [
  {
    sectionName: "Cover Page (with Executive Summary)",
    requiredFields: [
      "title",
      "address",
      "reportDate",
      "reportId",
      "executiveSummaryTitle",
      "propertyType",
      "council",
      "yearBuilt",
      "landArea",
      "floorArea",
      "distanceToCBD",
      "estimatedValue",
    ],
    optionalFields: ["logo"],
    headerField: "title",
    expectedHeaderText: "Property Report",
  },
  {
    sectionName: "Property Information",
    requiredFields: [
      "propertyInfoTitle",
      "propertyInfoSubtitle",
      "propertyDetails",
      "estimatedValue",
      "schoolCatchments",
    ],
    optionalFields: ["propertyImage"],
    headerField: "propertyInfoTitle",
    expectedHeaderText: "Property Information",
  },
  {
    sectionName: "Planning and Zoning",
    requiredFields: ["planningTitle", "planningSubtitle", "planningDetails", "note"],
    headerField: "planningTitle",
    expectedHeaderText: "Planning and Zoning",
  },
  {
    sectionName: "Environmental Considerations",
    requiredFields: [
      "environmentalTitle",
      "environmentalSubtitle",
      "considerationsList",
      "considerationsList2",
      "note",
    ],
    headerField: "environmentalTitle",
    expectedHeaderText: "Environmental and Planning Considerations",
  },
  {
    sectionName: "Infrastructure",
    requiredFields: [
      "infrastructureTitle",
      "infrastructureSubtitle",
      "utilitiesTitle",
      "utilities",
      "amenitiesTitle",
      "amenities",
    ],
    headerField: "infrastructureTitle",
    expectedHeaderText: "Infrastructure Considerations",
  },
  {
    sectionName: "Location and Suburb Analysis",
    requiredFields: [
      "locationTitle",
      "locationInfo",
      "demographicsTitle",
      "demographics",
      "occupancyTitle",
      "occupancy",
      "rentalYieldTitle",
      "rentalYield",
    ],
    headerField: "locationTitle",
    expectedHeaderText: "Location and Suburb Analysis",
  },
  {
    sectionName: "Pricelabs Estimate",
    requiredFields: [
      "pricelabsTitle",
      "pricelabsSubtitle",
      "ratesTitle",
      "rates",
      "revenueTitle",
      "revenue",
      "note",
    ],
    headerField: "pricelabsTitle",
    expectedHeaderText: "Pricelabs Rental Estimate",
  },
];

export function getExpectedSectionCount(): number {
  return expectedSectionsData.length;
}

export function getExpectedPageCount(): number {
  // Each section = 1 page
  // Note: Floor Plan section is optional and returns null if no data
  // So actual page count might be less than total sections
  return expectedSectionsData.length;
}
