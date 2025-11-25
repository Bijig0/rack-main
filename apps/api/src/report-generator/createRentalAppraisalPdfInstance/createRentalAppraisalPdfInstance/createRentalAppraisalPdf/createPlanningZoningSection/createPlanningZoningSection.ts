import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getPlanningZoningData from "./getPlanningZoningData/getPlanningZoningData";

type Args = {
  address: Address;
};

const createPlanningZoningSection = async ({
  address,
}: Args): Promise<Section | null> => {
  // Fetch planning and zoning data
  const { planningZoningData } = await getPlanningZoningData({ address });

  // Return null if no planning data available
  if (!planningZoningData) {
    return null;
  }

  const planningZoning = planningZoningData;
  const template = {
    schemas: [
      [
        {
          name: "planningTitle",
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        {
          name: "planningSubtitle",
          type: "text",
          position: { x: 20, y: 35 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Roboto",
        },
        {
          name: "planningDetails",
          type: "text",
          position: { x: 20, y: 50 },
          width: 170,
          height: 100,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "note",
          type: "text",
          position: { x: 20, y: 160 },
          width: 170,
          height: 20,
          fontSize: 9,
          fontColor: "#666666",
          fontStyle: "italic",
          fontName: "Roboto",
        },
      ],
    ],
    basePdf: "",
  };

  const planningDetailsLines = [];
  if (planningZoning.regionalPlan)
    planningDetailsLines.push(`Regional Plan: ${planningZoning.regionalPlan}`);
  if (planningZoning.landUse)
    planningDetailsLines.push(`Land Use: ${planningZoning.landUse}`);
  if (planningZoning.planningScheme)
    planningDetailsLines.push(
      `Planning Scheme: ${planningZoning.planningScheme}`
    );
  if (planningZoning.zone)
    planningDetailsLines.push(`Zone: ${planningZoning.zone}`);
  if (planningZoning.zonePrecinct)
    planningDetailsLines.push(`Zone Precinct: ${planningZoning.zonePrecinct}`);
  if (planningZoning.localPlan)
    planningDetailsLines.push(`Local Plan: ${planningZoning.localPlan}`);
  if (planningZoning.localPlanPrecinct)
    planningDetailsLines.push(
      `Local Plan Precinct: ${planningZoning.localPlanPrecinct}`
    );
  if (planningZoning.localPlanSubprecinct)
    planningDetailsLines.push(
      `Local Plan Subprecinct: ${planningZoning.localPlanSubprecinct}`
    );

  const inputs = [
    {
      planningTitle: "Planning and Zoning",
      planningSubtitle: "Planning scheme and zoning information",
      planningDetails:
        planningDetailsLines.length > 0
          ? planningDetailsLines.join("\n\n")
          : "No planning and zoning information available",
      note: "Note: Zoning data sourced from Victoria Planning Scheme Zone data. For other states, please refer to local planning authorities.",
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createPlanningZoningSection;
