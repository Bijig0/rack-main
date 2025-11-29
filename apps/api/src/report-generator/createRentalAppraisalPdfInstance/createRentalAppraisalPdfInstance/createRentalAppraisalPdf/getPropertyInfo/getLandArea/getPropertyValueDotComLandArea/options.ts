import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const landAreaParseOptions = {
  strategies: [
    {
      name: "table-cell-land-size",
      selectors: [
        'td:contains("Land Size")',
        'td:contains("Land size")',
        'td:contains("Land Area")',
        'td:contains("Land area")',
        'td:contains("Lot Size")',
        'td:contains("Block Size")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Land Size")',
        'th:contains("Land Area")',
        'th:contains("Lot Size")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-land",
      selectors: [
        '[data-testid*="land-size"]',
        '[data-testid*="landSize"]',
        '[data-testid*="land-area"]',
        '[data-testid*="landArea"]',
      ],
    },
    {
      name: "definition-list",
      selectors: ['dt:contains("Land Size")', 'dt:contains("Land Area")'],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.area,
  fallbackPatterns: [
    /land\s+size[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /land\s+area[:\s]+(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
    /(\d[\d,]*)\s*(?:m²|m2|sqm)/i,
  ],
} satisfies FieldParseConfig;
