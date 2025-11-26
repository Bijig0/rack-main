import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const yearBuiltParseOptions = {
  strategies: [
    {
      name: "table-cell-year-built",
      selectors: [
        'td:contains("Year Built")',
        'td:contains("Year built")',
        'td:contains("Built")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Year Built")',
        'th:contains("Year built")',
        'th:contains("Built")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-year",
      selectors: [
        '[data-testid*="year-built"]',
        '[data-testid*="yearBuilt"]',
        '[data-testid*="year_built"]',
      ],
    },
    {
      name: "class-year",
      selectors: [
        ".year-built",
        ".year_built",
        ".property-year",
        ".built-year",
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Year Built")',
        'dt:contains("Year built")',
        'dt:contains("Built")',
        'dt:contains("Construction Year")',
      ],
      siblingElement: "dd" as const,
    },
    {
      name: "label-value",
      selectors: [
        'label:contains("Year Built") + span',
        'label:contains("Year built") + span',
        '.label:contains("Year Built") + .value',
      ],
    },
  ],
  extractValue: textExtractors.year,
  fallbackPatterns: [
    /year\s+built[:\s]+(\d{4})/i,
    /built\s+(?:in\s+)?(\d{4})/i,
    /construction\s+year[:\s]+(\d{4})/i,
    /(\d{4})\s+built/i,
  ],
} satisfies FieldParseConfig;
