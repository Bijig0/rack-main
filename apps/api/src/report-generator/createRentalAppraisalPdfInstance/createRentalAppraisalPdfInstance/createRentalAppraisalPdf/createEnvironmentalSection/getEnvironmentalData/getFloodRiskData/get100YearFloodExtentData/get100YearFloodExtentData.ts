// import axios from "axios";
// import { Address } from "../../../../../../../../shared/types";
// import { createWfsParams } from "../../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
// import { WFS_DATA_URL } from "../../../../../../wfsDataToolkit/defaults";
// import { geocodeAddress } from "../../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
// import { VicmapResponseSchema } from "../../../../../../wfsDataToolkit/types";
// import { Flood100YearFeatures, Flood100YearFeaturesSchema } from "../types";

// type Args = {
//   address: Address;
//   bufferMeters?: number; // Search radius in meters
// };

// type Return = {
//   flood100YearFeatures: Flood100YearFeatures;
// };

// /**
//  * Fetches 1 in 100 year flood extent data from Victorian Government WFS
//  * Uses the statistical flood extent layer with 100 year Average Recurrence Interval (ARI)
//  *
//  * Data Source: Victoria - 1 in 100 Year Flood Extent
//  * This dataset contains polygon data delineating modelled statistical flood extent with an
//  * Average Recurrence Interval (ARI) of 100 years (1% Annual Exceedance Probability - AEP).
//  *
//  * The 1 in 100 year flood event relates to a flood that has a one percent chance of
//  * occurring in any given year. This is used in the creation of 'Land Subject to Inundation'
//  * areas as used in Planning Scheme Zones.
//  *
//  * Data is statistically derived using hydrological models, historic flood extents and heights.
//  */
// export const get100YearFloodExtentData = async ({
//   address,
//   bufferMeters = 1000, // Default 1km radius for flood assessment
// }: Args): Promise<Return> => {
//   console.log(`Fetching 1 in 100 year flood extent data within ${bufferMeters}m of address...`);

//   try {
//     const geocoded = await geocodeAddress({ address });

//     if (!geocoded) {
//       console.log("❌ Geocoding failed");
//       return { flood100YearFeatures: [] };
//     }

//     const { lat, lon } = geocoded;

//     // Convert meters to degrees (approximately 111km per degree at equator)
//     const bufferDegrees = bufferMeters / 111000;

//     // Create WFS parameters for 100 year flood extent query
//     // Note: The actual typename may vary - common variations include:
//     // - "FLOOD_EXTENT_100Y_ARI"
//     // - "open-data-platform:FLOOD_100_YEAR"
//     // - "VIC_FLOOD_100_YEAR_EXTENT"
//     const params = createWfsParams({
//       lat,
//       lon,
//       buffer: bufferDegrees,
//       typeName: "open-data-platform:FLOOD_100_YEAR_EXTENT", // This may need to be confirmed
//     });

//     const response = await axios.get(WFS_DATA_URL, { params });

//     const parsedResponse = VicmapResponseSchema.parse(response.data);
//     const features = parsedResponse.features;

//     if (!features || features.length === 0) {
//       console.log("✅ No 1 in 100 year flood extent found within buffer");
//       return { flood100YearFeatures: [] };
//     }

//     const flood100YearFeatures = Flood100YearFeaturesSchema.parse(features);

//     console.log(`✅ Found ${flood100YearFeatures.length} 100-year flood zone(s) within ${bufferMeters}m`);

//     return { flood100YearFeatures };
//   } catch (error) {
//     console.error("Error fetching 100 year flood extent data:", error);
//     // Return empty array instead of throwing to allow analysis to continue with available data
//     console.log("⚠️  Continuing with available flood data sources");
//     return { flood100YearFeatures: [] };
//   }
// };
