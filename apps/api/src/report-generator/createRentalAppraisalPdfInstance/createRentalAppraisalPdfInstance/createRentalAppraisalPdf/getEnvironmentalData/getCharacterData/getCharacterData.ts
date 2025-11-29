import * as turf from "@turf/turf";
import axios from "axios";
import { Address } from "../../../../../../shared/types";
import { createWfsParams } from "../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../wfsDataToolkit/types";
import { calculateDistance } from "../shared/calculateDistance/calculateDistance";
import { checkIfPointInPolygon } from "../shared/checkIfPointInPolygon/checkIfPointInPolygon";
import { determineSignificanceLevel } from "./determineSignificanceLevel/determineSignificanceLevel";
import { generateDescription } from "./generateDescription/generateDescription";
import { generateRecommendations } from "./generateRecommendations/generateRecommendations";
import {
  CharacterData,
  CharacterOverlay,
} from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  characterData: CharacterData;
};

/**
 * Gets neighbourhood character data for a property
 *
 * Data source: open-data-platform:plan_overlay
 * - Neighbourhood Character Overlay (NCO) - Clause 43.05
 * - Significant Landscape Overlay (SLO) - Clause 42.03
 *
 * These overlays identify areas where neighbourhood character is significant
 * and development must respect the existing or preferred character.
 */
export const getCharacterData = async ({
  address,
  bufferMeters = 200,
}: Args): Promise<Return> => {
  console.log("\n🏘️  Analyzing neighbourhood character...");

  try {
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for character analysis");
      return createMinimalCharacterData();
    }

    const { lat, lon } = geocoded;
    const bufferDegrees = bufferMeters / 111000;

    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:plan_overlay",
    });

    console.log(`Querying character overlays within ${bufferMeters}m...`);

    const response = await axios.get(WFS_DATA_URL, { params });
    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("✅ No character overlays found within buffer");
      return createMinimalCharacterData();
    }

    // Filter for character-related overlays (NCO and SLO)
    const characterFeatures = features.filter((feature: any) => {
      const code = feature.properties.scheme_code;
      return code && (code.startsWith("NCO") || code.startsWith("SLO"));
    });

    console.log(`✅ Found ${characterFeatures.length} character overlay(s)`);

    const propertyPoint = turf.point([lon, lat]);
    const characterOverlays: CharacterOverlay[] = [];

    for (const feature of characterFeatures) {
      const affectsProperty = checkIfPointInPolygon({ feature, point: propertyPoint });
      const distance = affectsProperty ? 0 : calculateDistance({ feature, point: propertyPoint });

      const overlayType = feature.properties.scheme_code?.startsWith("NCO")
        ? "NCO"
        : "SLO";

      characterOverlays.push({
        overlayCode: feature.properties.zone_code || "Unknown",
        overlayType,
        overlayName: feature.properties.zone_description || "Unknown Overlay",
        description: feature.properties.zone_description,
        lga: feature.properties.lga,
        affectsProperty,
        distanceMeters: affectsProperty ? undefined : distance,
      });
    }

    // Sort by affects property, then distance
    characterOverlays.sort((a, b) => {
      if (a.affectsProperty && !b.affectsProperty) return -1;
      if (!a.affectsProperty && b.affectsProperty) return 1;
      if (a.distanceMeters !== undefined && b.distanceMeters !== undefined) {
        return a.distanceMeters - b.distanceMeters;
      }
      return 0;
    });

    const affectedByCharacterOverlay = characterOverlays.some((o) => o.affectsProperty);
    const significanceLevel = determineSignificanceLevel({ overlays: characterOverlays });
    const requiresCharacterAssessment = affectedByCharacterOverlay;
    const description = generateDescription({ level: significanceLevel, overlays: characterOverlays });
    const recommendations = generateRecommendations({ level: significanceLevel, overlays: characterOverlays });

    console.log(`✅ Character analysis complete: ${significanceLevel}`);
    console.log(`   Character overlays affecting property: ${characterOverlays.filter(o => o.affectsProperty).length}`);

    return {
      characterData: {
        significanceLevel,
        characterOverlays: characterOverlays.slice(0, 10), // Top 10
        affectedByCharacterOverlay,
        requiresCharacterAssessment,
        description,
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error analyzing character data:", error);
    return createMinimalCharacterData();
  }
};

function createMinimalCharacterData(): Return {
  return {
    characterData: {
      significanceLevel: "MINIMAL",
      characterOverlays: [],
      affectedByCharacterOverlay: false,
      requiresCharacterAssessment: false,
      description: "Minimal character significance - no identified character constraints in the immediate vicinity.",
      recommendations: [
        "No specific character overlay constraints identified",
        "Standard residential design provisions apply",
      ],
    },
  };
}

if (import.meta.main) {
  const testAddresses: Address[] = [
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

    const { characterData } = await getCharacterData({ address, bufferMeters: 200 });

    console.log(`\nSignificance Level: ${characterData.significanceLevel}`);
    console.log(`Affected by Character Overlay: ${characterData.affectedByCharacterOverlay ? "YES" : "NO"}`);
    console.log(`\nDescription: ${characterData.description}`);

    if (characterData.characterOverlays.length > 0) {
      console.log(`\nCharacter Overlays (${characterData.characterOverlays.length}):`);
      characterData.characterOverlays.forEach((overlay, i) => {
        console.log(`  ${i + 1}. ${overlay.overlayCode} (${overlay.overlayType})`);
        console.log(`     Affects property: ${overlay.affectsProperty ? "YES" : "NO"}`);
        if (overlay.distanceMeters) {
          console.log(`     Distance: ${Math.round(overlay.distanceMeters)}m`);
        }
      });
    }

    console.log(`\nRecommendations:`);
    characterData.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }
}
