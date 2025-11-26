import { Address } from "../../../../../../shared/types";
import { LandUse } from "./getLandUse/types";
import { getLocalPlan } from "./getLocalPlan/getLocalPlan";
import { LocalPlanData } from "./getLocalPlan/types";
import { getPlanningOverlay } from "./getPlanningOverlay/getPlanningOverlay";
import { PlanningOverlayItem } from "./getPlanningOverlay/types";
import { RegionalPlan } from "./getRegionalPlan/types";
import { getZonePrecinct } from "./getZonePrecinct/getZonePrecinct";

type Args = {
  address: Address;
};

export type PlanningZoningData = {
  regionalPlan?: RegionalPlan;
  landUse?: LandUse;
  localPlan?: LocalPlanData;
  planningScheme?: string;
  zone?: string;
  zoneCode?: string;
  overlays?: PlanningOverlayItem[];
  heritageOverlays?: string[];
  zonePrecinct?: string;
  localPlanPrecinct?: string;
  localPlanSubprecinct?: string;
} | null;

type Return = {
  planningZoningData: PlanningZoningData;
};

/**
 * Fetches planning and zoning data from Victorian WFS services
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
    // Fetch planning zone and overlays in parallel
    const [{ planningZoneData }, { planningOverlayData }] = await Promise.all([
      getPlanningSchemeZone({ address }),
      getPlanningOverlay({ address }),
    ]);

    if (!planningZoneData) {
      console.warn("No planning zone data available for this location");
      return { planningZoningData: null };
    }

    // Construct zone description with schedule if available
    const zoneDescription = planningZoneData.zoneNumber
      ? `${planningZoneData.zoneDescription} - Schedule ${planningZoneData.zoneNumber}`
      : planningZoneData.zoneDescription;

    // Determine planning scheme from LGA
    const lgaName = planningZoneData.lgaName || address.suburb;
    const planningScheme = lgaName ? `${lgaName} Planning Scheme` : undefined;

    // Determine regional plan based on location
    let regionalPlan: string | undefined;

    // Greater Melbourne suburbs
    const greaterMelbourneLGAs = [
      "Melbourne",
      "Yarra",
      "Port Phillip",
      "Stonnington",
      "Boroondara",
      "Manningham",
      "Banyule",
      "Darebin",
      "Moreland",
      "Moonee Valley",
      "Maribyrnong",
      "Hobsons Bay",
      "Bayside",
      "Glen Eira",
      "Kingston",
      "Monash",
      "Whitehorse",
      "Knox",
      "Maroondah",
      "Yarra Ranges",
      "Cardinia",
      "Casey",
      "Greater Dandenong",
      "Frankston",
      "Mornington Peninsula",
      "Nillumbik",
      "Whittlesea",
      "Hume",
      "Brimbank",
      "Melton",
      "Wyndham",
    ];

    if (
      lgaName &&
      greaterMelbourneLGAs.some((lga) =>
        lgaName.toLowerCase().includes(lga.toLowerCase())
      )
    ) {
      regionalPlan = "Plan Melbourne 2017-2050";
    }

    // Determine land use from zone code
    const zoneCode = planningZoneData.zoneCode;
    let landUse: string | undefined;

    if (zoneCode.includes("RZ") || zoneCode.includes("Residential")) {
      landUse = "Residential";
    } else if (zoneCode.includes("BZ") || zoneCode.includes("Business")) {
      landUse = "Commercial/Business";
    } else if (zoneCode.includes("IZ") || zoneCode.includes("Industrial")) {
      landUse = "Industrial";
    } else if (zoneCode.includes("PZ") || zoneCode.includes("Public")) {
      landUse = "Public Use";
    } else if (zoneCode.includes("PPRZ") || zoneCode.includes("Park")) {
      landUse = "Public Park and Recreation";
    } else if (zoneCode.includes("RLZ") || zoneCode.includes("Rural")) {
      landUse = "Rural Living";
    } else if (zoneCode.includes("FZ") || zoneCode.includes("Farming")) {
      landUse = "Farming";
    } else if (zoneCode.includes("TRZ") || zoneCode.includes("Transport")) {
      landUse = "Transport";
    }

    // Process overlays
    let overlays: PlanningOverlayItem[] | undefined;
    let heritageOverlays: string[] | undefined;

    if (planningOverlayData && planningOverlayData.length > 0) {
      // Deduplicate overlays based on overlayCode
      const uniqueOverlays = Array.from(
        new Map(
          planningOverlayData.map((overlay) => [overlay.overlayCode, overlay])
        ).values()
      );

      overlays = uniqueOverlays;

      // Extract heritage overlays separately
      heritageOverlays = uniqueOverlays
        .filter((o) => o.overlayCode.startsWith("HO"))
        .map((o) => o.overlayCode);
    }

    // Determine zone precinct from overlay combinations
    const { zonePrecinct } = getZonePrecinct({
      overlays: overlays || [],
      zoneCode,
    });

    // Determine local planning policy
    const { localPlan } = getLocalPlan({
      address,
      lgaName,
    });

    const planningZoningData: NonNullable<PlanningZoningData> = {
      regionalPlan,
      landUse,
      planningScheme,
      zone: zoneDescription,
      zoneCode,
      overlays,
      heritageOverlays,
      zonePrecinct,
      localPlan,
      localPlanPrecinct: undefined,
      localPlanSubprecinct: undefined,
    };

    console.log("✅ Planning and zoning data retrieved:", {
      zone: planningZoningData.zone,
      planningScheme: planningZoningData.planningScheme,
      landUse: planningZoningData.landUse,
      overlayCount: overlays?.length || 0,
      heritageOverlays: heritageOverlays?.join(", ") || "None",
      zonePrecinct: planningZoningData.zonePrecinct || "None",
      localPlan: planningZoningData.localPlan || "None",
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
