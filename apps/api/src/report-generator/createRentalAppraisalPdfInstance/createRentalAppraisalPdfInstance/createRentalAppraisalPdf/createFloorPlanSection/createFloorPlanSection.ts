import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getFloorPlanData from "./getFloorPlanData/getFloorPlanData";

type Args = {
  address: Address;
};

const createFloorPlanSection = async ({
  address,
}: Args): Promise<Section | null> => {
  // Fetch floor plan data
  const { floorPlanData } = await getFloorPlanData({ address });

  // Return null if no floor plan available
  if (!floorPlanData) {
    return null;
  }

  const floorPlanImage = floorPlanData.floorPlanImage;
  const template = {
    schemas: [
      {
        sectionTitle: {
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        floorPlan: {
          type: "image",
          position: { x: 20, y: 40 },
          width: 170,
          height: 220,
        },
      },
    ],
    basePdf: "",
  };

  const inputs = [
    {
      sectionTitle: "Floor Plan",
      floorPlan: floorPlanImage,
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createFloorPlanSection;
