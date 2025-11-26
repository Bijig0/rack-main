#!/Users/a61403/.bun/bin/bun
import { PlanningOverlayItem } from "../getPlanningOverlay/types";
import { ZonePrecinctType } from "./types";

type Args = {
  overlays: PlanningOverlayItem[];
  zoneCode: string;
};

type Return = {
  zonePrecinct: ZonePrecinctType;
};

/**
 * Determines zone precinct classification based on planning overlay combinations
 *
 * Precinct types are inferred from the presence and combination of specific overlays:
 * - Heritage Precinct: Multiple Heritage Overlays (HO)
 * - Design and Development Precinct: Design and Development Overlays (DDO)
 * - Environmental Precinct: Environmental/Vegetation Protection Overlays (ESO, VPO)
 * - Mixed Use Precinct: Combination of commercial/residential overlays
 * - Activity Centre Precinct: Parking Overlays (PO) with commercial zones
 * - Special Use Precinct: Special Building Overlays (SBO) or other specialized overlays
 *
 * @param overlays - Array of planning overlays affecting the property
 * @param zoneCode - The planning zone code (e.g., "RGZ1", "C1Z")
 * @returns Zone precinct classification or undefined if no clear pattern
 */
export const getZonePrecinct = ({ overlays, zoneCode }: Args): Return => {
  console.log("\n🏛️  Analyzing zone precinct from overlays...");

  if (!overlays || overlays.length === 0) {
    console.log("No overlays provided - cannot determine precinct");
    return { zonePrecinct: undefined };
  }

  // Count overlay types
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

  // Track all overlay types for logging
  const allOverlayTypes = Object.entries(overlayCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${type}(${count})`)
    .join(", ");

  console.log(`Overlay types present: ${allOverlayTypes || "None"}`);

  let precinctType: ZonePrecinctType | undefined;

  // Heritage Precinct: Multiple heritage overlays OR heritage + character overlays
  if (overlayCounts.HO >= 2 || (overlayCounts.HO >= 1 && overlayCounts.NCO >= 1)) {
    precinctType = "Heritage Precinct";
  }
  // Design and Development Precinct: DDO overlays with design controls
  else if (overlayCounts.DDO >= 1) {
    precinctType = "Design and Development Precinct";
  }
  // Environmental Precinct: Environmental or vegetation protection overlays
  else if (overlayCounts.ESO >= 1 || overlayCounts.VPO >= 1 || overlayCounts.SLO >= 1) {
    precinctType = "Environmental Precinct";
  }
  // Activity Centre Precinct: Parking overlays in commercial/mixed use zones
  else if (
    overlayCounts.PO >= 1 &&
    (zoneCode.includes("C") || zoneCode.includes("MUZ") || zoneCode.includes("ACZ"))
  ) {
    precinctType = "Activity Centre Precinct";
  }
  // Special Use Precinct: Special building or floodway overlays
  else if (overlayCounts.SBO >= 1 || overlayCounts.FO >= 1 || overlayCounts.LSIO >= 1) {
    precinctType = "Special Use Precinct";
  }
  // Mixed Use Precinct: Development Plan Overlay in mixed zones
  else if (
    overlayCounts.DPO >= 1 &&
    (zoneCode.includes("MUZ") || zoneCode.includes("RGZ") || zoneCode.includes("C"))
  ) {
    precinctType = "Mixed Use Precinct";
  }
  // Single heritage overlay can still indicate heritage precinct
  else if (overlayCounts.HO >= 1) {
    precinctType = "Heritage Precinct";
  }

  if (precinctType) {
    console.log(`✅ Zone precinct identified: ${precinctType}`);
  } else {
    console.log("ℹ️  No clear precinct pattern identified");
  }

  return { zonePrecinct: precinctType };
};

export default getZonePrecinct;

// Test the function if run directly
if (import.meta.main) {
  console.log("=".repeat(80));
  console.log("Testing getZonePrecinct");
  console.log("=".repeat(80));

  const testCases = [
    {
      name: "Heritage Precinct (multiple HO)",
      overlays: [
        { overlayCode: "HO485", overlayDescription: "Heritage Overlay 485" },
        { overlayCode: "HO109", overlayDescription: "Heritage Overlay 109" },
      ],
      zoneCode: "NRZ1",
    },
    {
      name: "Design and Development Precinct",
      overlays: [
        { overlayCode: "DDO1", overlayDescription: "Design and Development Overlay 1" },
        { overlayCode: "DDO2", overlayDescription: "Design and Development Overlay 2" },
      ],
      zoneCode: "RGZ1",
    },
    {
      name: "Environmental Precinct",
      overlays: [
        { overlayCode: "ESO1", overlayDescription: "Environmental Significance Overlay 1" },
        { overlayCode: "VPO1", overlayDescription: "Vegetation Protection Overlay 1" },
      ],
      zoneCode: "GRZ1",
    },
    {
      name: "Activity Centre Precinct",
      overlays: [{ overlayCode: "PO1", overlayDescription: "Parking Overlay 1" }],
      zoneCode: "C1Z",
    },
    {
      name: "Special Use Precinct",
      overlays: [{ overlayCode: "SBO1", overlayDescription: "Special Building Overlay 1" }],
      zoneCode: "GRZ1",
    },
    {
      name: "Mixed Use Precinct",
      overlays: [{ overlayCode: "DPO3", overlayDescription: "Development Plan Overlay 3" }],
      zoneCode: "MUZ",
    },
    {
      name: "No precinct pattern",
      overlays: [{ overlayCode: "PAO1", overlayDescription: "Public Acquisition Overlay 1" }],
      zoneCode: "GRZ1",
    },
    {
      name: "No overlays",
      overlays: [],
      zoneCode: "GRZ1",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`Zone Code: ${testCase.zoneCode}`);
    console.log(`Overlays: ${testCase.overlays.map((o) => o.overlayCode).join(", ")}`);

    const { zonePrecinct } = getZonePrecinct({
      overlays: testCase.overlays,
      zoneCode: testCase.zoneCode,
    });

    console.log(`Result: ${zonePrecinct || "undefined"}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("Testing complete");
  console.log("=".repeat(80));
}
