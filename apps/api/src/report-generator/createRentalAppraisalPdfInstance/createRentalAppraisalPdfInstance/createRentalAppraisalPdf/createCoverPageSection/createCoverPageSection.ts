import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getCoverPageData from "./getCoverPageData/getCoverPageData";

type Args = {
  address: Address;
};

const createCoverPageSection = async ({ address }: Args): Promise<Section> => {
  // Fetch cover page data (includes executive summary)
  const { coverPageData } = await getCoverPageData({ address });

  const formattedDate = coverPageData.reportDate.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const logoYOffset = coverPageData.companyLogo ? 30 : 0;

  const schemaArray: any[] = [
    {
      name: "title",
      type: "text",
      position: { x: 20, y: 20 },
      width: 170,
      height: 15,
      fontSize: 24,
      fontColor: "#1a1a1a",
      alignment: "center",
      fontName: "Roboto",
    },
    {
      name: "address",
      type: "text",
      position: { x: 20, y: 40 },
      width: 170,
      height: 12,
      fontSize: 16,
      fontColor: "#333333",
      alignment: "center",
      fontName: "Roboto",
    },
    {
      name: "reportDate",
      type: "text",
      position: { x: 20, y: 58 },
      width: 170,
      height: 8,
      fontSize: 11,
      fontColor: "#666666",
      alignment: "center",
      fontName: "Roboto",
    },
    {
      name: "reportId",
      type: "text",
      position: { x: 20, y: 68 },
      width: 170,
      height: 8,
      fontSize: 10,
      fontColor: "#999999",
      alignment: "center",
      fontName: "Roboto",
    },
  ];

  if (coverPageData.companyLogo) {
    schemaArray.push({
      name: "logo",
      type: "image",
      position: { x: 75, y: 80 },
      width: 60,
      height: 30,
    });
  }

  // Add Executive Summary section on same page
  schemaArray.push(
    {
      name: "executiveSummaryTitle",
      type: "text",
      position: { x: 20, y: 90 + logoYOffset },
      width: 170,
      height: 10,
      fontSize: 16,
      fontColor: "#1a1a1a",
      fontName: "Roboto",
    },
    {
      name: "propertyType",
      type: "text",
      position: { x: 20, y: 105 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "council",
      type: "text",
      position: { x: 20, y: 115 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "yearBuilt",
      type: "text",
      position: { x: 20, y: 125 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "landArea",
      type: "text",
      position: { x: 20, y: 135 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "floorArea",
      type: "text",
      position: { x: 20, y: 145 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "distanceToCBD",
      type: "text",
      position: { x: 110, y: 105 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    },
    {
      name: "estimatedValue",
      type: "text",
      position: { x: 110, y: 115 + logoYOffset },
      width: 80,
      height: 8,
      fontSize: 11,
      fontName: "Roboto",
    }
  );

  const template = {
    schemas: [schemaArray],
    basePdf: "",
  };

  const estimatedValueText = coverPageData.estimatedValueRange
    ? `Estimated Value: $${coverPageData.estimatedValueRange.min.toLocaleString()} - $${coverPageData.estimatedValueRange.max.toLocaleString()}`
    : "Estimated Value: N/A";

  const inputs = [
    {
      title: "Property Report",
      address: coverPageData.addressCommonName,
      reportDate: `Report Date: ${formattedDate}`,
      reportId: `Report ID: ${coverPageData.reportId}`,
      ...(coverPageData.companyLogo && { logo: coverPageData.companyLogo }),
      // Executive Summary data
      executiveSummaryTitle: "Executive Summary",
      propertyType: `Property Type: ${
        coverPageData.propertyType.charAt(0).toUpperCase() +
        coverPageData.propertyType.slice(1)
      }`,
      council: `Council: ${coverPageData.council}`,
      yearBuilt: coverPageData.yearBuilt
        ? `Year Built: ${coverPageData.yearBuilt}`
        : "Year Built: N/A",
      landArea: coverPageData.landArea
        ? `Land Area: ${coverPageData.landArea} sqm`
        : "Land Area: N/A",
      floorArea: coverPageData.floorArea
        ? `Floor Area: ${coverPageData.floorArea} sqm`
        : "Floor Area: N/A",
      distanceToCBD: coverPageData.distanceToCBD
        ? `Distance to CBD: ${coverPageData.distanceToCBD} km`
        : "Distance to CBD: N/A",
      estimatedValue: estimatedValueText,
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createCoverPageSection;
