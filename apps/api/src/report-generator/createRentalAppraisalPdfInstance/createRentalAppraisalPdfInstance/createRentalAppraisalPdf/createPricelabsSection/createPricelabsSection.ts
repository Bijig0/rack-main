import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getPricelabsData from "./getPricelabsData/getPricelabsData";

type Args = {
  address: Address;
};

const createPricelabsSection = async ({
  address,
}: Args): Promise<Section | null> => {
  // Fetch Pricelabs data
  const { pricelabsData } = await getPricelabsData({ address });

  // Return null if no Pricelabs data available
  if (!pricelabsData) {
    return null;
  }

  const estimate = pricelabsData;
  const template = {
    schemas: [
      [
        {
          name: "pricelabsTitle",
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        {
          name: "pricelabsSubtitle",
          type: "text",
          position: { x: 20, y: 35 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Roboto",
        },
        {
          name: "ratesTitle",
          type: "text",
          position: { x: 20, y: 50 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "rates",
          type: "text",
          position: { x: 20, y: 62 },
          width: 85,
          height: 40,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "revenueTitle",
          type: "text",
          position: { x: 20, y: 110 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "revenue",
          type: "text",
          position: { x: 20, y: 122 },
          width: 85,
          height: 30,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "note",
          type: "text",
          position: { x: 20, y: 160 },
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

  const ratesLines = [];
  if (estimate.dailyRate) {
    ratesLines.push(`Daily Rate: $${estimate.dailyRate.toFixed(2)}`);
  }
  if (estimate.weeklyRate) {
    ratesLines.push(`Weekly Rate: $${estimate.weeklyRate.toFixed(2)}`);
  }
  if (estimate.monthlyRate) {
    ratesLines.push(`Monthly Rate: $${estimate.monthlyRate.toFixed(2)}`);
  }

  const revenueLines = [];
  if (estimate.annualRevenue) {
    revenueLines.push(
      `Estimated Annual Revenue: $${estimate.annualRevenue.toLocaleString()}`
    );
  }
  if (estimate.occupancyRate !== undefined) {
    revenueLines.push(`Expected Occupancy Rate: ${estimate.occupancyRate}%`);
  }

  const inputs = [
    {
      pricelabsTitle: "Pricelabs Rental Estimate",
      pricelabsSubtitle: "Short-term rental revenue projections",
      ratesTitle: "Recommended Pricing",
      rates:
        ratesLines.length > 0
          ? ratesLines.join("\n")
          : "No rate data available",
      revenueTitle: "Revenue Projections",
      revenue:
        revenueLines.length > 0
          ? revenueLines.join("\n")
          : "No revenue data available",
      note: "Note: Estimates are based on Pricelabs analysis and local market conditions. Actual results may vary based on property presentation, amenities, and market demand.",
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createPricelabsSection;
