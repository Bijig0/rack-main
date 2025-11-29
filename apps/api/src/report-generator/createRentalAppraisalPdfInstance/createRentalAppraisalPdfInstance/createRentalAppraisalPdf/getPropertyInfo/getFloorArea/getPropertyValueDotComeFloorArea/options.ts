import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const floorAreaParseOptions = {
  strategies: [
    {
      name: "table-cell-floor-area",
      selectors: [
        'td:contains("Floor Area")',
        'td:contains("Floor area")',
        'td:contains("Floor Size")',
        'td:contains("Floor size")',
        'td:contains("Building Area")',
        'td:contains("Building Size")',
        'td:contains("Internal Area")',
        'td:contains("Living Area")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Floor Area")',
        'th:contains("Floor Size")',
        'th:contains("Building Area")',
        'th:contains("Internal Area")',
        'th:contains("Living Area")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-floor",
      selectors: [
        '[data-testid*="floor-area"]',
        '[data-testid*="floorArea"]',
        '[data-testid*="floor-size"]',
        '[data-testid*="floorSize"]',
        '[data-testid*="building-area"]',
        '[data-testid*="buildingArea"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Floor Area")',
        'dt:contains("Floor Size")',
        'dt:contains("Building Area")',
        'dt:contains("Internal Area")',
        'dt:contains("Living Area")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.area,
  fallbackPatterns: [
    /floor\s+area[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /floor\s+size[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /building\s+area[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /internal\s+area[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /living\s+area[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
  ],
} satisfies FieldParseConfig;
