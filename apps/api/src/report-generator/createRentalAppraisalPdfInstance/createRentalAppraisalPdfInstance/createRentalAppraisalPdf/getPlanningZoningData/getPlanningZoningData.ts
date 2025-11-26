import { Address } from "../../../../../shared/types";
import { getHeritageOverlays } from "./getHeritageOverlays/getHeritageOverlays";
import { getLandUse } from "./getLandUse/getLandUse";
import { getLocalPlan } from "./getLocalPlan/getLocalPlan";
import { getLocalPlanPrecinct } from "./getLocalPlanPrecinct/getLocalPlanPrecinct";
import { getLocalPlanSubprecinct } from "./getLocalPlanSubprecinct/getLocalPlanSubprecinct";
import { getPlanningOverlay } from "./getPlanningOverlay/getPlanningOverlay";
import { getPlanningScheme } from "./getPlanningScheme/getPlanningScheme";
import { getPlanningZoneData } from "./getPlanningZoneData/getPlanningZoneData";
import { getRegionalPlan } from "./getRegionalPlan/getRegionalPlan";
import { getZoneCode } from "./getZoneCode/getZoneCode";
import { getZoneDescription } from "./getZoneDescription/getZoneDescription";
import { getZonePrecinct } from "./getZonePrecinct/getZonePrecinct";
import { PlanningZoningData } from "./types";

type Args = {
  address: Address;
};

type Return = {
  planningZoningData: PlanningZoningData;
};

/**
 * Fetches planning and zoning data from Victorian WFS services
 *
 * This function orchestrates calls to all the individual getter functions,
 * which share a cache to avoid redundant WFS calls.
 *
 * Data sources:
 * - Vicmap Planning (plan_zone) - Zone codes and descriptions
 * - Vicmap Planning (plan_overlay) - Planning overlays (HO, DDO, VPO, etc.)
 * - Planning schemes are derived from LGA
 * - Regional plans are mapped from suburb/LGA
 *
 * @param address - Property address
 * @returns Planning and zoning data or null if not available
 */
const getPlanningZoningData = async ({ address }: Args): Promise<Return> => {
  console.log(
    `Fetching planning and zoning data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  try {
    // Fetch base planning zone data first (this populates the cache)
    const { planningZoneData: baseData } = await getPlanningZoneData({
      address,
    });

    if (!baseData) {
      console.warn("No planning zone data available for this location");
      return { planningZoningData: null };
    }

    // Fetch all data in parallel - subsequent calls use cached data
    const [
      heritageOverlays,
      landUse,
      zoneCode,
      zoneDescription,
      planningScheme,
      regionalPlan,
      { planningOverlayData },
      localPlanPrecinct,
      localPlanSubprecinct,
    ] = await Promise.all([
      getHeritageOverlays({ address }),
      getLandUse({ address }),
      getZoneCode({ address }),
      getZoneDescription({ address }),
      getPlanningScheme({ address }),
      getRegionalPlan({ address }),
      getPlanningOverlay({ address }),
      getLocalPlanPrecinct({ address }),
      getLocalPlanSubprecinct({ address }),
    ]);

    // Get local plan using Effect
    const { Effect } = await import("effect");
    const localPlan = await Effect.runPromise(getLocalPlan({ address }));

    // Deduplicate overlays based on overlayCode
    let overlays = null;
    if (planningOverlayData && planningOverlayData.length > 0) {
      overlays = Array.from(
        new Map(
          planningOverlayData.map((overlay) => [overlay.overlayCode, overlay])
        ).values()
      );
    }

    // Determine zone precinct from overlay combinations
    const { zonePrecinct } = getZonePrecinct({
      overlays: overlays || [],
      zoneCode: zoneCode || "",
    });

    const planningZoningData: NonNullable<PlanningZoningData> = {
      heritageOverlays,
      landUse,
      localPlan,
      localPlanPrecinct,
      localPlanSubprecinct,
      overlays,
      planningScheme,
      regionalPlan,
      zoneCode,
      zoneDescription,
      zonePrecinct,
    };

    console.log("✅ Planning and zoning data retrieved:", {
      zoneCode: planningZoningData.zoneCode,
      zoneDescription: planningZoningData.zoneDescription,
      planningScheme: planningZoningData.planningScheme,
      landUse: planningZoningData.landUse,
      overlayCount: overlays?.length || 0,
      heritageOverlays:
        planningZoningData.heritageOverlays?.map((h) => h.code).join(", ") ||
        "None",
      zonePrecinct: planningZoningData.zonePrecinct || "None",
      localPlan: planningZoningData.localPlan?.localPlan || "None",
      localPlanPrecinct: planningZoningData.localPlanPrecinct || "None",
      localPlanSubprecinct: planningZoningData.localPlanSubprecinct || "None",
      regionalPlan: planningZoningData.regionalPlan?.regionalPlan || "None",
    });

    return { planningZoningData };
  } catch (error) {
    console.error("Error in getPlanningZoningData:", error);
    return { planningZoningData: null };
  }
};

export default getPlanningZoningData;

if (import.meta.main) {
  const { planningZoningData } = await getPlanningZoningData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log("\n📋 Planning and Zoning Data:");
  console.log(JSON.stringify(planningZoningData, null, 2));
}
