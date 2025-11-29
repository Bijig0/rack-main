import type { Address } from "../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { ZoneDescription } from "./types";

type Args = {
  address: Address;
};

/**
 * Gets the zone description for an address.
 *
 * Uses the shared cache from getPlanningZoneData, so if getPlanningZoneData
 * has already been called for this address, no additional WFS call is made.
 *
 * @param address - The property address
 * @returns The zone description (e.g., "General Residential Zone", "Neighbourhood Residential Zone") or null if not available
 */
import { Effect, Option } from "effect";

export const getZoneDescription = ({
  address,
}: Args): Effect.Effect<ZoneDescription, Error> =>
  getPlanningZoneData({ address }).pipe(
    Effect.map(({ planningZoneData }) =>
      Option.match(planningZoneData, {
        onNone: () => null,
        onSome: (pz) => pz?.zoneDescription ?? null,
      })
    )
  );

export default getZoneDescription;
