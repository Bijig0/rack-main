import axios from "axios";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../wfsDataToolkit/types";
import { inferRawEasementData } from "./inferRawEasementData/InferRawEasementData";
import {
  EasementFeaturesSchema,
  InferredEasementData,
  EasementData,
} from "./types";

type Args = {
  address: Address;
};

type Return = {
  easementData: EasementData;
};

const EASEMENTS_WFS_URL = WFS_DATA_URL;

/**
 * Determines the primary easement type from a list of inferred easements
 * Priority: drainage > sewerage > access > utility > unknown
 */
const determinePrimaryType = (
  easements: InferredEasementData[]
): EasementData["type"] => {
  if (easements.length === 0) return undefined;

  // Look for keywords in type and description fields
  for (const easement of easements) {
    const combined = `${easement.type} ${easement.description}`.toLowerCase();

    if (combined.includes("drainage") || combined.includes("drain")) {
      return "drainage";
    }
  }

  for (const easement of easements) {
    const combined = `${easement.type} ${easement.description}`.toLowerCase();

    if (combined.includes("sewerage") || combined.includes("sewer")) {
      return "sewerage";
    }
  }

  for (const easement of easements) {
    const combined = `${easement.type} ${easement.description}`.toLowerCase();

    if (
      combined.includes("access") ||
      combined.includes("right of way") ||
      combined.includes("area-based")
    ) {
      return "access";
    }
  }

  for (const easement of easements) {
    const combined = `${easement.type} ${easement.description}`.toLowerCase();

    if (
      combined.includes("utility") ||
      combined.includes("service") ||
      combined.includes("linear")
    ) {
      return "utility";
    }
  }

  return "unknown";
};

/**
 * Determines impact level based on easement characteristics
 */
const determineImpactLevel = (
  hasEasement: boolean,
  type: EasementData["type"],
  easements: InferredEasementData[]
): EasementData["impactLevel"] => {
  if (!hasEasement) return "none";

  // Check for active easements
  const hasActive = easements.some((e) =>
    e.status.toLowerCase().includes("active")
  );

  // High impact: Active drainage or sewerage easements
  if (hasActive && (type === "drainage" || type === "sewerage")) {
    return "high";
  }

  // Moderate impact: Any active easement or multiple easements
  if (hasActive || easements.length > 2) {
    return "moderate";
  }

  // Low impact: Inactive or minor easements
  return "low";
};

/**
 * Generates location description from easement data
 */
const generateLocationDescription = (
  easements: InferredEasementData[]
): string | undefined => {
  if (easements.length === 0) return undefined;

  // Try to use AI-generated description from first easement
  const firstEasement = easements[0];
  if (
    firstEasement.description &&
    !firstEasement.description.includes("Dataset name")
  ) {
    return firstEasement.description;
  }

  // Fallback: Create simple description
  if (easements.length === 1) {
    const measurement = firstEasement.measurement;
    if (measurement.type === "length") {
      return `Linear easement extending ${measurement.value.toFixed(0)}m`;
    } else {
      return `Area easement covering ${measurement.value.toFixed(0)} square metres`;
    }
  }

  // Multiple easements
  return `Property affected by ${easements.length} easements`;
};

/**
 * Generates alerts based on easement analysis
 */
const generateAlerts = (
  type: EasementData["type"],
  impactLevel: EasementData["impactLevel"],
  easements: InferredEasementData[]
): string[] | undefined => {
  const alerts: string[] = [];

  const hasActive = easements.some((e) =>
    e.status.toLowerCase().includes("active")
  );

  // High impact alerts
  if (impactLevel === "high") {
    if (type === "drainage") {
      alerts.push(
        "Active drainage easement present - building restrictions apply. Consult Melbourne Water before any construction."
      );
    } else if (type === "sewerage") {
      alerts.push(
        "Active sewerage easement present - significant building restrictions. Mandatory setbacks from sewer lines."
      );
    }
  }

  // Moderate impact alerts
  if (impactLevel === "moderate") {
    if (hasActive) {
      alerts.push(
        "Active easement may restrict building placement. Check easement documentation and planning overlays."
      );
    }
    if (easements.length > 2) {
      alerts.push(
        `Multiple easements (${easements.length}) affect property. Comprehensive site survey recommended.`
      );
    }
  }

  // Type-specific alerts
  if (type === "access") {
    alerts.push(
      "Access easement provides legal right of way. May affect privacy and property use."
    );
  }

  // General alert for any easement
  if (hasActive && alerts.length === 0) {
    alerts.push(
      "Easement registered on title. Obtain easement documentation during conveyancing."
    );
  }

  return alerts.length > 0 ? alerts : undefined;
};

/**
 * Gets comprehensive easement data for a property
 *
 * Fetches easement data from Vicmap and returns simplified information
 * suitable for property reports, focusing on type, impact, and actionable alerts.
 *
 * @param address - The property address to analyze
 * @returns Simplified easement data
 *
 * @example
 * ```typescript
 * const result = await getEasementsData({
 *   address: {
 *     addressLine: "123 Main Street",
 *     suburb: "Melbourne",
 *     state: "VIC",
 *     postcode: "3000"
 *   }
 * });
 *
 * console.log(result.easementData.hasEasement); // true/false
 * console.log(result.easementData.impactLevel); // "high"
 * console.log(result.easementData.alerts); // [...]
 * ```
 */
export const getEasementsData = async ({ address }: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address })!;

  const params = createWfsParams({
    lat,
    lon,
    typeName: "open-data-platform:easement",
  });

  const response = await axios.get(EASEMENTS_WFS_URL, {
    params,
  });

  const parsedResponse = VicmapResponseSchema.parse(response.data);
  const geographicFeatures = parsedResponse.features;
  const easementFeatures = EasementFeaturesSchema.parse(geographicFeatures);

  const hasEasement =
    geographicFeatures != null && geographicFeatures.length > 0;

  // No easements found
  if (!hasEasement) {
    return {
      easementData: {
        hasEasement: false,
        type: undefined,
        locationDescription: undefined,
        impactLevel: "none",
        alerts: undefined,
      },
    };
  }

  // Process easements to get detailed data
  const { inferredEasementData } = await inferRawEasementData({
    features: easementFeatures,
  });

  // Aggregate into simplified format
  const type = determinePrimaryType(inferredEasementData);
  const impactLevel = determineImpactLevel(
    hasEasement,
    type,
    inferredEasementData
  );
  const locationDescription = generateLocationDescription(inferredEasementData);
  const alerts = generateAlerts(type, impactLevel, inferredEasementData);

  return {
    easementData: {
      hasEasement,
      type,
      locationDescription,
      impactLevel,
      alerts,
    },
  };
};

if (import.meta.main) {
  console.log("\n=== EASEMENT DATA TEST ===\n");

  const testAddresses = [
    {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC" as const,
      postcode: "3000",
    },
    {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC" as const,
      postcode: "3101",
    },
  ];

  for (const address of testAddresses) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(
      `ADDRESS: ${address.addressLine}, ${address.suburb} ${address.postcode}`
    );
    console.log("=".repeat(80));

    try {
      const { easementData } = await getEasementsData({ address });

      console.log("\nEasement Summary:");
      console.log(`  Has Easement: ${easementData.hasEasement}`);
      console.log(
        `  Type: ${easementData.type ? easementData.type.toUpperCase() : "N/A"}`
      );
      console.log(`  Impact Level: ${easementData.impactLevel.toUpperCase()}`);

      if (easementData.locationDescription) {
        console.log(`\nLocation: ${easementData.locationDescription}`);
      }

      if (easementData.alerts && easementData.alerts.length > 0) {
        console.log("\nAlerts:");
        easementData.alerts.forEach((alert, index) => {
          console.log(`  ${index + 1}. ⚠️  ${alert}`);
        });
      } else {
        console.log("\nAlerts: None");
      }

      console.log("\nFull Data:");
      console.log(JSON.stringify(easementData, null, 2));
    } catch (error) {
      console.error(`Error processing address: ${error}`);
    }
  }

  console.log(`\n${"=".repeat(80)}\n`);
}
