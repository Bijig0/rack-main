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
import { determineRiskLevel } from "./determineRiskLevel/determineRiskLevel";
import { generateDescription } from "./generateDescription/generateDescription";
import { generateRecommendations } from "./generateRecommendations/generateRecommendations";
import {
  LandslideHazardZone,
  SteepLandData,
} from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  steepLandData: SteepLandData;
};

/**
 * Gets steep land and landslide risk data for a property
 *
 * Data sources:
 * 1. Planning overlays:
 *    - Landslip Overlay (LSO) - Identifies areas prone to landslip
 *    - Erosion Management Overlay (EMO) - Areas subject to erosion
 *    - Environmental Significance Overlay (ESO) - May include steep slopes
 *
 * These overlays identify areas where steep slopes create development constraints
 * and potential landslide hazards. Development typically requires geotechnical reports.
 */
export const getSteepLandData = async ({
  address,
  bufferMeters = 100,
}: Args): Promise<Return> => {
  console.log("\n⛰️  Analyzing steep land and landslide risk...");

  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for steep land analysis");
      return createMinimalSteepLandData();
    }

    const { lat, lon } = geocoded;
    const bufferDegrees = bufferMeters / 111000;

    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:plan_overlay",
    });

    console.log(`Querying landslide risk overlays within ${bufferMeters}m...`);

    const response = await axios.get(WFS_DATA_URL, { params });
    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    const landslideHazardZones: LandslideHazardZone[] = [];
    const propertyPoint = turf.point([lon, lat]);

    if (features && features.length > 0) {
      // Filter for landslide/erosion overlays (LSO, EMO, relevant ESO)
      const hazardFeatures = features.filter((feature: any) => {
        const code = feature.properties.scheme_code;
        const desc = feature.properties.zone_description?.toLowerCase() || "";
        return code && (
          code.startsWith("LSO") || // Landslip Overlay
          code.startsWith("EMO") || // Erosion Management Overlay
          (code.startsWith("ESO") && (
            desc.includes("landslip") ||
            desc.includes("erosion") ||
            desc.includes("steep")
          ))
        );
      });

      console.log(`✅ Found ${hazardFeatures.length} landslide risk overlay(s)`);

      for (const feature of hazardFeatures) {
        const affectsProperty = checkIfPointInPolygon({ feature, point: propertyPoint });
        const distance = affectsProperty ? 0 : calculateDistance({ feature, point: propertyPoint });

        let hazardType = "Landslip Risk";
        if (feature.properties.scheme_code?.startsWith("LSO")) {
          hazardType = "Landslip";
        } else if (feature.properties.scheme_code?.startsWith("EMO")) {
          hazardType = "Erosion Management";
        } else if (feature.properties.zone_description?.toLowerCase().includes("steep")) {
          hazardType = "Steep Slopes";
        }

        landslideHazardZones.push({
          hazardType,
          overlayCode: feature.properties.zone_code,
          description: feature.properties.zone_description,
          affectsProperty,
          distanceMeters: affectsProperty ? undefined : distance,
        });
      }
    } else {
      console.log("✅ No landslide risk overlays found");
    }

    // Sort by affects property, then distance
    landslideHazardZones.sort((a, b) => {
      if (a.affectsProperty && !b.affectsProperty) return -1;
      if (!a.affectsProperty && b.affectsProperty) return 1;
      if (a.distanceMeters !== undefined && b.distanceMeters !== undefined) {
        return a.distanceMeters - b.distanceMeters;
      }
      return 0;
    });

    const affectedByLandslideRisk = landslideHazardZones.some((z) => z.affectsProperty);
    const riskLevel = determineRiskLevel({ zones: landslideHazardZones });
    const requiresGeotechnicalAssessment = affectedByLandslideRisk;
    const description = generateDescription({ level: riskLevel, zones: landslideHazardZones });
    const recommendations = generateRecommendations({ level: riskLevel, zones: landslideHazardZones });

    console.log(`✅ Steep land analysis complete: ${riskLevel}`);
    console.log(`   Affected by landslide risk: ${affectedByLandslideRisk ? "YES" : "NO"}`);

    return {
      steepLandData: {
        riskLevel,
        landslideHazardZones,
        affectedByLandslideRisk,
        requiresGeotechnicalAssessment,
        description,
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error analyzing steep land data:", error);
    return createMinimalSteepLandData();
  }
};

function createMinimalSteepLandData(): Return {
  return {
    steepLandData: {
      riskLevel: "MINIMAL",
      landslideHazardZones: [],
      affectedByLandslideRisk: false,
      requiresGeotechnicalAssessment: false,
      description: "Minimal landslide risk - no identified landslide or steep land constraints.",
      recommendations: [
        "No significant landslide or steep land constraints identified",
        "Standard foundation and drainage practices apply",
      ],
    },
  };
}

if (import.meta.main) {
  const testAddresses: Address[] = [
    {
      addressLine: "Mount Dandenong Tourist Road",
      suburb: "Mount Dandenong",
      state: "VIC" as const,
      postcode: "3767",
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

    const { steepLandData } = await getSteepLandData({ address, bufferMeters: 100 });

    console.log(`\nRisk Level: ${steepLandData.riskLevel}`);
    console.log(`Affected by Landslide Risk: ${steepLandData.affectedByLandslideRisk ? "YES" : "NO"}`);
    console.log(`Requires Geotechnical Assessment: ${steepLandData.requiresGeotechnicalAssessment ? "YES" : "NO"}`);
    console.log(`\nDescription: ${steepLandData.description}`);

    if (steepLandData.landslideHazardZones.length > 0) {
      console.log(`\nLandslide Hazard Zones (${steepLandData.landslideHazardZones.length}):`);
      steepLandData.landslideHazardZones.forEach((zone, i) => {
        console.log(`  ${i + 1}. ${zone.hazardType}`);
        console.log(`     Affects property: ${zone.affectsProperty ? "YES" : "NO"}`);
        if (zone.distanceMeters) {
          console.log(`     Distance: ${Math.round(zone.distanceMeters)}m`);
        }
        if (zone.overlayCode) {
          console.log(`     Overlay: ${zone.overlayCode}`);
        }
      });
    }

    console.log(`\nRecommendations:`);
    steepLandData.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
}
