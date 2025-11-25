#!/Users/a61403/.bun/bin/bun
import * as turf from "@turf/turf";
import axios from "axios";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../wfsDataToolkit/types";
import { calculateDistance } from "../shared/calculateDistance/calculateDistance";
import { checkIfPointInPolygon } from "../shared/checkIfPointInPolygon/checkIfPointInPolygon";
import { determineSignificanceLevel } from "./determineSignificanceLevel/determineSignificanceLevel";
import { generateDescription } from "./generateDescription/generateDescription";
import { generateRecommendations } from "./generateRecommendations/generateRecommendations";
import {
  WaterwayData,
  WaterwayFeature,
  WaterwaySignificanceLevel,
} from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  waterwayData: WaterwayData;
};

/**
 * Gets waterway and wetland data for a property
 *
 * Data sources:
 * 1. Planning overlays: Public Acquisition Overlay (PAO) - often used for waterway reservations
 * 2. Environmental overlays: Environmental Significance Overlay (ESO) - may include waterways
 * 3. Floodway Overlay (FO) - indicates proximity to major waterways
 *
 * Note: Comprehensive waterway data may be available from:
 * - Melbourne Water waterway network
 * - Victorian Water Resources data
 * - DELWP wetland inventory
 */
export const getWaterwayData = async ({
  address,
  bufferMeters = 200,
}: Args): Promise<Return> => {
  console.log("\n💧 Analyzing waterways and wetlands...");

  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for waterway analysis");
      return createMinimalWaterwayData();
    }

    const { lat, lon } = geocoded;
    const bufferDegrees = bufferMeters / 111000;

    // Check for waterway-related planning overlays
    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:plan_overlay",
    });

    console.log(`Querying waterway overlays within ${bufferMeters}m...`);

    const response = await axios.get(WFS_DATA_URL, { params });
    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    const waterwayFeatures: WaterwayFeature[] = [];
    const propertyPoint = turf.point([lon, lat]);
    let inWaterwayBuffer = false;

    if (features && features.length > 0) {
      // Filter for waterway-related overlays (FO, ESO, PAO)
      const waterwayOverlays = features.filter((feature: any) => {
        const code = feature.properties.scheme_code;
        return code && (
          code.startsWith("FO") || // Floodway Overlay
          code.startsWith("PAO") || // Public Acquisition Overlay (waterways)
          (code.startsWith("ESO") &&
           feature.properties.zone_description?.toLowerCase().includes("water"))
        );
      });

      console.log(`✅ Found ${waterwayOverlays.length} waterway-related overlay(s)`);

      for (const feature of waterwayOverlays) {
        const affectsProperty = checkIfPointInPolygon({ feature, point: propertyPoint });
        const distance = affectsProperty ? 0 : calculateDistance({ feature, point: propertyPoint });

        if (affectsProperty) {
          inWaterwayBuffer = true;
        }

        let featureType = "Waterway";
        if (feature.properties.scheme_code?.startsWith("FO")) {
          featureType = "Floodway";
        } else if (feature.properties.scheme_code?.startsWith("PAO")) {
          featureType = "Waterway Reservation";
        } else if (feature.properties.zone_description?.toLowerCase().includes("wetland")) {
          featureType = "Wetland";
        }

        waterwayFeatures.push({
          featureType,
          name: feature.properties.zone_description,
          distanceMeters: distance,
          inBuffer: affectsProperty,
        });
      }
    } else {
      console.log("✅ No waterway overlays found");
    }

    // Sort by distance
    waterwayFeatures.sort((a, b) => a.distanceMeters - b.distanceMeters);

    const significanceLevel = determineSignificanceLevel({ features: waterwayFeatures, inBuffer: inWaterwayBuffer });
    const requiresWaterwayAssessment = inWaterwayBuffer;
    const nearestWaterwayDistance = waterwayFeatures.length > 0
      ? waterwayFeatures[0].distanceMeters
      : undefined;
    const description = generateDescription({ level: significanceLevel, features: waterwayFeatures });
    const recommendations = generateRecommendations({ level: significanceLevel, features: waterwayFeatures });

    console.log(`✅ Waterway analysis complete: ${significanceLevel}`);
    console.log(`   In waterway buffer: ${inWaterwayBuffer ? "YES" : "NO"}`);

    return {
      waterwayData: {
        significanceLevel,
        waterwayFeatures: waterwayFeatures.slice(0, 10), // Top 10
        inWaterwayBuffer,
        nearestWaterwayDistance,
        requiresWaterwayAssessment,
        description,
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error analyzing waterway data:", error);
    return createMinimalWaterwayData();
  }
};

function createMinimalWaterwayData(): Return {
  return {
    waterwayData: {
      significanceLevel: "MINIMAL",
      waterwayFeatures: [],
      inWaterwayBuffer: false,
      requiresWaterwayAssessment: false,
      description: "Minimal waterway significance - no identified waterway constraints.",
      recommendations: [
        "No significant waterway constraints identified",
        "Standard stormwater management practices apply",
      ],
    },
  };
}

if (import.meta.main) {
  const testAddresses: Address[] = [
    {
      addressLine: "Yarra Boulevard",
      suburb: "Kew",
      state: "VIC" as const,
      postcode: "3101",
    },
    {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
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
    console.log(`Testing: ${address.addressLine}, ${address.suburb} ${address.postcode}`);
    console.log("=".repeat(80));

    const { waterwayData } = await getWaterwayData({ address, bufferMeters: 200 });

    console.log(`\nSignificance Level: ${waterwayData.significanceLevel}`);
    console.log(`In Waterway Buffer: ${waterwayData.inWaterwayBuffer ? "YES" : "NO"}`);
    if (waterwayData.nearestWaterwayDistance !== undefined) {
      console.log(`Nearest Waterway: ${Math.round(waterwayData.nearestWaterwayDistance)}m`);
    }
    console.log(`\nDescription: ${waterwayData.description}`);

    if (waterwayData.waterwayFeatures.length > 0) {
      console.log(`\nWaterway Features (${waterwayData.waterwayFeatures.length}):`);
      waterwayData.waterwayFeatures.forEach((feature, i) => {
        console.log(`  ${i + 1}. ${feature.featureType} - ${Math.round(feature.distanceMeters)}m`);
        if (feature.name) {
          console.log(`     ${feature.name}`);
        }
      });
    }

    console.log(`\nRecommendations:`);
    waterwayData.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
}
