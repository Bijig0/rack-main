import { Effect } from "effect";
import { PlanningOverlayItem } from "../getPlanningOverlay/types";
import { ZonePrecinctType } from "./types";

type Args = {
  overlays: PlanningOverlayItem[];
  zoneCode: string;
};

type Return = {
  zonePrecinct: ZonePrecinctType;
};

export const getZonePrecinct = ({
  overlays,
  zoneCode,
}: Args): Effect.Effect<Return, never> =>
  Effect.sync(() => {
    console.log("\n🏛️  Analyzing zone precinct from overlays...");

    if (!overlays || overlays.length === 0) {
      console.log("No overlays provided - cannot determine precinct");
      return { zonePrecinct: undefined };
    }

    const overlayCounts = {
      HO: overlays.filter((o) => o.overlayCode.startsWith("HO")).length,
      DDO: overlays.filter((o) => o.overlayCode.startsWith("DDO")).length,
      ESO: overlays.filter((o) => o.overlayCode.startsWith("ESO")).length,
      VPO: overlays.filter((o) => o.overlayCode.startsWith("VPO")).length,
      SLO: overlays.filter((o) => o.overlayCode.startsWith("SLO")).length,
      NCO: overlays.filter((o) => o.overlayCode.startsWith("NCO")).length,
      PO: overlays.filter((o) => o.overlayCode.startsWith("PO")).length,
      SBO: overlays.filter((o) => o.overlayCode.startsWith("SBO")).length,
      LSIO: overlays.filter((o) => o.overlayCode.startsWith("LSIO")).length,
      FO: overlays.filter((o) => o.overlayCode.startsWith("FO")).length,
      PAO: overlays.filter((o) => o.overlayCode.startsWith("PAO")).length,
      DPO: overlays.filter((o) => o.overlayCode.startsWith("DPO")).length,
    };

    const allOverlayTypes = Object.entries(overlayCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${type}(${count})`)
      .join(", ");

    console.log(`Overlay types present: ${allOverlayTypes || "None"}`);

    let precinctType: ZonePrecinctType | undefined;

    if (
      overlayCounts.HO >= 2 ||
      (overlayCounts.HO >= 1 && overlayCounts.NCO >= 1)
    ) {
      precinctType = "Heritage Precinct";
    } else if (overlayCounts.DDO >= 1) {
      precinctType = "Design and Development Precinct";
    } else if (
      overlayCounts.ESO >= 1 ||
      overlayCounts.VPO >= 1 ||
      overlayCounts.SLO >= 1
    ) {
      precinctType = "Environmental Precinct";
    } else if (
      overlayCounts.PO >= 1 &&
      (zoneCode.includes("C") ||
        zoneCode.includes("MUZ") ||
        zoneCode.includes("ACZ"))
    ) {
      precinctType = "Activity Centre Precinct";
    } else if (
      overlayCounts.SBO >= 1 ||
      overlayCounts.FO >= 1 ||
      overlayCounts.LSIO >= 1
    ) {
      precinctType = "Special Use Precinct";
    } else if (
      overlayCounts.DPO >= 1 &&
      (zoneCode.includes("MUZ") ||
        zoneCode.includes("RGZ") ||
        zoneCode.includes("C"))
    ) {
      precinctType = "Mixed Use Precinct";
    } else if (overlayCounts.HO >= 1) {
      precinctType = "Heritage Precinct";
    }

    if (precinctType) {
      console.log(`✅ Zone precinct identified: ${precinctType}`);
    } else {
      console.log("ℹ️  No clear precinct pattern identified");
    }

    return { zonePrecinct: precinctType };
  });
