#!/Users/a61403/.bun/bin/bun
import { z } from "zod";
import { Address } from "../../../../../../../shared/types";
import { InferredHeritageData } from "./createHeritageResponseSchema/inferRawHeritageData/types";
import { getVicmapHeritageData } from "./getVicmapHeritageData";
import { getPlanningOverlayData } from "./getPlanningOverlayData/getPlanningOverlayData";
import { HeritageOverlayData } from "./getPlanningOverlayData/types";

// Heritage significance level classification
export const HeritageSignificanceLevelSchema = z.enum([
  "VERY_HIGH", // Property on Victorian Heritage Register or within Heritage Overlay
  "HIGH", // Property near Heritage Overlay or contains heritage inventory item
  "MODERATE", // Property near heritage inventory items
  "LOW", // Property in area with some heritage context
  "MINIMAL", // No heritage constraints identified
]);

export type HeritageSignificanceLevel = z.infer<
  typeof HeritageSignificanceLevelSchema
>;

// Heritage analysis result
export const HeritageAnalysisDataSchema = z.object({
  significanceLevel: HeritageSignificanceLevelSchema,
  heritageListings: z.array(z.string()), // List of heritage items affecting or near property
  planningOverlays: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      affectsProperty: z.boolean(),
      distance: z.number().optional(),
    })
  ),
  heritageInventoryItems: z.number(), // Count of nearby heritage inventory items
  requiresHeritagePermit: z.boolean(), // Whether development requires heritage permits
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type HeritageAnalysisData = z.infer<typeof HeritageAnalysisDataSchema>;

type Args = {
  address: Address;
  planningOverlayBufferMeters?: number;
};

type Return = {
  heritageAnalysis: HeritageAnalysisData;
};

/**
 * Analyzes comprehensive heritage significance for a property
 *
 * Combines multiple data sources:
 * 1. Victorian Heritage Inventory (heritage_inventory) - Protected heritage sites
 * 2. Planning Scheme Overlays (plan_overlay) - Heritage Overlays (HO), ESO, VPO
 *
 * Determines:
 * - Overall heritage significance level
 * - Whether property is subject to heritage controls
 * - Planning permit requirements
 * - Recommendations for development and conservation
 */
export async function analyzeHeritageData({
  address,
  planningOverlayBufferMeters = 500,
}: Args): Promise<Return> {
  console.log("\n🏛️  Analyzing heritage significance...");

  try {
    // Fetch heritage inventory data
    const { heritageData: inventoryItems } = await getVicmapHeritageData({ address });

    // Fetch planning overlay data
    const { heritageOverlays } = await getPlanningOverlayData({
      address,
      bufferMeters: planningOverlayBufferMeters,
    });

    // Check for Heritage Overlays affecting the property
    const affectingOverlays = heritageOverlays.filter((o) => o.affectsProperty);
    const nearbyOverlays = heritageOverlays.filter((o) => !o.affectsProperty);

    // Check for Victorian Heritage Register listings (VHR)
    const vhrListings = inventoryItems.filter(
      (item) => item.heritageManagementNumber.startsWith("VHR")
    );

    // Determine significance level
    const significanceLevel = determineSignificanceLevel(
      affectingOverlays,
      nearbyOverlays,
      inventoryItems,
      vhrListings
    );

    // Generate heritage listings summary
    const heritageListings = generateHeritageListings(
      affectingOverlays,
      inventoryItems
    );

    // Map overlays for output
    const planningOverlays = heritageOverlays.slice(0, 10).map((overlay) => ({
      code: overlay.overlayCode,
      name: overlay.overlayName,
      affectsProperty: overlay.affectsProperty,
      distance: overlay.distanceMeters,
    }));

    // Determine if heritage permit is required
    const requiresHeritagePermit = affectingOverlays.length > 0;

    // Generate description
    const description = generateDescription(
      significanceLevel,
      affectingOverlays,
      inventoryItems,
      vhrListings
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      significanceLevel,
      affectingOverlays,
      inventoryItems,
      vhrListings
    );

    const heritageAnalysis: HeritageAnalysisData = {
      significanceLevel,
      heritageListings,
      planningOverlays,
      heritageInventoryItems: inventoryItems.length,
      requiresHeritagePermit,
      description,
      recommendations,
    };

    console.log(`✅ Heritage analysis complete: ${significanceLevel}`);
    console.log(`   Heritage overlays affecting property: ${affectingOverlays.length}`);
    console.log(`   Nearby heritage overlays: ${nearbyOverlays.length}`);
    console.log(`   Heritage inventory items: ${inventoryItems.length}`);
    console.log(`   Requires heritage permit: ${requiresHeritagePermit ? "Yes" : "No"}`);

    return { heritageAnalysis };
  } catch (error) {
    console.error("Error analyzing heritage data:", error);

    // Return minimal significance if analysis fails
    return {
      heritageAnalysis: {
        significanceLevel: "MINIMAL",
        heritageListings: [],
        planningOverlays: [],
        heritageInventoryItems: 0,
        requiresHeritagePermit: false,
        description: "Unable to complete heritage analysis",
        recommendations: [
          "Consult with local council regarding heritage requirements",
          "Consider obtaining a heritage assessment for any significant works",
        ],
      },
    };
  }
}

/**
 * Determines overall heritage significance level
 */
function determineSignificanceLevel(
  affectingOverlays: HeritageOverlayData[],
  nearbyOverlays: HeritageOverlayData[],
  inventoryItems: InferredHeritageData[],
  vhrListings: InferredHeritageData[]
): HeritageSignificanceLevel {
  // VERY HIGH: Property on VHR or within Heritage Overlay
  if (vhrListings.length > 0 || affectingOverlays.length > 0) {
    return "VERY_HIGH";
  }

  // HIGH: Property near Heritage Overlay (within 50m) or contains heritage inventory item
  const veryNearbyOverlays = nearbyOverlays.filter(
    (o) => o.distanceMeters !== undefined && o.distanceMeters < 50
  );
  if (inventoryItems.length > 0 || veryNearbyOverlays.length > 0) {
    return "HIGH";
  }

  // MODERATE: Property near heritage items (within 100m)
  const moderatelyNearOverlays = nearbyOverlays.filter(
    (o) => o.distanceMeters !== undefined && o.distanceMeters < 100
  );
  if (moderatelyNearOverlays.length > 0) {
    return "MODERATE";
  }

  // LOW: Property in area with heritage context (within 500m)
  if (nearbyOverlays.length > 0) {
    return "LOW";
  }

  // MINIMAL: No identified heritage constraints
  return "MINIMAL";
}

/**
 * Generates list of heritage items affecting or near the property
 */
function generateHeritageListings(
  affectingOverlays: HeritageOverlayData[],
  inventoryItems: InferredHeritageData[]
): string[] {
  const listings: string[] = [];

  // Add affecting overlays
  affectingOverlays.forEach((overlay) => {
    listings.push(`${overlay.overlayCode} - ${overlay.overlayName}`);
  });

  // Add heritage inventory items
  inventoryItems.forEach((item) => {
    listings.push(
      `${item.heritageManagementNumber} - ${item.siteName} (${item.heritageObject})`
    );
  });

  return listings;
}

/**
 * Generates human-readable description
 */
function generateDescription(
  significanceLevel: HeritageSignificanceLevel,
  affectingOverlays: HeritageOverlayData[],
  inventoryItems: InferredHeritageData[],
  vhrListings: InferredHeritageData[]
): string {
  if (significanceLevel === "VERY_HIGH") {
    if (vhrListings.length > 0) {
      return `Very high heritage significance - property contains ${vhrListings.length} Victorian Heritage Register listing(s). The property is subject to significant heritage controls.`;
    }
    if (affectingOverlays.length > 0) {
      const overlayList = affectingOverlays
        .map((o) => o.overlayCode)
        .join(", ");
      return `Very high heritage significance - property is within ${affectingOverlays.length} Heritage Overlay(s): ${overlayList}. Planning permits required for most development.`;
    }
  }

  if (significanceLevel === "HIGH") {
    if (inventoryItems.length > 0) {
      return `High heritage significance - property contains ${inventoryItems.length} heritage inventory item(s). Development may require heritage assessment.`;
    }
    return `High heritage significance - property is in close proximity to Heritage Overlay areas. Development should consider heritage context.`;
  }

  if (significanceLevel === "MODERATE") {
    return `Moderate heritage significance - property is near heritage-protected areas. Consider heritage impacts in development planning.`;
  }

  if (significanceLevel === "LOW") {
    return `Low heritage significance - property is in an area with some heritage context but not directly affected by heritage controls.`;
  }

  return `Minimal heritage significance - no identified heritage constraints in the immediate vicinity.`;
}

/**
 * Generates planning and development recommendations
 */
function generateRecommendations(
  significanceLevel: HeritageSignificanceLevel,
  affectingOverlays: HeritageOverlayData[],
  inventoryItems: InferredHeritageData[],
  vhrListings: InferredHeritageData[]
): string[] {
  const recommendations: string[] = [];

  if (vhrListings.length > 0) {
    recommendations.push(
      "Property is on the Victorian Heritage Register - Heritage Victoria approval required for any works"
    );
    recommendations.push(
      "Consult with Heritage Victoria before undertaking any development, demolition, or alterations"
    );
    recommendations.push(
      "Engage a qualified heritage consultant for any proposed works"
    );
    recommendations.push(
      "Consider heritage grants and incentives for conservation works"
    );
  }

  if (affectingOverlays.length > 0) {
    const hoOverlays = affectingOverlays.filter((o) =>
      o.overlayCode.startsWith("HO")
    );
    if (hoOverlays.length > 0) {
      recommendations.push(
        "Planning permit required for most external alterations, additions, and demolition"
      );
      recommendations.push(
        "Review the Heritage Overlay schedule in the local planning scheme for specific controls"
      );
      recommendations.push(
        "Consult with council's heritage advisor before planning any works"
      );
      recommendations.push(
        "Retain and conserve heritage fabric where possible"
      );
    }

    const esoOverlays = affectingOverlays.filter((o) =>
      o.overlayCode.startsWith("ESO")
    );
    if (esoOverlays.length > 0) {
      recommendations.push(
        "Environmental Significance Overlay applies - consult council regarding vegetation and landscape requirements"
      );
    }
  }

  if (inventoryItems.length > 0 && affectingOverlays.length === 0) {
    recommendations.push(
      "Heritage inventory items present - consider heritage impacts in development design"
    );
    recommendations.push(
      "While not subject to formal Heritage Overlay, heritage assessment recommended for major works"
    );
  }

  if (significanceLevel === "MODERATE" || significanceLevel === "LOW") {
    recommendations.push(
      "Consider heritage context when designing new development"
    );
    recommendations.push(
      "Ensure new works are sympathetic to surrounding heritage character"
    );
  }

  if (significanceLevel === "MINIMAL") {
    recommendations.push(
      "No specific heritage constraints identified"
    );
    recommendations.push(
      "Standard planning provisions apply - check local planning scheme"
    );
  }

  return recommendations;
}

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

    const { heritageAnalysis } = await analyzeHeritageData({
      address,
      planningOverlayBufferMeters: 500,
    });

    console.log("\n📊 Heritage Analysis Results:\n");
    console.log(`Significance Level: ${heritageAnalysis.significanceLevel}`);
    console.log(`Requires Heritage Permit: ${heritageAnalysis.requiresHeritagePermit ? "YES" : "NO"}`);
    console.log(`\nDescription:`);
    console.log(`  ${heritageAnalysis.description}`);

    if (heritageAnalysis.heritageListings.length > 0) {
      console.log(`\nHeritage Listings (${heritageAnalysis.heritageListings.length}):`);
      heritageAnalysis.heritageListings.slice(0, 5).forEach((listing, i) => {
        console.log(`  ${i + 1}. ${listing}`);
      });
      if (heritageAnalysis.heritageListings.length > 5) {
        console.log(`  ... and ${heritageAnalysis.heritageListings.length - 5} more`);
      }
    }

    if (heritageAnalysis.planningOverlays.length > 0) {
      console.log(`\nPlanning Overlays (${heritageAnalysis.planningOverlays.length}):`);
      heritageAnalysis.planningOverlays.slice(0, 5).forEach((overlay, i) => {
        const affectsText = overlay.affectsProperty
          ? "AFFECTS PROPERTY"
          : `${Math.round(overlay.distance || 0)}m away`;
        console.log(`  ${i + 1}. ${overlay.code} - ${affectsText}`);
      });
      if (heritageAnalysis.planningOverlays.length > 5) {
        console.log(`  ... and ${heritageAnalysis.planningOverlays.length - 5} more`);
      }
    }

    console.log(`\nRecommendations:`);
    heritageAnalysis.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });

    console.log();
  }
}
