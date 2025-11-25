import axios from "axios";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../wfsDataToolkit/types";
import {
  PlanningSchemeZoneFeaturesSchema,
  PlanningZoneData,
  PlanningZoneDataSchema,
} from "./types";

type Args = {
  address: Address;
};

type Return = {
  planningZoneData: PlanningZoneData;
};

const PLANNING_ZONE_WFS_URL = WFS_DATA_URL;

/**
 * Fetches planning scheme zone data from Vicmap Planning WFS
 *
 * Uses the plan_zone layer which contains:
 * - Zone codes (e.g., "GRZ2", "RGZ1", "TRZ2")
 * - Zone descriptions
 * - Zone numbers
 * - LGA information
 */
export const getPlanningSchemeZone = async ({
  address,
}: Args): Promise<Return> => {
  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.warn("Could not geocode address for planning zone lookup");
      return { planningZoneData: null };
    }

    const { lat, lon } = geocoded;

    const params = createWfsParams({
      lat,
      lon,
      typeName: "open-data-platform:plan_zone",
    });

    const response = await axios.get(PLANNING_ZONE_WFS_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("No planning zone data found for this location");
      return { planningZoneData: null };
    }

    const zoneFeatures = PlanningSchemeZoneFeaturesSchema.parse(features);
    const firstFeature = zoneFeatures[0];
    const props = firstFeature.properties;

    // Extract zone information (properties are lowercase from plan_zone layer)
    const zoneCode = props.zone_code || "Unknown";
    const zoneNumber = props.zone_num;
    const zoneDescription = props.zone_description || zoneCode;
    const lgaName = props.lga;
    const lgaCode = props.lga_code;

    const planningZoneData = PlanningZoneDataSchema.parse({
      zoneCode,
      zoneNumber,
      zoneDescription,
      lgaName,
      lgaCode,
    });

    console.log(
      `✅ Found planning zone: ${zoneCode}${
        zoneNumber ? ` (${zoneNumber})` : ""
      } - ${zoneDescription}`
    );
    console.log(`   LGA: ${lgaName || "Unknown"}`);

    return { planningZoneData };
  } catch (error) {
    console.error("Error fetching planning scheme zone:", error);
    return { planningZoneData: null };
  }
};

if (import.meta.main) {
  const { planningZoneData } = await getPlanningSchemeZone({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log("\n📋 Planning Zone Data:");
  console.log(JSON.stringify(planningZoneData, null, 2));
}
