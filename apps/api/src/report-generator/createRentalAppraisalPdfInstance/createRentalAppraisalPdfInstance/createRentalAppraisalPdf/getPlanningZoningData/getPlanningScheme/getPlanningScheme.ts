import { Effect, Option } from "effect";
import { titleCase } from "title-case";
import type { Address } from "../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { PlanningScheme } from "./types";

type Args = {
  address: Address;
};

/**
 * Gets the planning scheme name for an address.
 *
 * Planning schemes in Victoria are named after the LGA, e.g.:
 * - "Boroondara Planning Scheme"
 * - "Melbourne Planning Scheme"
 * - "Greater Geelong Planning Scheme"
 *
 * Uses the shared cache from getPlanningZoneData, so if getPlanningZoneData
 * has already been called for this address, no additional WFS call is made.
 *
 * @param address - The property address
 * @returns The planning scheme name (e.g., "Boroondara Planning Scheme") or null if not available
 */

export const getPlanningScheme = ({
  address,
}: Args): Effect.Effect<Option.Option<PlanningScheme>, Error> =>
  getPlanningZoneData({ address }).pipe(
    Effect.map(({ planningZoneData }) =>
      Option.match(planningZoneData, {
        onNone: () => Option.none(),
        onSome: (zoneData) => {
          const lgaName = zoneData?.lgaName?.toLocaleLowerCase() ?? "";
          const cleanedLgaName = titleCase(lgaName);
          return Option.some(`${cleanedLgaName} Planning Scheme`);
        },
      })
    )
  );

if (import.meta.main) {
  const planningScheme = await getPlanningScheme({
    address: {
      addressLine: "123 Collins Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    },
  });
  console.log({ planningScheme });
}
