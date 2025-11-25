import fs from "fs";
import path from "path";
import { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { getElectricityTransmissionLines } from "./getElectricityTransmissionLines/getElectricityTransmissionLines";
import { getNearbyEnergyFacilitiesData } from "./getNearbyEnergyFacilitiesData/getNearbyEnergyFacilitiesData";
import { analyzeElectricityData } from "./analyzeElectricityData/analyzeElectricityData";
import {
  ElectricityInfrastructure,
  ElectricityAlert,
  ElectricityImpactLevel,
} from "./analyzeElectricityData/types";

type Args = {
  address: Address;
};

type Return = {
  electricityInfrastructure: ElectricityInfrastructure;
};

/**
 * Determines impact level based on transmission line risk and EMF exposure
 */
const determineImpactLevel = (
  transmissionLineRisk: string,
  emfExposure: string
): ElectricityImpactLevel => {
  // High impact if very high risk or high EMF
  if (transmissionLineRisk === "VERY_HIGH" || emfExposure === "HIGH") {
    return "high";
  }

  // Moderate impact if high risk or moderate EMF
  if (transmissionLineRisk === "HIGH" || emfExposure === "MODERATE") {
    return "moderate";
  }

  // Low impact if moderate risk or low EMF
  if (transmissionLineRisk === "MODERATE" || emfExposure === "LOW") {
    return "low";
  }

  // Otherwise no significant impact
  return "none";
};

/**
 * Generates alerts from analysis results
 */
const generateAlerts = (
  transmissionLineRisk: string,
  emfExposure: string,
  nearestTransmissionLine: { distance: number; capacityKv?: number } | undefined,
  nearestSubstation: { distance: number; voltage?: string } | undefined,
  accessLevel: string
): ElectricityAlert[] => {
  const alerts: ElectricityAlert[] = [];

  // Transmission line risk alerts
  if (transmissionLineRisk === "VERY_HIGH") {
    alerts.push({
      type: "risk",
      message: `High voltage transmission line within ${nearestTransmissionLine?.distance}m. Mandatory easement restrictions and building setbacks apply. Professional EMF assessment required.`,
    });
  } else if (transmissionLineRisk === "HIGH") {
    alerts.push({
      type: "risk",
      message: `Transmission line within ${nearestTransmissionLine?.distance}m. Check easement restrictions and building height limits with electricity authority.`,
    });
  } else if (transmissionLineRisk === "MODERATE") {
    alerts.push({
      type: "note",
      message: `Transmission infrastructure within ${nearestTransmissionLine?.distance}m. Consider visual impact and check planning overlays.`,
    });
  }

  // EMF exposure alerts
  if (emfExposure === "HIGH") {
    alerts.push({
      type: "risk",
      message: "High EMF exposure - property unsuitable for sensitive uses (childcare, schools) without mitigation. Disclosure requirements apply.",
    });
  } else if (emfExposure === "MODERATE") {
    alerts.push({
      type: "note",
      message: "Moderate EMF levels present. Assessment recommended for sensitive uses.",
    });
  }

  // Access level alerts
  if (accessLevel === "LIMITED") {
    alerts.push({
      type: "note",
      message: "Limited electricity infrastructure. Consult distributor for connection requirements and costs.",
    });
  } else if (accessLevel === "EXCELLENT" || accessLevel === "GOOD") {
    if (nearestSubstation && nearestSubstation.distance < 500) {
      alerts.push({
        type: "note",
        message: `Excellent electricity access - substation within ${Math.round(nearestSubstation.distance)}m. Suitable for high-demand uses.`,
      });
    }
  }

  return alerts;
};

/**
 * Gets comprehensive electricity infrastructure data for a property
 *
 * This function analyzes electricity infrastructure and returns simplified data
 * suitable for property reports, focusing on connection status, potential impacts,
 * and relevant alerts for landlords/tenants.
 *
 * @param address - The property address to analyze
 * @returns Simplified electricity infrastructure data
 *
 * @example
 * ```typescript
 * const result = await getElectricityData({
 *   address: {
 *     addressLine: "123 Main Street",
 *     suburb: "Melbourne",
 *     state: "VIC",
 *     postcode: "3000"
 *   }
 * });
 *
 * console.log(result.electricityInfrastructure.isConnectedToGrid); // true
 * console.log(result.electricityInfrastructure.impactLevel); // "low"
 * console.log(result.electricityInfrastructure.alerts); // [...]
 * ```
 */
export const getElectricityData = async ({
  address,
}: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address });

  // Fetch both datasets in parallel
  const [nearbyEnergyFacilities, electricityTransmissionLines] =
    await Promise.all([
      getNearbyEnergyFacilitiesData({ lat, lon }),
      getElectricityTransmissionLines({ lat, lon }),
    ]);

  // Analyze the electricity data
  const analysis = analyzeElectricityData({
    nearbyEnergyFacilities,
    electricityTransmissionLines,
    propertyLat: lat,
    propertyLon: lon,
  });

  // Assume connected to grid (in Victoria, almost all properties are connected)
  // Could be refined based on access level if needed
  const isConnectedToGrid = analysis.accessLevel !== "LIMITED";

  // Extract distances
  const distanceToNearestTransmissionLine =
    analysis.nearestTransmissionLine?.distance ?? null;
  const distanceToNearestFacility =
    analysis.nearestSubstation?.distance ?? null;

  // Determine impact level
  const impactLevel = determineImpactLevel(
    analysis.transmissionLineRisk,
    analysis.emfExposure
  );

  // Generate alerts
  const alerts = generateAlerts(
    analysis.transmissionLineRisk,
    analysis.emfExposure,
    analysis.nearestTransmissionLine,
    analysis.nearestSubstation,
    analysis.accessLevel
  );

  const electricityInfrastructure: ElectricityInfrastructure = {
    isConnectedToGrid,
    distanceToNearestTransmissionLine,
    distanceToNearestFacility,
    impactLevel,
    alerts: alerts.length > 0 ? alerts : undefined,
  };

  return {
    electricityInfrastructure,
  };
};

if (import.meta.main) {
  console.log("\n=== ELECTRICITY INFRASTRUCTURE TEST ===\n");

  const testAddresses = [
    {
      addressLine: "123 Main Street",
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
      const { electricityInfrastructure } = await getElectricityData({
        address,
      });

      console.log("\nElectricity Infrastructure:");
      console.log(`  Connected to Grid: ${electricityInfrastructure.isConnectedToGrid}`);
      console.log(
        `  Distance to Transmission Line: ${
          electricityInfrastructure.distanceToNearestTransmissionLine !== null
            ? `${electricityInfrastructure.distanceToNearestTransmissionLine.toFixed(0)}m`
            : "N/A"
        }`
      );
      console.log(
        `  Distance to Facility: ${
          electricityInfrastructure.distanceToNearestFacility !== null
            ? `${electricityInfrastructure.distanceToNearestFacility.toFixed(0)}m`
            : "N/A"
        }`
      );
      console.log(`  Impact Level: ${electricityInfrastructure.impactLevel.toUpperCase()}`);

      if (electricityInfrastructure.alerts && electricityInfrastructure.alerts.length > 0) {
        console.log("\nAlerts:");
        electricityInfrastructure.alerts.forEach((alert, index) => {
          const icon = alert.type === "risk" ? "⚠️" : "ℹ️";
          console.log(`  ${index + 1}. ${icon} [${alert.type.toUpperCase()}] ${alert.message}`);
        });
      } else {
        console.log("\nAlerts: None");
      }

      // Write to JSON file
      const outputPath = path.join(
        __dirname,
        `electricityInfrastructure_${address.suburb.toLowerCase()}.json`
      );
      fs.writeFileSync(
        outputPath,
        JSON.stringify(electricityInfrastructure, null, 2)
      );
      console.log(`\n✓ Data written to ${outputPath}`);
    } catch (error) {
      console.error(`Error processing address: ${error}`);
    }
  }

  console.log(`\n${"=".repeat(80)}\n`);
}
