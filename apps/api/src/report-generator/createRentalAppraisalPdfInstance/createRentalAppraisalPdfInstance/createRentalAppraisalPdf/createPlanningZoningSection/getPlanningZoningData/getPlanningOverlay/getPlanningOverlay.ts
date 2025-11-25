import axios from "axios";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../wfsDataToolkit/types";
import {
  PlanningOverlayData,
  PlanningOverlayDataSchema,
  PlanningOverlayFeaturesSchema,
} from "./types";

type Args = {
  address: Address;
};

type Return = {
  planningOverlayData: PlanningOverlayData;
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
export const getPlanningOverlay = async ({
  address,
}: Args): Promise<Return> => {
  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.warn("Could not geocode address for planning overlay lookup");
      return { planningOverlayData: null };
    }

    const { lat, lon } = geocoded;

    const params = createWfsParams({
      lat,
      lon,
      typeName: "open-data-platform:plan_overlay",
    });

    const response = await axios.get(PLANNING_OVERLAY_WFS_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("No planning overlays found for this location");
      return { planningOverlayData: null };
    }

    const overlayFeatures = PlanningOverlayFeaturesSchema.parse(features);

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

    const planningOverlayData = PlanningOverlayDataSchema.parse(overlays);

    console.log(`✅ Found ${planningOverlayData.length} planning overlay(s):`);
    planningOverlayData.forEach((overlay) => {
      console.log(
        `   - ${overlay.overlayCode}${
          overlay.overlayNumber ? ` (${overlay.overlayNumber})` : ""
        }: ${overlay.overlayDescription}`
      );
    });

    return { planningOverlayData };
  } catch (error) {
    console.error("Error fetching planning overlays:", error);
    return { planningOverlayData: null };
  }
};

if (import.meta.main) {
  const { planningOverlayData } = await getPlanningOverlay({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log("\n📋 Planning Overlay Data:");
  console.log(JSON.stringify(planningOverlayData, null, 2));
}
