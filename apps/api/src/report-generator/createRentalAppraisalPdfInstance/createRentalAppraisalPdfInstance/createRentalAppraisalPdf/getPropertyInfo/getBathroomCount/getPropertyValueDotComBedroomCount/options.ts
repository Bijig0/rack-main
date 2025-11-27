import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const bathroomCountParseOptions = {
  strategies: [
    {
      name: "table-cell-bathrooms",
      selectors: [
        'td:contains("Bathrooms")',
        'td:contains("Bathroom")',
        'td:contains("Baths")',
        'td:contains("Bath")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Bathrooms")',
        'th:contains("Bathroom")',
        'th:contains("Baths")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-bathrooms",
      selectors: [
        '[data-testid*="bathroom"]',
        '[data-testid*="bathrooms"]',
        '[data-testid*="bath-count"]',
        '[data-testid*="baths"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Bathrooms")',
        'dt:contains("Bathroom")',
        'dt:contains("Baths")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.number,
  fallbackPatterns: [/(\d+)\s*bath(?:room)?s?/i, /bath(?:room)?s?[:\s]+(\d+)/i],
} satisfies FieldParseConfig;
