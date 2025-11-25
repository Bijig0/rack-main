import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const propertyTimelineParseOptions = {
  strategies: [
    {
      name: "property-timeline-events",
      selectors: [
        '[class*="PropertyTimelineEvents__TimelineBody"]',
        '[class*="TimelineBody"]',
      ],
      extractText: ($element) => {
        const events: string[] = [];
        $element.find('[class*="TimelineEventWrapper"]').each((_, el) => {
          const $event = $element.constructor(el);

          const year =
            $event.find("time").attr("datetime") ||
            $event.find("time").text().trim();
          const type = $event
            .find('[class*="BadgeWithStatus"] span[class*="Content"]')
            .text()
            .trim();
          const price = $event.find('[class*="EventTitle"]').text().trim();
          const details = $event.find('[class*="EventDetails"]').text().trim();

          if (year || type || price || details) {
            events.push(JSON.stringify({ year, type, price, details }));
          }
        });
        return events.join("|||");
      },
    },
    {
      name: "table-cell-timeline",
      selectors: [
        'td:contains("Property Timeline")',
        'td:contains("Property History")',
        'td:contains("Sales History")',
        'td:contains("Transaction History")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-timeline",
      selectors: [
        '[data-testid*="property-timeline"]',
        '[data-testid*="propertyTimeline"]',
        '[data-testid*="property-history"]',
        '[data-testid*="propertyHistory"]',
        '[data-testid*="sales-history"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Property Timeline")',
        'dt:contains("Property History")',
        'dt:contains("Sales History")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: (
    text: string
  ): Array<{
    year: string;
    type: string;
    price: string;
    details: string;
  }> | null => {
    if (!text) return null;

    // Handle JSON-encoded events from extractText
    if (text.includes("|||")) {
      const events = text
        .split("|||")
        .map((eventStr) => {
          try {
            return JSON.parse(eventStr);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      return events.length > 0 ? events : null;
    }

    // Handle single event
    try {
      const parsed = JSON.parse(text);
      return [parsed];
    } catch {
      return null;
    }
  },
  fallbackPatterns: [
    /sold\s+(\d{1,2}\s+\w+\s+\d{4})[:\s]+\$?([\d,]+)/gi,
    /(\d{4})\s+sold\s+\$?([\d,]+)/gi,
  ],
} satisfies FieldParseConfig;
