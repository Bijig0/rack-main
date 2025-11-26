#!/Users/a61403/.bun/bin/bun
import * as turf from "@turf/turf";
import axios from "axios";
import { Address } from "../../../../../../../../shared/types";
import { createWfsParams } from "../../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../../wfsDataToolkit/types";
import {
  HeritageOverlayData,
  PlanningOverlayFeature,
  PlanningOverlayFeaturesSchema,
} from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  heritageOverlays: HeritageOverlayData[];
};

/**
 * Fetches Planning Scheme Overlay data from Victorian Government WFS
 * Focuses on Heritage Overlays (HO) and other heritage-related overlays
 *
 * Data source: open-data-platform:plan_overlay
 * - Heritage Overlay (HO): Identifies places of heritage significance
 * - Vegetation Protection Overlay (VPO): May include heritage trees
 * - Environmental Significance Overlay (ESO): May include heritage landscapes
 */
export const getPlanningOverlayData = async ({
  address,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  console.log("Fetching planning overlay data...");

  try {
    // Get geocoded coordinates
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for planning overlay analysis");
      return { heritageOverlays: [] };
    }

    const { lat, lon } = geocoded;

    // Calculate buffer in degrees (approximate)
    const bufferDegrees = bufferMeters / 111000;

    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:plan_overlay",
    });

    console.log(
      `Querying planning overlays within ${bufferMeters}m of address...`
    );

    const response = await axios.get(WFS_DATA_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("✅ No planning overlays found within buffer");
      return { heritageOverlays: [] };
    }

    const planningOverlayFeatures =
      PlanningOverlayFeaturesSchema.parse(features);

    // Filter for heritage-related overlays
    const heritageRelatedCodes = ["HO", "VPO", "ESO"];
    const heritageFeatures = planningOverlayFeatures.filter((feature) => {
      const code = feature.properties.scheme_code;
      return (
        code && heritageRelatedCodes.some((hCode) => code.startsWith(hCode))
      );
    });

    console.log(
      `✅ Found ${heritageFeatures.length} heritage-related overlay(s) within ${bufferMeters}m`
    );

    // Analyze each heritage overlay
    const propertyPoint = turf.point([lon, lat]);
    const heritageOverlays: HeritageOverlayData[] = [];

    for (const feature of heritageFeatures) {
      const affectsProperty = checkIfPointInPolygon(feature, propertyPoint);
      const distance = affectsProperty
        ? 0
        : calculateDistanceToOverlay(feature, propertyPoint);

      heritageOverlays.push({
        overlayCode: feature.properties.zone_code || "Unknown",
        overlayName: feature.properties.zone_description || "Unknown Overlay",
        description: feature.properties.zone_description || undefined,
        lga: feature.properties.lga || undefined,
        schedule: undefined, // Not available in this dataset
        gazettalDate: feature.properties.gaz_begin_date || undefined,
        affectsProperty,
        distanceMeters: affectsProperty ? undefined : distance,
      });
    }

    // Sort by affectsProperty (true first), then by distance
    heritageOverlays.sort((a, b) => {
      if (a.affectsProperty && !b.affectsProperty) return -1;
      if (!a.affectsProperty && b.affectsProperty) return 1;
      if (a.distanceMeters !== undefined && b.distanceMeters !== undefined) {
        return a.distanceMeters - b.distanceMeters;
      }
      return 0;
    });

    return { heritageOverlays };
  } catch (error) {
    console.error("Error fetching planning overlay data:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server error response:", error.response.data);
    }
    return { heritageOverlays: [] };
  }
};

/**
 * Checks if a point is within the overlay polygon
 */
function checkIfPointInPolygon(
  feature: PlanningOverlayFeature,
  point: turf.helpers.Feature<turf.helpers.Point>
): boolean {
  try {
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
      const polygon = turf.polygon(geometry.coordinates);
      return turf.booleanPointInPolygon(point, polygon);
    } else if (geometry.type === "MultiPolygon") {
      for (const polygonCoords of geometry.coordinates) {
        const polygon = turf.polygon(polygonCoords);
        if (turf.booleanPointInPolygon(point, polygon)) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.warn("Error checking if point in polygon:", error);
    return false;
  }
}

/**
 * Calculates distance from point to overlay boundary
 * Uses simplified geometry for large polygons
 */
function calculateDistanceToOverlay(
  feature: PlanningOverlayFeature,
  point: turf.helpers.Feature<turf.helpers.Point>
): number {
  try {
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
      return calculateDistanceToPolygon(geometry.coordinates, point);
    } else if (geometry.type === "MultiPolygon") {
      let minDistance = Infinity;
      for (const polygonCoords of geometry.coordinates) {
        const distance = calculateDistanceToPolygon(polygonCoords, point);
        minDistance = Math.min(minDistance, distance);
      }
      return minDistance;
    }

    // Fallback: use centroid
    const centroid = turf.centroid(geometry as any);
    return turf.distance(point, centroid, { units: "meters" });
  } catch (error) {
    console.warn("Error calculating distance to overlay:", error);
    return Infinity;
  }
}

/**
 * Helper to calculate distance to a single polygon
 */
function calculateDistanceToPolygon(
  coordinates: any[][],
  point: turf.helpers.Feature<turf.helpers.Point>
): number {
  try {
    // Use only outer ring (first ring)
    const outerRing = coordinates[0];

    // Filter out any invalid coordinates
    const validCoords = outerRing.filter((coord: any) =>
      Array.isArray(coord) &&
      coord.length >= 2 &&
      typeof coord[0] === "number" &&
      typeof coord[1] === "number" &&
      !isNaN(coord[0]) &&
      !isNaN(coord[1]) &&
      isFinite(coord[0]) &&
      isFinite(coord[1])
    );

    if (validCoords.length < 4) {
      // Not enough valid coordinates for a polygon
      return Infinity;
    }

    // Simplify if very large (to avoid Turf.js issues with >5000 points)
    let ring = validCoords;
    if (validCoords.length > 5000) {
      const simplified = turf.simplify(turf.lineString(validCoords), {
        tolerance: 0.0001,
        highQuality: false,
      });
      ring = simplified.geometry.coordinates;
    }

    const line = turf.lineString(ring);
    const nearest = turf.nearestPointOnLine(line, point);
    return turf.distance(point, nearest, { units: "meters" });
  } catch (error) {
    // Return Infinity if distance calculation fails
    return Infinity;
  }
}

// Allow running this file directly for testing
if (import.meta.main) {
  // Test with a heritage-listed address
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

    const { heritageOverlays } = await getPlanningOverlayData({
      address,
      bufferMeters: 500,
    });

    if (heritageOverlays.length > 0) {
      console.log(
        `\n✅ Found ${heritageOverlays.length} heritage overlay(s):\n`
      );
      heritageOverlays.forEach((overlay, index) => {
        console.log(
          `${index + 1}. ${overlay.overlayCode} - ${overlay.overlayName}`
        );
        console.log(
          `   Affects property: ${overlay.affectsProperty ? "YES" : "NO"}`
        );
        if (overlay.distanceMeters !== undefined) {
          console.log(`   Distance: ${Math.round(overlay.distanceMeters)}m`);
        }
        if (overlay.description) {
          console.log(`   Description: ${overlay.description}`);
        }
        if (overlay.lga) {
          console.log(`   LGA: ${overlay.lga}`);
        }
        console.log();
      });
    } else {
      console.log("\n❌ No heritage overlays found within 500m");
    }
  }
}
