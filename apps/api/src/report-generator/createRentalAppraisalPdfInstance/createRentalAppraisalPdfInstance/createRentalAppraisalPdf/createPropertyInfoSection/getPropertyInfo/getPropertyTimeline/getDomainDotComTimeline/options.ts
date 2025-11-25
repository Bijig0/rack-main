import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const propertyTimelineParseOptions = {
  strategies: [
    {
      name: "property-timeline-list",
      selectors: [
        "ul.css-m3i618",
        'ul:has([data-testid="fe-co-property-timeline-card-category"])',
      ],
      extractText: ($element) => {
        const events: string[] = [];
        const $items = $element.find("li");

        for (let i = 0; i < $items.length; i++) {
          const $event = $items.eq(i);

          const month = $event.find('[class*="vajoca"]').text().trim();
          const year = $event.find('[class*="1qi20sy"]').text().trim();
          const type = $event
            .find('[data-testid="fe-co-property-timeline-card-category"]')
            .text()
            .trim();
          const price = $event
            .find('[data-testid="fe-co-property-timeline-card-heading"]')
            .text()
            .trim();
          const method = $event.find('[class*="obiveq"]').text().trim();
          const agency = $event
            .find('[data-testid="fe-co-property-timeline-card-body-text-bold"]')
            .text()
            .trim();

          if (year || type || price) {
            events.push(
              JSON.stringify({ month, year, type, price, method, agency })
            );
          }
        }
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
    occurenceType: "sold" | "leased" | "rented";
    price: number;
    occurenceDate: Date;
    occurenceBroker: string | null;
  }> | null => {
    if (!text) return null;

    // Handle JSON-encoded events from extractText
    let rawEvents: any[] = [];

    if (text.includes("|||")) {
      rawEvents = text
        .split("|||")
        .map((eventStr) => {
          try {
            return JSON.parse(eventStr);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } else {
      // Handle single event
      try {
        const parsed = JSON.parse(text);
        rawEvents = [parsed];
      } catch {
        return null;
      }
    }

    if (rawEvents.length === 0) return null;

    // Transform raw events to match schema
    const transformedEvents = rawEvents
      .map((event) => {
        // Parse type
        const typeLower = (event.type || "").toLowerCase();
        let occurenceType: "sold" | "leased" | "rented" = "sold";
        if (typeLower.includes("lease") || typeLower.includes("rent")) {
          occurenceType = typeLower.includes("lease") ? "leased" : "rented";
        }

        // Parse price - handle formats like "$3.141621m", "$1,200,000", "$1.2m", etc.
        let priceStr = (event.price || "").toLowerCase();

        // Check for million/thousand suffixes
        const hasMillions = priceStr.includes('m');
        const hasThousands = priceStr.includes('k');

        // Remove $, commas, and suffix letters
        priceStr = priceStr.replace(/[\$,mk]/g, "");

        let price = parseFloat(priceStr);
        if (isNaN(price) || price <= 0) return null;

        // Apply multiplier
        if (hasMillions) {
          price = Math.round(price * 1000000);
        } else if (hasThousands) {
          price = Math.round(price * 1000);
        } else {
          price = Math.round(price);
        }

        // Parse date from month and year
        const month = event.month || "Jan";
        const year = event.year || new Date().getFullYear().toString();
        const dateStr = `${month} 1, ${year}`;
        const occurenceDate = new Date(dateStr);
        if (isNaN(occurenceDate.getTime())) return null;

        // Parse broker/agency
        const occurenceBroker = event.agency || null;

        return {
          occurenceType,
          price,
          occurenceDate,
          occurenceBroker,
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);

    return transformedEvents.length > 0 ? transformedEvents : null;
  },
  fallbackPatterns: [
    /sold\s+(\d{1,2}\s+\w+\s+\d{4})[:\s]+\$?([\d,]+)/gi,
    /(\d{4})\s+sold\s+\$?([\d,]+)/gi,
  ],
} satisfies FieldParseConfig;
