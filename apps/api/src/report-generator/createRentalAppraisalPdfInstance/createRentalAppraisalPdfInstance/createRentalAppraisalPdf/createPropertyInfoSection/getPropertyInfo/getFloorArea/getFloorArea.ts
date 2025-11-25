import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { FloorAreaSchema } from "./types";
import { getPropertyValueDotComFloorArea } from "./getPropertyValueDotComeFloorArea/getPropertyValueDotComeFloorArea";
// import { getPropertyValueDotComLandArea } from "./getPropertyValueDotComLandArea/getPropertyValueDotComLandArea";

/**
 * Gets the land area for a property
 *
 * Workflow:
 * 1. Checks if propertyPage.html exists
 * 2. If not, runs selenium-login.ts to scrape and create it
 * 3. Parses the HTML to extract land area
 *
 * @param address - Property address (used for scraping if needed)
 * @returns Land area in square meters, or null if not found
 */

// TODO: Create getPropertyValueDotComLandArea fetcher
// For now, using empty sourceFns array as a placeholder
export const getFloorArea = createPropertyInfoGetter({
  schema: z.object({ floorArea: FloorAreaSchema }),
  sourceFns: [getPropertyValueDotComFloorArea],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { floorArea } = await Effect.runPromise(
    getFloorArea({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ floorArea });
}
