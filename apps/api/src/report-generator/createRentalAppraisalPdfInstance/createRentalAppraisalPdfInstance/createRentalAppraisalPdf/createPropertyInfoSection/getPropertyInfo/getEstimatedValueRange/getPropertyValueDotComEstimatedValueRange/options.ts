import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const estimatedValueRangeParseOptions = {
  strategies: [
    {
      name: "prop-estimated-price",
      selectors: [
        "#propEstimatedPrice",
        "h4.price#propEstimatedPrice",
        "h4.price",
      ],
      extractText: ($element) => {
        return $element.clone().children().remove().end().text().trim();
      },
    },
    {
      name: "table-cell-estimated-value",
      selectors: [
        'td:contains("Estimated Value")',
        'td:contains("Estimated Range")',
        'td:contains("Value Range")',
        'td:contains("Price Estimate")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Estimated Value")',
        'th:contains("Estimated Range")',
        'th:contains("Value Range")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-estimated",
      selectors: [
        '[data-testid*="estimated-value"]',
        '[data-testid*="estimatedValue"]',
        '[data-testid*="estimated-price"]',
        '[data-testid*="estimatedPrice"]',
        '[data-testid*="value-range"]',
        '[data-testid*="valueRange"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Estimated Value")',
        'dt:contains("Estimated Range")',
        'dt:contains("Value Range")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: (text: string): { low: number; mid: number; high: number; currency: string; source: string } | null => {
    if (!text) return null;

    // Match pattern like "$3,000,000 - $3,250,000"
    const rangeMatch = text.match(/\$\s*([\d,]+)\s*-\s*\$?\s*([\d,]+)/);
    if (rangeMatch) {
      const low = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
      const high = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
      if (!isNaN(low) && !isNaN(high) && low > 0 && high > 0) {
        // Calculate mid as the average of low and high
        const mid = Math.round((low + high) / 2);
        return {
          low,
          mid,
          high,
          currency: "AUD",
          source: "corelogic",
        };
      }
    }

    return null;
  },
  fallbackPatterns: [
    /estimated\s+(?:value|price)[:\s]+\$\s*([\d,]+)\s*-\s*\$?\s*([\d,]+)/i,
    /value\s+range[:\s]+\$\s*([\d,]+)\s*-\s*\$?\s*([\d,]+)/i,
    /\$\s*([\d,]+)\s*-\s*\$?\s*([\d,]+)/i,
  ],
} satisfies FieldParseConfig;
