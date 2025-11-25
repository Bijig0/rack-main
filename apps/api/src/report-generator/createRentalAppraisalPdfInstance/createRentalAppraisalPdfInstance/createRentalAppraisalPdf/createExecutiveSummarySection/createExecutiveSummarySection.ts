import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getExecutiveSummaryData from "./getExecutiveSummaryData/getExecutiveSummaryData";

type Args = {
  address: Address;
};

const createExecutiveSummarySection = async ({
  address,
}: Args): Promise<Section> => {
  // Fetch executive summary data
  const { executiveSummaryData } = await getExecutiveSummaryData({ address });
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
        propertyType: {
          type: "text",
          position: { x: 20, y: 40 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        council: {
          type: "text",
          position: { x: 20, y: 50 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        yearBuilt: {
          type: "text",
          position: { x: 20, y: 60 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        landArea: {
          type: "text",
          position: { x: 20, y: 70 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        floorArea: {
          type: "text",
          position: { x: 20, y: 80 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        distanceToCBD: {
          type: "text",
          position: { x: 110, y: 40 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        estimatedValue: {
          type: "text",
          position: { x: 110, y: 50 },
          width: 80,
          height: 8,
          fontSize: 11,
        },
        ...(executiveSummaryData.propertyImage && {
          propertyImage: {
            type: "image",
            position: { x: 20, y: 100 },
            width: 170,
            height: 100,
          },
        }),
      },
    ],
    basePdf: "",
  };

  const estimatedValueText = executiveSummaryData.estimatedValueRange
    ? `Estimated Value: $${executiveSummaryData.estimatedValueRange.min.toLocaleString()} - $${executiveSummaryData.estimatedValueRange.max.toLocaleString()}`
    : "Estimated Value: N/A";

  const inputs = [
    {
      sectionTitle: "Executive Summary",
      propertyType: `Property Type: ${
        executiveSummaryData.propertyType.charAt(0).toUpperCase() +
        executiveSummaryData.propertyType.slice(1)
      }`,
      council: `Council: ${executiveSummaryData.council}`,
      yearBuilt: executiveSummaryData.yearBuilt
        ? `Year Built: ${executiveSummaryData.yearBuilt}`
        : "Year Built: N/A",
      landArea: executiveSummaryData.landArea
        ? `Land Area: ${executiveSummaryData.landArea} sqm`
        : "Land Area: N/A",
      floorArea: executiveSummaryData.floorArea
        ? `Floor Area: ${executiveSummaryData.floorArea} sqm`
        : "Floor Area: N/A",
      distanceToCBD: executiveSummaryData.distanceToCBD
        ? `Distance to CBD: ${executiveSummaryData.distanceToCBD} km`
        : "Distance to CBD: N/A",
      estimatedValue: estimatedValueText,
      ...(executiveSummaryData.propertyImage && {
        propertyImage: executiveSummaryData.propertyImage,
      }),
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createExecutiveSummarySection;
