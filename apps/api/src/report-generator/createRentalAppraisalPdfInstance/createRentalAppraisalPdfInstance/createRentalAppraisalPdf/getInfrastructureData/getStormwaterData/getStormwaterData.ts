#!/Users/a61403/.bun/bin/bun
import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { queryMelbourneWaterCatchment } from "./queryMelbourneWaterCatchment/queryMelbourneWaterCatchment";
import { getRetardingBasins } from "./getRetardingBasins/getRetardingBasins";
import { analyzeStormwaterRisk } from "./analyzeStormwaterRisk/analyzeStormwaterRisk";
import { StormwaterData } from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  stormwaterData: StormwaterData;
};

/**
 * Gets comprehensive stormwater infrastructure data for a property
 *
 * This is the main entry point for stormwater analysis. It combines:
 * 1. Drainage catchment identification (Melbourne Water)
 * 2. Nearby retarding basin locations (Vicmap)
 * 3. Stormwater risk assessment
 *
 * Data Sources:
 * - Melbourne Water ArcGIS: Catchment boundaries
 * - Vicmap Open Data Platform: Retarding basins and dams
 *
 * Returns comprehensive stormwater analysis including:
 * - Which drainage catchment the property belongs to
 * - Nearby flood retarding basins and their capacity
 * - Stormwater risk level (VERY_HIGH to LOW)
 * - Whether adequate stormwater drainage exists
 * - Planning and flood mitigation recommendations
 *
 * @param address - The property address to analyze
 * @param bufferMeters - Buffer radius for retarding basin search (default: 3000m)
 * @returns Complete stormwater infrastructure data
 *
 * @example
 * ```typescript
 * const { stormwaterData } = await getStormwaterData({
 *   address: {
 *     addressLine: "1 Flinders Street",
 *     suburb: "Melbourne",
 *     state: "VIC",
 *     postcode: "3000"
 *   },
 *   bufferMeters: 3000
 * });
 * ```
 */
export const getStormwaterData = async ({
  address,
  bufferMeters = 3000,
}: Args): Promise<Return> => {
  console.log("\n💧 Analyzing stormwater infrastructure...");

  try {
    // Step 1: Geocode the address
    console.log("Geocoding address...");
    const { lat, lon } = await geocodeAddress({ address });
    console.log(`Coordinates: ${lat}, ${lon}`);

    // Step 2: Query drainage catchment using ArcGIS REST API
    console.log("Querying drainage catchment...");
    const drainageCatchment = await queryMelbourneWaterCatchment({
      lat,
      lon,
    });

    if (drainageCatchment) {
      console.log(
        `Property in ${drainageCatchment.name} catchment (${drainageCatchment.area} ha)`
      );
    } else {
      console.log("Property not within identified catchment boundaries");
    }

    // Step 3: Find nearby retarding basins
    console.log(`Searching for retarding basins within ${bufferMeters}m...`);
    const retardingBasins = await getRetardingBasins({
      lat,
      lon,
      bufferMeters,
    });

    console.log(`Found ${retardingBasins.length} retarding basin(s)`);
    if (retardingBasins.length > 0) {
      const nearest = retardingBasins[0];
      console.log(`Nearest: ${nearest.name} (${nearest.distance}m away)`);
    }

    // Step 4: Analyze stormwater risk
    console.log("Analyzing stormwater risk...");
    const { riskLevel, description, recommendations } = analyzeStormwaterRisk({
      drainageCatchment,
      retardingBasins,
      lat,
      lon,
    });

    console.log(`Risk Level: ${riskLevel}`);

    // Step 5: Determine if property has stormwater drainage
    // Property has drainage if:
    // - It's within an identified catchment, OR
    // - There are retarding basins nearby (indicating urban stormwater system)
    const hasStormwaterDrainage =
      drainageCatchment !== undefined || retardingBasins.length > 0;

    const stormwaterData: StormwaterData = {
      drainageCatchment,
      nearbyRetardingBasins: retardingBasins.slice(0, 10), // Limit to 10 nearest
      stormwaterRiskLevel: riskLevel,
      hasStormwaterDrainage,
      description,
      recommendations,
    };

    console.log("✅ Stormwater analysis complete");
    console.log(`   Catchment: ${drainageCatchment?.name || "Not identified"}`);
    console.log(`   Retarding basins: ${retardingBasins.length}`);
    console.log(`   Risk level: ${riskLevel}`);
    console.log(`   Has drainage: ${hasStormwaterDrainage ? "Yes" : "No"}`);

    return { stormwaterData };
  } catch (error) {
    console.error("Error analyzing stormwater data:", error);

    // Return minimal data if analysis fails
    return {
      stormwaterData: {
        drainageCatchment: undefined,
        nearbyRetardingBasins: [],
        stormwaterRiskLevel: undefined,
        hasStormwaterDrainage: false,
        description:
          "Unable to complete stormwater analysis. Recommend professional flood risk assessment.",
        recommendations: [
          "Consult with Melbourne Water regarding flood risk",
          "Obtain professional flood risk assessment",
          "Check if property is within Land Subject to Inundation Overlay (LSIO)",
          "Review council planning scheme for flood-related overlays",
          "Consider comprehensive flood insurance",
        ],
      },
    };
  }
};

// Allow running this file directly for testing
if (import.meta.main) {
  const testAddresses: Address[] = [
    {
      addressLine: "1 Flinders Street",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
    },
    {
      addressLine: "Melbourne Cricket Ground",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3002",
    },
    {
      addressLine: "50 Welsford Street",
      suburb: "Shepparton",
      state: "VIC" as const,
      postcode: "3630",
    },
  ];

  for (const address of testAddresses) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(
      `Testing: ${address.addressLine}, ${address.suburb} ${address.postcode}`
    );
    console.log("=".repeat(80));

    const { stormwaterData } = await getStormwaterData({
      address,
      bufferMeters: 3000,
    });

    console.log("\n📊 Stormwater Data Summary:\n");
    console.log(`Risk Level: ${stormwaterData.stormwaterRiskLevel}`);
    console.log(`Has Stormwater Drainage: ${stormwaterData.hasStormwaterDrainage ? "YES" : "NO"}`);

    if (stormwaterData.drainageCatchment) {
      console.log(`\nDrainage Catchment:`);
      console.log(`  Name: ${stormwaterData.drainageCatchment.name}`);
      console.log(`  Area: ${stormwaterData.drainageCatchment.area} hectares`);
      console.log(`  Waterway: ${stormwaterData.drainageCatchment.waterway}`);
    }

    if (stormwaterData.nearbyRetardingBasins.length > 0) {
      console.log(`\nNearby Retarding Basins (${stormwaterData.nearbyRetardingBasins.length}):`);
      stormwaterData.nearbyRetardingBasins.slice(0, 5).forEach((basin, i) => {
        const capacityStr = basin.capacity
          ? ` - ${basin.capacity}ML capacity`
          : "";
        const ownerStr = basin.owner ? ` (${basin.owner})` : "";
        console.log(
          `  ${i + 1}. ${basin.name} - ${basin.distance}m away${capacityStr}${ownerStr}`
        );
      });
      if (stormwaterData.nearbyRetardingBasins.length > 5) {
        console.log(
          `  ... and ${stormwaterData.nearbyRetardingBasins.length - 5} more`
        );
      }
    } else {
      console.log(`\nNo retarding basins found within search radius`);
    }

    console.log(`\nDescription:`);
    console.log(`  ${stormwaterData.description}`);

    console.log(`\nRecommendations (${stormwaterData.recommendations.length}):`);
    stormwaterData.recommendations.slice(0, 5).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
    if (stormwaterData.recommendations.length > 5) {
      console.log(
        `  ... and ${stormwaterData.recommendations.length - 5} more`
      );
    }

    console.log();
  }
}
