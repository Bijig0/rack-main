import fs from "fs";
import path from "path";
import { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { analyzeOdourLevels, OdourLevelAnalysis } from "./analyzeOdourLevels";
import { InferredWastewaterData } from "./createWastewaterResponseSchema/types";
import { InferredEpaLicenceData } from "./getEpaLicensedPremises";
import { getIndustrialFacilities } from "./getIndustrialFacilities";
import { getLandfillData } from "./getLandfillData";
import { getWastewaterTreatmentPlants } from "./getWastewaterTreatmentPlants";
import { InferredOdoursData } from "./types";

type Args = {
  address: Address;
};

type Return = {
  landfills: InferredOdoursData[];
  wastewaterPlants: InferredWastewaterData[];
  industrialFacilities: InferredEpaLicenceData[];
  odourLevelAnalysis: OdourLevelAnalysis;
};

/**
 * Get comprehensive odour level data from multiple sources
 * Includes: landfills, wastewater treatment plants, and industrial facilities
 */
export const getOdourData = async ({ address }: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address });

  // Fetch all three datasets in parallel
  const [landfills, wastewaterPlants, industrialFacilities] = await Promise.all(
    [
      getLandfillData({ lat, lon }),
      getWastewaterTreatmentPlants({ lat, lon }),
      getIndustrialFacilities({ lat, lon }),
    ]
  );

  // Analyze odour levels based on all data sources
  const odourLevelAnalysis = analyzeOdourLevels({
    landfills,
    wastewaterPlants,
    industrialFacilities,
    propertyLat: lat,
    propertyLon: lon,
  });

  return {
    landfills,
    wastewaterPlants,
    industrialFacilities,
    odourLevelAnalysis,
  };
};

if (import.meta.main) {
  const {
    landfills,
    wastewaterPlants,
    industrialFacilities,
    odourLevelAnalysis,
  } = await getOdourData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3000",
    },
  });

  console.log("\n=== ODOUR LEVEL ANALYSIS ===");
  console.log(`Overall Level: ${odourLevelAnalysis.overallLevel}`);
  console.log(`\n${odourLevelAnalysis.summary}`);

  console.log("\n--- Odour Sources ---");
  if (odourLevelAnalysis.odourSources.closestLandfill) {
    console.log("\nClosest Landfill:");
    console.log(
      `  Name: ${odourLevelAnalysis.odourSources.closestLandfill.name}`
    );
    console.log(
      `  Distance: ${odourLevelAnalysis.odourSources.closestLandfill.distance.measurement.toFixed(
        2
      )}${odourLevelAnalysis.odourSources.closestLandfill.distance.unit}`
    );
    console.log(
      `  Status: ${odourLevelAnalysis.odourSources.closestLandfill.status}`
    );
  }

  if (odourLevelAnalysis.odourSources.closestWastewaterPlant) {
    console.log("\nClosest Wastewater Plant:");
    console.log(
      `  Name: ${odourLevelAnalysis.odourSources.closestWastewaterPlant.name}`
    );
    console.log(
      `  Distance: ${odourLevelAnalysis.odourSources.closestWastewaterPlant.distance.measurement.toFixed(
        2
      )}${odourLevelAnalysis.odourSources.closestWastewaterPlant.distance.unit}`
    );
  }

  if (odourLevelAnalysis.odourSources.closestIndustrialFacility) {
    console.log("\nClosest Industrial Facility:");
    console.log(
      `  Name: ${odourLevelAnalysis.odourSources.closestIndustrialFacility.name}`
    );
    console.log(
      `  Activity: ${odourLevelAnalysis.odourSources.closestIndustrialFacility.activity}`
    );
    console.log(
      `  Distance: ${odourLevelAnalysis.odourSources.closestIndustrialFacility.distance.measurement.toFixed(
        2
      )}${
        odourLevelAnalysis.odourSources.closestIndustrialFacility.distance.unit
      }`
    );
  }

  console.log(
    `\nLandfills within 10km: ${odourLevelAnalysis.odourSources.landfillsWithin10km}`
  );
  console.log(
    `Wastewater Plants within 10km: ${odourLevelAnalysis.odourSources.wastewaterPlantsWithin10km}`
  );
  console.log(
    `Industrial Facilities within 5km: ${odourLevelAnalysis.odourSources.industrialFacilitiesWithin5km}`
  );

  console.log("\n--- Considerations ---");
  odourLevelAnalysis.considerations.forEach((consideration, i) => {
    console.log(`${i + 1}. ${consideration}`);
  });

  console.log("\n--- Data Summary ---");
  console.log(`Landfills: ${landfills.length}`);
  console.log(`Wastewater Plants: ${wastewaterPlants.length}`);
  console.log(`Industrial Facilities: ${industrialFacilities.length}`);

  // Write to JSON file
  const outputPath = path.join(__dirname, "odour_level_analysis.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        landfills: landfills.slice(0, 10), // Limit to first 10 for readability
        wastewaterPlants: wastewaterPlants.slice(0, 10),
        industrialFacilities,
        odourLevelAnalysis,
      },
      null,
      2
    )
  );

  console.log(`\n✓ Full data written to ${outputPath}`);
}
