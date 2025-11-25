import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const appraisalSummaryParseOptions = {
  strategies: [
    {
      name: "suburb-info-description",
      selectors: [
        ".suburbInfo_description_bsg",
        "p.suburbInfo_description_bsg",
      ],
    },
    {
      name: "table-cell-summary",
      selectors: [
        'td:contains("Appraisal Summary")',
        'td:contains("Summary")',
        'td:contains("Suburb Summary")',
        'td:contains("Area Summary")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Appraisal Summary")',
        'th:contains("Summary")',
        'th:contains("Suburb Summary")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-summary",
      selectors: [
        '[data-testid*="appraisal-summary"]',
        '[data-testid*="appraisalSummary"]',
        '[data-testid*="suburb-summary"]',
        '[data-testid*="suburbSummary"]',
        '[data-testid*="area-description"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Appraisal Summary")',
        'dt:contains("Summary")',
        'dt:contains("Suburb Summary")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.text,
  fallbackPatterns: [
    /the\s+size\s+of\s+\w+\s+is\s+approximately[\s\S]+?(?:Australian Bureau of Statistics\)|\.{3}|$)/i,
    /suburb\s+summary[:\s]+([\s\S]+?)(?:\n\n|$)/i,
    /area\s+summary[:\s]+([\s\S]+?)(?:\n\n|$)/i,
  ],
} satisfies FieldParseConfig;
