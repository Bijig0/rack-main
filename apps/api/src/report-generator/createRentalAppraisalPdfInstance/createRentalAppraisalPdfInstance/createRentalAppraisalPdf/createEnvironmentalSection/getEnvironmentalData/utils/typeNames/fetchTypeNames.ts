import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

const WFS_URL =
  "https://opendata.maps.vic.gov.au/geoserver/wfs?request=GetCapabilities&service=WFS";

// Paths
const OUTPUT_JSON = path.join(__dirname, "typeNames.json");

interface FeatureType {
  Name: string;
}

/**
 * Fetches the typeNames from the Vicmap WFS and returns as string array
 */
export async function fetchTypeNames(): Promise<string[]> {
  try {
    const response = await axios.get(WFS_URL);
    const xml = response.data;

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });
    const json = parser.parse(xml) as any;

    const featureTypes: FeatureType[] =
      json["wfs:WFS_Capabilities"]?.FeatureTypeList?.FeatureType || [];

    const typeNames = featureTypes.map((ft) => ft.Name).filter(Boolean);

    // Save JSON for reference
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(typeNames, null, 2));
    console.log(`Saved ${typeNames.length} typeNames to ${OUTPUT_JSON}`);

    return typeNames;
  } catch (err) {
    console.error("Failed to fetch or parse WFS:", err);
    return [];
  }
}
