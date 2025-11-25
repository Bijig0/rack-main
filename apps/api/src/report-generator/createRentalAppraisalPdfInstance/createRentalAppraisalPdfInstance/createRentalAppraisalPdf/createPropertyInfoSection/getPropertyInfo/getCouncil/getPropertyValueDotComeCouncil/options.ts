import { textExtractors } from "../../utils/parseFromHtml";
import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const councilParseOptions = {
  strategies: [
    {
      name: "table-cell-council",
      selectors: [
        'td:contains("Council")',
        'td:contains("Local Council")',
        'td:contains("Local Government")',
        'td:contains("LGA")',
        'td:contains("Municipality")',
        'td:contains("Shire")',
        'td:contains("City Council")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Council")',
        'th:contains("Local Council")',
        'th:contains("Local Government")',
        'th:contains("LGA")',
        'th:contains("Municipality")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-council",
      selectors: [
        '[data-testid*="council"]',
        '[data-testid*="local-government"]',
        '[data-testid*="localGovernment"]',
        '[data-testid*="lga"]',
        '[data-testid*="municipality"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Council")',
        'dt:contains("Local Council")',
        'dt:contains("Local Government")',
        'dt:contains("LGA")',
        'dt:contains("Municipality")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: textExtractors.text,
  fallbackPatterns: [
    /council[:\s]+([A-Za-z\s]+(?:Council|Shire|City))/i,
    /local\s+government[:\s]+([A-Za-z\s]+)/i,
    /lga[:\s]+([A-Za-z\s]+)/i,
    /municipality[:\s]+([A-Za-z\s]+)/i,
  ],
} satisfies FieldParseConfig;
