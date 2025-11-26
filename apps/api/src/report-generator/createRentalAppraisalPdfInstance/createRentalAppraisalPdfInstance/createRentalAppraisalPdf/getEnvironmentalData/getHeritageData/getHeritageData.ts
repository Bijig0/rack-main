#!/Users/a61403/.bun/bin/bun
import { Address } from "../../../../../../../shared/types";
import { analyzeHeritageData, HeritageAnalysisData } from "./analyzeHeritageData";

type Args = {
  address: Address;
  planningOverlayBufferMeters?: number;
};

type Return = {
  heritageData: HeritageAnalysisData;
};

/**
 * Gets comprehensive heritage data for a property
 *
 * This is the main entry point for heritage analysis. It combines:
 * 1. Victorian Heritage Inventory data (from getVicmapHeritageData)
 * 2. Planning Scheme Overlay data (from getPlanningOverlayData)
 *
 * Returns a complete heritage analysis including:
 * - Heritage significance level (VERY_HIGH to MINIMAL)
 * - Heritage listings affecting or near the property
 * - Planning overlays (Heritage Overlay, ESO, VPO)
 * - Whether heritage permits are required
 * - Planning and development recommendations
 *
 * @param address - The property address to analyze
 * @param planningOverlayBufferMeters - Buffer radius for planning overlay search (default: 500m)
 */
export const getHeritageData = async ({
  address,
  planningOverlayBufferMeters = 500,
}: Args): Promise<Return> => {
  const { heritageAnalysis } = await analyzeHeritageData({
    address,
    planningOverlayBufferMeters,
  });

  return { heritageData: heritageAnalysis };
};

// Allow running this file directly for testing
if (import.meta.main) {
  const testAddresses: Address[] = [
    {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
    },
    {
      addressLine: "Shrine of Remembrance",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3004",
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

    const { heritageData } = await getHeritageData({
      address,
      planningOverlayBufferMeters: 500,
    });

    console.log("\n📊 Heritage Data Summary:\n");
    console.log(`Significance Level: ${heritageData.significanceLevel}`);
    console.log(`Requires Heritage Permit: ${heritageData.requiresHeritagePermit ? "YES" : "NO"}`);
    console.log(`\nDescription:`);
    console.log(`  ${heritageData.description}`);

    if (heritageData.heritageListings.length > 0) {
      console.log(`\nHeritage Listings (${heritageData.heritageListings.length}):`);
      heritageData.heritageListings.slice(0, 3).forEach((listing, i) => {
        console.log(`  ${i + 1}. ${listing}`);
      });
      if (heritageData.heritageListings.length > 3) {
        console.log(`  ... and ${heritageData.heritageListings.length - 3} more`);
      }
    }

    if (heritageData.planningOverlays.length > 0) {
      console.log(`\nPlanning Overlays (${heritageData.planningOverlays.length}):`);
      heritageData.planningOverlays.slice(0, 3).forEach((overlay, i) => {
        const affectsText = overlay.affectsProperty
          ? "AFFECTS PROPERTY"
          : `${Math.round(overlay.distance || 0)}m away`;
        console.log(`  ${i + 1}. ${overlay.code} - ${affectsText}`);
      });
      if (heritageData.planningOverlays.length > 3) {
        console.log(`  ... and ${heritageData.planningOverlays.length - 3} more`);
      }
    }

    console.log(`\nRecommendations (${heritageData.recommendations.length}):`);
    heritageData.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
    if (heritageData.recommendations.length > 3) {
      console.log(`  ... and ${heritageData.recommendations.length - 3} more`);
    }

    console.log();
  }
}
