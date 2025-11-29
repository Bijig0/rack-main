import axios from "axios";
import { Address } from "../../../../../../shared/types";
import { createWfsParams } from "../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import {
  getFaunaVicmapResponseSchema,
  getFloraVicmapResponseSchema,
} from "./createBiodiversityResponseSchema/getBiodiversityResponseSchemaVicmapResponseSchema";
import { inferBiodiversityData } from "./createBiodiversityResponseSchema/inferRawBiodiversityData/inferRawBiodiversityData";
import {
  BiodiversityData,
  InferredFaunaData,
  InferredFloraData,
} from "./createBiodiversityResponseSchema/types";

type Args = {
  address: Address;
  debug?: boolean;
};

type Return = {
  biodiversityData: BiodiversityData;
};

const BIODIVERSITY_WFS_URL = WFS_DATA_URL;

/**
 * Determines sensitivity level based on biodiversity records
 *
 * - High: Multiple protected species or threatened species present
 * - Medium: Some native species present (flora or fauna)
 * - Low: Few species records in the area
 * - None: No biodiversity records found
 */
const determineSensitivityLevel = (
  floraData: InferredFloraData[],
  faunaData: InferredFaunaData[]
): BiodiversityData["sensitivityLevel"] => {
  const totalRecords = floraData.length + faunaData.length;

  if (totalRecords === 0) return "none";

  // Check for threatened/protected species indicators
  const hasThreatenedFlora = floraData.some(
    (f) =>
      f.victorianLifeCategory &&
      (f.victorianLifeCategory.toLowerCase().includes("endangered") ||
        f.victorianLifeCategory.toLowerCase().includes("vulnerable") ||
        f.victorianLifeCategory.toLowerCase().includes("rare"))
  );

  const hasNativeFlora = floraData.some(
    (f) => f.origin && f.origin.toLowerCase().includes("native")
  );

  // High sensitivity: Threatened species or many records
  if (hasThreatenedFlora || totalRecords > 20) {
    return "high";
  }

  // Medium sensitivity: Native species or moderate records
  if (hasNativeFlora || totalRecords > 5) {
    return "medium";
  }

  // Low sensitivity: Few records
  return "low";
};

/**
 * Generates a summary of biodiversity data
 */
const generateSummary = (
  floraData: InferredFloraData[],
  faunaData: InferredFaunaData[],
  sensitivityLevel: BiodiversityData["sensitivityLevel"]
): string | undefined => {
  const totalRecords = floraData.length + faunaData.length;

  if (totalRecords === 0) {
    return "No significant biodiversity records found in the immediate area.";
  }

  const parts: string[] = [];

  if (floraData.length > 0) {
    const uniqueFlora = new Set(floraData.map((f) => f.commonName)).size;
    parts.push(
      `${uniqueFlora} plant ${uniqueFlora === 1 ? "species" : "species"}`
    );
  }

  if (faunaData.length > 0) {
    const uniqueFauna = new Set(faunaData.map((f) => f.commonName)).size;
    parts.push(
      `${uniqueFauna} animal ${uniqueFauna === 1 ? "species" : "species"}`
    );
  }

  const speciesSummary = parts.join(" and ");

  if (sensitivityLevel === "high") {
    return `High biodiversity area with ${speciesSummary} recorded nearby. May include protected or threatened species.`;
  }

  if (sensitivityLevel === "medium") {
    return `Moderate biodiversity with ${speciesSummary} recorded in the vicinity.`;
  }

  return `${speciesSummary} recorded in the area.`;
};

/**
 * Generates alerts based on biodiversity analysis
 */
const generateAlerts = (
  floraData: InferredFloraData[],
  faunaData: InferredFaunaData[],
  sensitivityLevel: BiodiversityData["sensitivityLevel"]
): string[] | undefined => {
  const alerts: string[] = [];

  // Check for threatened species
  const threatenedFlora = floraData.filter(
    (f) =>
      f.victorianLifeCategory &&
      (f.victorianLifeCategory.toLowerCase().includes("endangered") ||
        f.victorianLifeCategory.toLowerCase().includes("vulnerable") ||
        f.victorianLifeCategory.toLowerCase().includes("rare"))
  );

  if (threatenedFlora.length > 0) {
    alerts.push(
      `Threatened plant species recorded nearby. Tree removal or vegetation clearing may require permits from DEECA.`
    );
  }

  // Native vegetation alerts
  const nativeFlora = floraData.filter(
    (f) => f.origin && f.origin.toLowerCase().includes("native")
  );

  if (nativeFlora.length > 5) {
    alerts.push(
      `Significant native vegetation in area. Native vegetation clearing requires assessment under Victoria's native vegetation regulations.`
    );
  }

  // High sensitivity alerts
  if (sensitivityLevel === "high") {
    alerts.push(
      `High biodiversity sensitivity area. Development may trigger referral to environmental authorities.`
    );
  }

  // General biodiversity overlay warning
  if (floraData.length + faunaData.length > 0) {
    alerts.push(
      `Check if property is affected by Environmental Significance Overlay (ESO) or Vegetation Protection Overlay (VPO).`
    );
  }

  return alerts.length > 0 ? alerts : undefined;
};

/**
 * Gets comprehensive biodiversity data for a property
 *
 * Fetches fauna and flora data from VBA (Victorian Biodiversity Atlas) via Vicmap
 * and returns simplified information suitable for property reports.
 *
 * @param address - The property address to analyze
 * @returns Simplified biodiversity data
 *
 * @example
 * ```typescript
 * const result = await getBiodiversityData({
 *   address: {
 *     addressLine: "123 Main Street",
 *     suburb: "Melbourne",
 *     state: "VIC",
 *     postcode: "3000"
 *   }
 * });
 *
 * console.log(result.biodiversityData.sensitivityLevel); // "medium"
 * console.log(result.biodiversityData.alerts); // [...]
 * ```
 */
export const getBiodiversityData = async ({
  address,
}: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address })!;

  const bioDiversityBuffer = 0.005; // latitude degrees (roughly 500m)

  // Fetch fauna and flora data in parallel
  const [faunaResponse, floraResponse] = await Promise.all([
    axios.get(BIODIVERSITY_WFS_URL, {
      params: createWfsParams({
        lat,
        lon,
        buffer: bioDiversityBuffer,
        typeName: "open-data-platform:vba_fauna25",
      }),
    }),
    axios.get(BIODIVERSITY_WFS_URL, {
      params: createWfsParams({
        lat,
        lon,
        buffer: bioDiversityBuffer,
        typeName: "open-data-platform:vba_flora25",
      }),
    }),
  ]);

  const parsedFloraResponse = getFloraVicmapResponseSchema().parse(
    floraResponse.data
  );

  const parsedFaunaResponse = getFaunaVicmapResponseSchema().parse(
    faunaResponse.data
  );

  const { inferredFloraData, inferredFaunaData } = inferBiodiversityData({
    faunaFeatures: parsedFaunaResponse.features,
    floraFeatures: parsedFloraResponse.features,
  });

  // Determine if in biodiversity overlay (has any records)
  const totalRecords = inferredFloraData.length + inferredFaunaData.length;
  const isInBiodiversityOverlay = totalRecords > 0;

  // Determine sensitivity level
  const sensitivityLevel = determineSensitivityLevel(
    inferredFloraData,
    inferredFaunaData
  );

  // Generate summary
  const summary = generateSummary(
    inferredFloraData,
    inferredFaunaData,
    sensitivityLevel
  );

  // Generate alerts
  const alerts = generateAlerts(
    inferredFloraData,
    inferredFaunaData,
    sensitivityLevel
  );

  // Distance to nearest habitat - use 0 if records exist (they're within the buffer)
  // null if no records
  const distanceToNearestHabitat = isInBiodiversityOverlay
    ? 0 // Records are within ~500m buffer
    : null;

  return {
    biodiversityData: {
      isInBiodiversityOverlay,
      sensitivityLevel,
      distanceToNearestHabitat,
      summary,
      alerts,
    },
  };
};

if (import.meta.main) {
  console.log("\n=== BIODIVERSITY DATA TEST ===\n");

  const testAddresses = [
    {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC" as const,
      postcode: "3101",
    },
    {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
    },
  ];

  for (const address of testAddresses) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(
      `ADDRESS: ${address.addressLine}, ${address.suburb} ${address.postcode}`
    );
    console.log("=".repeat(80));

    try {
      const { biodiversityData } = await getBiodiversityData({ address });

      console.log("\nBiodiversity Summary:");
      console.log(
        `  In Biodiversity Overlay: ${biodiversityData.isInBiodiversityOverlay}`
      );
      console.log(
        `  Sensitivity Level: ${biodiversityData.sensitivityLevel.toUpperCase()}`
      );
      console.log(
        `  Distance to Nearest Habitat: ${
          biodiversityData.distanceToNearestHabitat !== null
            ? `${biodiversityData.distanceToNearestHabitat}m (within search area)`
            : "N/A"
        }`
      );

      if (biodiversityData.summary) {
        console.log(`\nSummary: ${biodiversityData.summary}`);
      }

      if (biodiversityData.alerts && biodiversityData.alerts.length > 0) {
        console.log("\nAlerts:");
        biodiversityData.alerts.forEach((alert, index) => {
          console.log(`  ${index + 1}. ⚠️  ${alert}`);
        });
      } else {
        console.log("\nAlerts: None");
      }

      console.log("\nFull Data:");
      console.log(JSON.stringify(biodiversityData, null, 2));
    } catch (error) {
      console.error(`Error processing address: ${error}`);
    }
  }

  console.log(`\n${"=".repeat(80)}\n`);
}
