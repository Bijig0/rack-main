import axios from "axios";
import fs from "fs";
import path from "path";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { getHeritageVicmapResponseSchema } from "./createHeritageResponseSchema/inferRawHeritageData/getHeritageVicmapResponseSchema";
import { inferRawHeritageData } from "./createHeritageResponseSchema/inferRawHeritageData/inferRawHeritageData";
import { InferredHeritageData } from "./createHeritageResponseSchema/inferRawHeritageData/types";

type Args = {
  address: Address;
};

type Return = {
  heritageData: InferredHeritageData[];
};

const HERITAGE_WFS_URL = WFS_DATA_URL;

/**
 * Fetches Victorian Heritage Inventory data from Vicmap
 * Data source: open-data-platform:heritage_inventory
 */
export const getVicmapHeritageData = async ({ address }: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address })!;

  const params = createWfsParams({
    lat,
    lon,
    typeName: "open-data-platform:heritage_inventory",
  });

  const response = await axios.get(HERITAGE_WFS_URL, {
    params,
  });

  const parsedResponse = getHeritageVicmapResponseSchema().parse(response.data);

  const heritageFeatures = parsedResponse.features;

  const { inferredHeritageData } = inferRawHeritageData({
    features: heritageFeatures,
  });

  return { heritageData: inferredHeritageData };
};

if (import.meta.main) {
  const { heritageData } = await getVicmapHeritageData({
    address: {
      addressLine: "Flinders Street Station",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    },
  });

  // Write to JSON file
  const outputPath = path.join(__dirname, "heritageData.json");

  fs.writeFileSync(outputPath, JSON.stringify(heritageData, null, 2));
}
