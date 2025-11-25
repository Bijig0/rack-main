import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getLocationSuburbData from "./getLocationSuburbData/getLocationSuburbData";

type Args = {
  address: Address;
};

const createLocationSuburbSection = async ({
  address,
}: Args): Promise<Section> => {
  // Fetch location and suburb data
  const { locationSuburbData } = await getLocationSuburbData({ address });

  const data = locationSuburbData;
  const template = {
    schemas: [
      [
        {
          name: "locationTitle",
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        {
          name: "locationInfo",
          type: "text",
          position: { x: 20, y: 40 },
          width: 85,
          height: 60,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "demographicsTitle",
          type: "text",
          position: { x: 20, y: 110 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "demographics",
          type: "text",
          position: { x: 20, y: 122 },
          width: 85,
          height: 40,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "occupancyTitle",
          type: "text",
          position: { x: 105, y: 110 },
          width: 85,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "occupancy",
          type: "text",
          position: { x: 105, y: 122 },
          width: 85,
          height: 40,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "rentalYieldTitle",
          type: "text",
          position: { x: 20, y: 170 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "rentalYield",
          type: "text",
          position: { x: 20, y: 182 },
          width: 170,
          height: 30,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
      ],
    ],
    basePdf: "",
  };

  const locationLines = [];
  locationLines.push(`Suburb: ${data.suburb}`);
  locationLines.push(`State: ${data.state}`);
  if (data.distanceToCBD) {
    locationLines.push(`Distance to CBD: ${data.distanceToCBD} km`);
  }

  const demographicsLines = [];
  if (data.population) {
    demographicsLines.push(`Population: ${data.population.toLocaleString()}`);
  }
  if (data.populationGrowth !== undefined) {
    const growthSign = data.populationGrowth >= 0 ? "+" : "";
    demographicsLines.push(
      `5-Year Growth: ${growthSign}${data.populationGrowth.toFixed(1)}%`
    );
  }

  const occupancyLines = [];
  if (data.occupancyData) {
    occupancyLines.push("Occupancy Distribution:");
    occupancyLines.push(`  Owners: ${data.occupancyData.purchaser}%`);
    occupancyLines.push(`  Renters: ${data.occupancyData.renting}%`);
    if (data.occupancyData.other > 0) {
      occupancyLines.push(`  Other: ${data.occupancyData.other}%`);
    }
  } else {
    occupancyLines.push("No occupancy data available");
  }

  const rentalYieldText =
    data.rentalYieldGrowth && data.rentalYieldGrowth.length > 0
      ? `Historical rental yields: ${data.rentalYieldGrowth
          .map((y) => `${y.toFixed(2)}%`)
          .join(", ")}`
      : "No rental yield growth data available";

  const inputs = [
    {
      locationTitle: "Location and Suburb Analysis",
      locationInfo: locationLines.join("\n"),
      demographicsTitle: "Demographics",
      demographics:
        demographicsLines.length > 0
          ? demographicsLines.join("\n")
          : "No demographic data available",
      occupancyTitle: "Occupancy",
      occupancy: occupancyLines.join("\n"),
      rentalYieldTitle: "Rental Yield Trends",
      rentalYield: rentalYieldText,
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createLocationSuburbSection;
