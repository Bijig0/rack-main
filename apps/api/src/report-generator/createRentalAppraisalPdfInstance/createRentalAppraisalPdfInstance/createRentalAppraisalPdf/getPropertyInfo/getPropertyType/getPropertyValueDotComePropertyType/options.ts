import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const propertyTypeParseOptions = {
  strategies: [
    {
      name: "table-cell-property-type",
      selectors: [
        'td:contains("Property Type")',
        'td:contains("Property type")',
        'td:contains("Type")',
        'td:contains("Dwelling Type")',
        'td:contains("Building Type")',
        'td:contains("Home Type")',
        'td:contains("Residence Type")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Property Type")',
        'th:contains("Type")',
        'th:contains("Dwelling Type")',
        'th:contains("Building Type")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-property-type",
      selectors: [
        '[data-testid*="property-type"]',
        '[data-testid*="propertyType"]',
        '[data-testid*="property_type"]',
        '[data-testid*="dwelling-type"]',
        '[data-testid*="dwellingType"]',
        '[data-testid*="building-type"]',
        '[data-testid*="buildingType"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Property Type")',
        'dt:contains("Type")',
        'dt:contains("Dwelling Type")',
        'dt:contains("Building Type")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.text,
  fallbackPatterns: [
    /property\s+type[:\s]+([A-Za-z\s]+)/i,
    /dwelling\s+type[:\s]+([A-Za-z\s]+)/i,
    /building\s+type[:\s]+([A-Za-z\s]+)/i,
    /type[:\s]+(house|unit|apartment|townhouse|villa|land|rural|acreage|duplex|studio|flat)/i,
  ],
} satisfies FieldParseConfig;
