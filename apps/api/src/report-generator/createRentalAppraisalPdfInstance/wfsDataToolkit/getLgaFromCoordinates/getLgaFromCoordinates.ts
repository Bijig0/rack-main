import axios from "axios";
import { createWfsParams } from "../createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../defaults";
import { VicmapResponseSchema } from "../types";
import { z } from "zod";

type Args = {
  lat: number;
  lon: number;
};

type Return = {
  lgaName: string | null;
  lgaCode: string | null;
};

const LgaFeatureSchema = z.object({
  properties: z.object({
    lga: z.string().optional(),
    lga_code: z.string().optional(),
  }),
});

/**
 * Gets LGA (Local Government Area / Council) information from coordinates
 * using the Victorian Planning WFS service.
 *
 * Uses the plan_zone layer which contains LGA information for each planning zone.
 *
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns LGA name and code, or null if not found
 */
export async function getLgaFromCoordinates({
  lat,
  lon,
}: Args): Promise<Return> {
  try {
    const params = createWfsParams({
      lat,
      lon,
      typeName: "open-data-platform:plan_zone",
    });

    const response = await axios.get(WFS_DATA_URL, { params });
    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("No LGA data found for this location");
      return { lgaName: null, lgaCode: null };
    }

    const feature = LgaFeatureSchema.parse(features[0]);
    const lgaName = feature.properties.lga || null;
    const lgaCode = feature.properties.lga_code || null;

    if (lgaName) {
      console.log(`✅ Found LGA: ${lgaName} (${lgaCode || "no code"})`);
    }

    return { lgaName, lgaCode };
  } catch (error) {
    console.error("Error fetching LGA from coordinates:", error);
    return { lgaName: null, lgaCode: null };
  }
}

export default getLgaFromCoordinates;

if (import.meta.main) {
  // Test with Kew coordinates
  const result = await getLgaFromCoordinates({
    lat: -37.8074,
    lon: 145.0354,
  });
  console.log("LGA Result:", result);
}
