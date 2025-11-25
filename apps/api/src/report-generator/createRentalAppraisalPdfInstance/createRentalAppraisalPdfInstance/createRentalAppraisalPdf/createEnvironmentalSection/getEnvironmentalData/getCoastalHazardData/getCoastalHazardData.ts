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
import { checkIfCoastalArea } from "./checkIfCoastalArea/checkIfCoastalArea";
import { determineRiskLevel } from "./determineRiskLevel/determineRiskLevel";
import { generateDescription } from "./generateDescription/generateDescription";
import { generateRecommendations } from "./generateRecommendations/generateRecommendations";
import {
  CoastalHazardData,
  CoastalHazardZone,
} from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  coastalHazardData: CoastalHazardData;
};

/**
 * Gets coastal hazard data for a property
 *
 * Data sources:
 * 1. Planning overlays: Special Building Overlay (SBO), Land Subject to Inundation Overlay (LSIO)
 * 2. Checks proximity to coast using simple coordinate-based heuristics
 *
 * Note: Coastal erosion and inundation data may be available from local councils
 * or Marine and Coastal Act datasets. This implementation uses planning overlays
 * as a proxy for coastal hazard zones.
 */
export const getCoastalHazardData = async ({
  address,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  console.log("\n🌊 Analyzing coastal hazards...");

  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for coastal hazard analysis");
      return createMinimalCoastalData();
    }

    const { lat, lon } = geocoded;

    // Check if property is near coast (simple heuristic: Victoria's coast)
    // Victoria latitude range: roughly -34° to -39°
    // Coastal areas typically within 10km (0.1 degree) of water
    const isCoastalArea = checkIfCoastalArea({ lat, lon });

    if (!isCoastalArea) {
      console.log("✅ Property not in coastal area");
      return createMinimalCoastalData();
    }

    const bufferDegrees = bufferMeters / 111000;

    // Check for coastal hazard overlays (LSIO, SBO)
    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:plan_overlay",
    });

    console.log(`Querying coastal hazard overlays within ${bufferMeters}m...`);

    const response = await axios.get(WFS_DATA_URL, { params });
    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    const coastalHazardZones: CoastalHazardZone[] = [];
    const propertyPoint = turf.point([lon, lat]);

    if (features && features.length > 0) {
      // Filter for coastal hazard overlays
      const hazardFeatures = features.filter((feature: any) => {
        const code = feature.properties.scheme_code;
        return code && (code.startsWith("LSIO") || code.startsWith("SBO"));
      });

      console.log(`✅ Found ${hazardFeatures.length} coastal hazard overlay(s)`);

      for (const feature of hazardFeatures) {
        const affectsProperty = checkIfPointInPolygon({ feature, point: propertyPoint });
        const distance = affectsProperty ? 0 : calculateDistance({ feature, point: propertyPoint });

        const hazardType = feature.properties.scheme_code?.startsWith("LSIO")
          ? "Land Subject to Inundation"
          : "Special Building Overlay";

        coastalHazardZones.push({
          hazardType,
          description: feature.properties.zone_description,
          affectsProperty,
          distanceMeters: affectsProperty ? undefined : distance,
        });
      }
    } else {
      console.log("✅ No coastal hazard overlays found");
    }

    // Sort by affects property, then distance
    coastalHazardZones.sort((a, b) => {
      if (a.affectsProperty && !b.affectsProperty) return -1;
      if (!a.affectsProperty && b.affectsProperty) return 1;
      if (a.distanceMeters !== undefined && b.distanceMeters !== undefined) {
        return a.distanceMeters - b.distanceMeters;
      }
      return 0;
    });

    const affectedByCoastalHazard = coastalHazardZones.some((z) => z.affectsProperty);
    const riskLevel = determineRiskLevel({ zones: coastalHazardZones, isCoastal: isCoastalArea });
    const description = generateDescription({ level: riskLevel, zones: coastalHazardZones });
    const recommendations = generateRecommendations({ level: riskLevel, zones: coastalHazardZones });

    console.log(`✅ Coastal hazard analysis complete: ${riskLevel}`);

    return {
      coastalHazardData: {
        riskLevel,
        coastalHazardZones,
        affectedByCoastalHazard,
        distanceToCoast: isCoastalArea ? undefined : undefined, // Would need detailed coastline data
        isCoastalProperty: isCoastalArea,
        description,
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error analyzing coastal hazard data:", error);
    return createMinimalCoastalData();
  }
};

function createMinimalCoastalData(): Return {
  return {
    coastalHazardData: {
      riskLevel: "MINIMAL",
      coastalHazardZones: [],
      affectedByCoastalHazard: false,
      isCoastalProperty: false,
      description: "Minimal coastal hazard risk - property not in coastal area.",
      recommendations: [
        "No coastal hazard constraints identified",
        "Property not in coastal area",
      ],
    },
  };
}

if (import.meta.main) {
  const testAddresses: Address[] = [
    {
      addressLine: "1 Beach Road",
      suburb: "St Kilda",
      state: "VIC" as const,
      postcode: "3182",
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

    const { coastalHazardData } = await getCoastalHazardData({ address, bufferMeters: 500 });

    console.log(`\nRisk Level: ${coastalHazardData.riskLevel}`);
    console.log(`Is Coastal Property: ${coastalHazardData.isCoastalProperty ? "YES" : "NO"}`);
    console.log(`Affected by Coastal Hazard: ${coastalHazardData.affectedByCoastalHazard ? "YES" : "NO"}`);
    console.log(`\nDescription: ${coastalHazardData.description}`);

    if (coastalHazardData.coastalHazardZones.length > 0) {
      console.log(`\nCoastal Hazard Zones (${coastalHazardData.coastalHazardZones.length}):`);
      coastalHazardData.coastalHazardZones.forEach((zone, i) => {
        console.log(`  ${i + 1}. ${zone.hazardType}`);
        console.log(`     Affects property: ${zone.affectsProperty ? "YES" : "NO"}`);
        if (zone.distanceMeters) {
          console.log(`     Distance: ${Math.round(zone.distanceMeters)}m`);
        }
      });
    }

    console.log(`\nRecommendations:`);
    coastalHazardData.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
}
