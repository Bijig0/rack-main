import { Effect } from "effect";
import * as O from "effect/Option";
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
 */

const getPlanningZoningData = ({
  address,
}: Args): Effect.Effect<Return, Error> =>
  Effect.gen(function* () {
    // Check base data exists
    const { planningZoneData } = yield* getPlanningZoneData({ address });

    if (O.isNone(planningZoneData)) {
      console.warn("No planning zone data available");
      return { planningZoningData: null };
    }

    // Fetch all data in parallel
    const [
      heritageResult,
      landUseResult,
      zoneCodeResult,
      zoneDescriptionResult,
      planningSchemeResult,
      regionalPlanResult,
      overlayResult,
      localPlanPrecinctResult,
      localPlanSubprecinctResult,
      localPlanResult,
    ] = yield* Effect.all(
      [
        getHeritageOverlays({ address }),
        getLandUse({ address }),
        getZoneCode({ address }),
        getZoneDescription({ address }),
        getPlanningScheme({ address }),
        getRegionalPlan({ address }),
        getPlanningOverlay({ address }),
        getLocalPlanPrecinct({ address }),
        getLocalPlanSubprecinct({ address }),
        getLocalPlan({ address }),
      ],
      { concurrency: "unbounded" }
    );

    // Extract values - heritageOverlays expects an array
    const heritageOverlays = O.getOrElse(
      heritageResult.heritageOverlays,
      () => [] as { code: string; name: string }[]
    );

    // landUse is Option<string | null | undefined>
    const landUse = O.getOrNull(landUseResult.landUse);

    // zoneCode returns { zoneCode: ZoneCode } directly (no Option wrapper)
    const zoneCode = zoneCodeResult.zoneCode;

    // zoneDescription returns ZoneDescription directly (no wrapper)
    const zoneDescription = zoneDescriptionResult;

    // planningScheme returns Option<PlanningScheme> directly
    const planningScheme = O.getOrNull(planningSchemeResult);

    // regionalPlan returns Option<{ regionalPlan: string | null | undefined }> directly
    const regionalPlan = O.getOrNull(regionalPlanResult);

    // overlays
    const planningOverlayData = O.getOrNull(overlayResult.planningOverlayData);

    // localPlanPrecinct returns { localPlanPrecinct: Option<string> }
    const localPlanPrecinct = O.getOrNull(
      localPlanPrecinctResult.localPlanPrecinct
    );

    // localPlanSubprecinct returns { localPlanSubprecinct: Option<string> }
    const localPlanSubprecinct = O.getOrNull(
      localPlanSubprecinctResult.localPlanSubprecinct
    );

    // localPlan returns { localPlanData: Option<LocalPlanData> }
    const localPlan = O.getOrNull(localPlanResult.localPlanData);

    // Deduplicate overlays based on overlayCode
    let overlays: typeof planningOverlayData = null;
    if (planningOverlayData && planningOverlayData.length > 0) {
      overlays = Array.from(
        new Map(
          planningOverlayData.map((overlay) => [overlay.overlayCode, overlay])
        ).values()
      );
    }

    // Determine zone precinct from overlay combinations
    const { zonePrecinct } = yield* getZonePrecinct({
      overlays: overlays || [],
      zoneCode: zoneCode || "",
    });

    const planningZoningData: PlanningZoningData = {
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

    return { planningZoningData };
  });

export default getPlanningZoningData;

if (import.meta.main) {
  const program = getPlanningZoningData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  const { planningZoningData } = await Effect.runPromise(program);
  console.log("\n📋 Planning and Zoning Data:");
  console.log(JSON.stringify(planningZoningData, null, 2));
}
