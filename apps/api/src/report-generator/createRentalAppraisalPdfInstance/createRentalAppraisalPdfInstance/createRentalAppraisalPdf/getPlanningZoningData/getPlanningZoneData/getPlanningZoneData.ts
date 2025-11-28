import axios from "axios";
import { Effect } from "effect";
import * as O from "effect/Option";
import { Address } from "../../../../../../shared/types";
import { createWfsParams } from "../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../wfsDataToolkit/types";
import { getCachedPlanningZoneData, setCachedPlanningZoneData } from "./cache";
import {
  PlanningSchemeZoneFeaturesSchema,
  PlanningZoneData,
  PlanningZoneDataSchema,
} from "./types";

type Args = {
  address: Address;
};

type Return = {
  planningZoneData: O.Option<PlanningZoneData>;
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
 *
 * Results are cached in-memory so subsequent calls for the same address
 * (e.g., from getZoneCode, getZoneDescription) don't make redundant WFS calls.
 */
export const getPlanningZoneData = ({
  address,
}: Args): Effect.Effect<Return, Error> =>
  Effect.gen(function* () {
    // Check cache first
    const cached = getCachedPlanningZoneData(address);
    if (cached !== undefined) {
      console.log("📦 Using cached planning zone data");
      return { planningZoneData: O.some(cached) };
    }

    // Geocode address
    const { lat, lon } = yield* Effect.tryPromise({
      try: () => geocodeAddress({ address }),
      catch: () => new Error("Could not geocode address"),
    });

    // Build WFS params
    const params = createWfsParams({
      lat,
      lon,
      typeName: "open-data-platform:plan_zone",
    });

    // Fetch from WFS with timeout
    const response = yield* Effect.tryPromise({
      try: () => axios.get(PLANNING_ZONE_WFS_URL, {
        params,
        timeout: 30000, // 30 second timeout
      }),
      catch: (error) => new Error(`WFS request failed: ${error}`),
    });

    // Parse response
    const parsedResponse = yield* Effect.try({
      try: () => VicmapResponseSchema.parse(response.data),
      catch: () => new Error("Failed to parse Vicmap response"),
    });

    const features = parsedResponse.features;
    if (!features || features.length === 0) {
      console.log("No planning zone data found for this location");
      return { planningZoneData: O.none() };
    }

    // Parse zone features
    const zoneFeatures = yield* Effect.try({
      try: () => PlanningSchemeZoneFeaturesSchema.parse(features),
      catch: () => new Error("Failed to parse planning zone features"),
    });

    const props = zoneFeatures[0].properties;

    // Extract zone information
    const zoneCode = props.zone_code || "Unknown";
    const zoneNumber = props.zone_num;
    const zoneDescription = props.zone_description || zoneCode;
    const lgaName = props.lga;
    const lgaCode = props.lga_code;

    const planningZoneData = yield* Effect.try({
      try: () =>
        PlanningZoneDataSchema.parse({
          zoneCode,
          zoneNumber,
          zoneDescription,
          lgaName,
          lgaCode,
        }),
      catch: () => new Error("Failed to parse planning zone data"),
    });

    console.log(
      `✅ Found planning zone: ${zoneCode}${zoneNumber ? ` (${zoneNumber})` : ""} - ${zoneDescription}`
    );
    console.log(`   LGA: ${lgaName || "Unknown"}`);

    // Cache the result
    setCachedPlanningZoneData(address, planningZoneData);

    return { planningZoneData: O.some(planningZoneData) };
  });

if (import.meta.main) {
  const program = getPlanningZoneData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  const result = await Effect.runPromise(program);
  console.log("\n📋 Planning Zone Data:");
  console.log(
    JSON.stringify(
      O.getOrElse(result.planningZoneData, () => null),
      null,
      2
    )
  );
}