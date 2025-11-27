import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const bedroomCountParseOptions = {
  strategies: [
    {
      name: "table-cell-bedrooms",
      selectors: [
        'td:contains("Bedrooms")',
        'td:contains("Bedroom")',
        'td:contains("Beds")',
        'td:contains("Bed")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Bedrooms")',
        'th:contains("Bedroom")',
        'th:contains("Beds")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-bedrooms",
      selectors: [
        '[data-testid*="bedroom"]',
        '[data-testid*="bedrooms"]',
        '[data-testid*="bed-count"]',
        '[data-testid*="beds"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Bedrooms")',
        'dt:contains("Bedroom")',
        'dt:contains("Beds")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.number,
  fallbackPatterns: [/(\d+)\s*bed(?:room)?s?/i, /bed(?:room)?s?[:\s]+(\d+)/i],
} satisfies FieldParseConfig;
