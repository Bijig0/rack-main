import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getEnvironmentalData from "./getEnvironmentalData/getEnvironmentalData";

type Args = {
  address: Address;
};

const createEnvironmentalSection = async ({
  address,
}: Args): Promise<Section | null> => {
  // Fetch environmental data
  const { environmentalData } = await getEnvironmentalData({ address });

  // Return null if no environmental data available
  if (!environmentalData) {
    return null;
  }

  const considerations = environmentalData;
  const template = {
    schemas: [
      [
        {
          name: "environmentalTitle",
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        {
          name: "environmentalSubtitle",
          type: "text",
          position: { x: 20, y: 35 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Roboto",
        },
        {
          name: "considerationsList",
          type: "text",
          position: { x: 20, y: 50 },
          width: 85,
          height: 120,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "considerationsList2",
          type: "text",
          position: { x: 105, y: 50 },
          width: 85,
          height: 120,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "note",
          type: "text",
          position: { x: 20, y: 180 },
          width: 170,
          height: 30,
          fontSize: 9,
          fontColor: "#666666",
          fontStyle: "italic",
          fontName: "Roboto",
        },
      ],
    ],
    basePdf: "",
  };

  const considerationItems = [
    { key: "easements", label: "Easements" },
    { key: "heritage", label: "Heritage Listed" },
    { key: "character", label: "Character Overlay" },
    { key: "floodRisk", label: "Flood Risk" },
    { key: "biodiversity", label: "Biodiversity" },
    { key: "coastalHazards", label: "Coastal Hazards" },
    { key: "waterways", label: "Waterways" },
    { key: "wetlands", label: "Wetlands" },
    { key: "bushfireRisk", label: "Bushfire Risk" },
    { key: "steepLand", label: "Steep Land/Landslide Risk" },
    { key: "noisePollution", label: "Noise Pollution" },
    { key: "odours", label: "Odours (Landfill)" },
  ];

  const halfwayPoint = Math.ceil(considerationItems.length / 2);
  const column1Items = considerationItems.slice(0, halfwayPoint);
  const column2Items = considerationItems.slice(halfwayPoint);

  const formatColumn = (items: typeof considerationItems) => {
    return items
      .map((item) => {
        const value = considerations[item.key as keyof typeof considerations];
        const status = value ? "Yes" : "No";
        const icon = value ? "⚠" : "✓";
        return `${icon} ${item.label}: ${status}`;
      })
      .join("\n");
  };

  const inputs = [
    {
      environmentalTitle: "Environmental and Planning Considerations",
      environmentalSubtitle:
        "Environmental factors and planning overlays affecting the property",
      considerationsList: formatColumn(column1Items),
      considerationsList2: formatColumn(column2Items),
      note: "Note: Data calculated by intersecting property coordinates with environmental data layers from state data catalogues. ✓ indicates no identified risk, ⚠ indicates potential consideration required.",
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createEnvironmentalSection;
