import { PropertyScraper, FallbackOptions } from "./types";
import { PropertyMetadata } from "../cache/schemas";

/**
 * Registry for fallback scrapers
 * Manages the waterfall strategy: PropertyHub → Domain → MicroBurbs → Property.com
 */
export class FallbackScraperRegistry {
  private scrapers: PropertyScraper[] = [];

  /**
   * Register a fallback scraper
   * Scrapers are tried in registration order
   */
  register(scraper: PropertyScraper): void {
    this.scrapers.push(scraper);
    console.log(
      `📝 Registered fallback scraper: ${scraper.name} (supports: ${scraper.supportedFields.join(", ")})`
    );
  }

  /**
   * Get all registered scrapers
   */
  getScrapers(): PropertyScraper[] {
    return this.scrapers;
  }

  /**
   * Fill missing fields using fallback scrapers
   *
   * @param primaryData - Data from primary scraper (PropertyHub)
   * @param address - Property address
   * @param options - Fallback options
   * @returns Enriched data with fallback values
   */
  async fillMissingFields(
    primaryData: PropertyMetadata,
    address: string,
    options: FallbackOptions = {}
  ): Promise<PropertyMetadata> {
    const {
      enableFallbacks = true,
      maxFallbacks = 3,
      onlyFallbackForFields,
    } = options;

    if (!enableFallbacks) {
      console.log("⚠️  Fallback scrapers disabled");
      return primaryData;
    }

    // Identify missing fields
    const missingFields = this.getMissingFields(
      primaryData,
      onlyFallbackForFields
    );

    if (missingFields.length === 0) {
      console.log("✅ All fields present, no fallbacks needed");
      return primaryData;
    }

    console.log(`\n🔄 Missing ${missingFields.length} fields: ${missingFields.join(", ")}`);
    console.log(`   Trying fallback scrapers (max ${maxFallbacks} attempts)...\n`);

    let enrichedData = { ...primaryData };
    let remainingMissingFields = [...missingFields];

    // Try each fallback scraper until all fields are filled or scrapers exhausted
    for (let i = 0; i < Math.min(this.scrapers.length, maxFallbacks); i++) {
      const scraper = this.scrapers[i];

      // Check if this scraper can provide any of the missing fields
      const canProvideFields = scraper.supportedFields.filter((field) =>
        remainingMissingFields.includes(field)
      );

      if (canProvideFields.length === 0) {
        console.log(`⏭️  Skipping ${scraper.name} (doesn't support missing fields)`);
        continue;
      }

      console.log(`\n🌐 Trying fallback scraper ${i + 1}/${maxFallbacks}: ${scraper.name}`);
      console.log(`   Can provide: ${canProvideFields.join(", ")}`);

      try {
        const fallbackData = await scraper.scrape(address);

        // Merge fallback data (only for missing fields)
        let filledCount = 0;
        for (const field of canProvideFields) {
          if (fallbackData[field] !== null && fallbackData[field] !== undefined) {
            enrichedData[field] = fallbackData[field];
            remainingMissingFields = remainingMissingFields.filter((f) => f !== field);
            filledCount++;
            console.log(`   ✅ Filled: ${field}`);
          }
        }

        console.log(`   📊 Filled ${filledCount}/${canProvideFields.length} fields from ${scraper.name}`);

        // If all fields are now filled, stop trying fallbacks
        if (remainingMissingFields.length === 0) {
          console.log(`\n✅ All missing fields filled! Stopping fallback attempts.`);
          break;
        }
      } catch (error) {
        console.error(`   ❌ ${scraper.name} failed:`, error instanceof Error ? error.message : String(error));
        console.log(`   ⏭️  Continuing to next fallback...`);
      }
    }

    if (remainingMissingFields.length > 0) {
      console.log(
        `\n⚠️  Still missing ${remainingMissingFields.length} fields after fallbacks: ${remainingMissingFields.join(", ")}`
      );
    } else {
      console.log(`\n✅ Successfully filled all missing fields using fallbacks!`);
    }

    return enrichedData;
  }

  /**
   * Identify which fields are missing/null in the data
   */
  private getMissingFields(
    data: PropertyMetadata,
    onlyCheckFields?: Array<keyof PropertyMetadata>
  ): Array<keyof PropertyMetadata> {
    const fieldsToCheck: Array<keyof PropertyMetadata> = onlyCheckFields || [
      "yearBuilt",
      "floorArea",
      "landArea",
      "propertyType",
      "council",
      "distanceFromCBD",
      "nearbySchools",
      "appraisalSummary",
      "estimatedValueRange",
    ];

    return fieldsToCheck.filter((field) => {
      const value = data[field];
      return value === null || value === undefined || value === "";
    });
  }
}

/**
 * Global singleton registry
 */
export const fallbackScraperRegistry = new FallbackScraperRegistry();
