import axios from "axios";
import { Effect } from "effect";
import * as O from "effect/Option";
import { Address } from "../../../../../../shared/types";
import { createWfsParams } from "../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../wfsDataToolkit/types";
import {
  PlanningOverlayData,
  PlanningOverlayDataSchema,
  PlanningOverlayFeaturesSchema,
} from "./types";

type Args = {
  address: Address;
};

type Return = {
  planningOverlayData: O.Option<PlanningOverlayData>;
};

const PLANNING_OVERLAY_WFS_URL = WFS_DATA_URL;

/**
 * Fetches planning overlay data from Vicmap Planning WFS
 *
 * Uses the plan_overlay layer which contains overlays such as:
 * - Heritage Overlay (HO)
 * - Design and Development Overlay (DDO)
 * - Vegetation Protection Overlay (VPO)
 * - Significant Landscape Overlay (SLO)
 * - Environmental Significance Overlay (ESO)
 * - Parking Overlay (PO)
 * - Development Contributions Plan Overlay (DCPO)
 * - etc.
 */
export const getPlanningOverlay = ({
  address,
}: Args): Effect.Effect<Return, Error> =>
  Effect.gen(function* () {
    // Geocode address
    const geocoded = yield* Effect.tryPromise({
      try: () => geocodeAddress({ address }),
      catch: () => new Error("Could not geocode address"),
    });

    if (!geocoded) {
      console.warn("Could not geocode address for planning overlay lookup");
      return { planningOverlayData: O.none() };
    }

    const { lat, lon } = geocoded;

    // Build WFS params
    const params = createWfsParams({
      lat,
      lon,
      typeName: "open-data-platform:plan_overlay",
    });

    // Fetch from WFS
    const response = yield* Effect.tryPromise({
      try: () => axios.get(PLANNING_OVERLAY_WFS_URL, { params }),
      catch: (error) => new Error(`WFS request failed: ${error}`),
    });

    // Parse response
    const parsedResponse = yield* Effect.try({
      try: () => VicmapResponseSchema.parse(response.data),
      catch: () => new Error("Failed to parse Vicmap response"),
    });

    const features = parsedResponse.features;
    if (!features || features.length === 0) {
      console.log("No planning overlays found for this location");
      return { planningOverlayData: O.none() };
    }

    // Parse overlay features
    const overlayFeatures = yield* Effect.try({
      try: () => PlanningOverlayFeaturesSchema.parse(features),
      catch: () => new Error("Failed to parse planning overlay features"),
    });

    // Extract all overlays (there can be multiple overlays on a property)
    const overlays = overlayFeatures.map((feature) => {
      const props = feature.properties;
      return {
        overlayCode: props.zone_code || "Unknown",
        overlayNumber: props.zone_num,
        overlayDescription:
          props.zone_description || props.zone_code || "Unknown",
      };
    });

    const planningOverlayData = yield* Effect.try({
      try: () => PlanningOverlayDataSchema.parse(overlays),
      catch: () => new Error("Failed to parse planning overlay data"),
    });

    console.log(`✅ Found ${planningOverlayData.length} planning overlay(s):`);
    planningOverlayData.forEach((overlay) => {
      console.log(
        `   - ${overlay.overlayCode}${overlay.overlayNumber ? ` (${overlay.overlayNumber})` : ""}: ${overlay.overlayDescription}`
      );
    });

    return { planningOverlayData: O.some(planningOverlayData) };
  });

if (import.meta.main) {
  const program = getPlanningOverlay({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  const result = await Effect.runPromise(program);
  console.log("\n📋 Planning Overlay Data:");
  console.log(
    JSON.stringify(
      O.getOrElse(result.planningOverlayData, () => null),
      null,
      2
    )
  );
}
