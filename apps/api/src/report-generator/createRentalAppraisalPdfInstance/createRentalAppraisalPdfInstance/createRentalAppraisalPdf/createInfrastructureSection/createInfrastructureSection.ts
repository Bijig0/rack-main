import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getInfrastructureData from "./getInfrastructureData/getInfrastructureData";

type Args = {
  address: Address;
};

const createInfrastructureSection = async ({
  address,
}: Args): Promise<Section | null> => {
  // Fetch infrastructure data
  const { infrastructureData } = await getInfrastructureData({ address });

  // Return null if no infrastructure data available
  if (!infrastructureData) {
    return null;
  }

  const infrastructure = infrastructureData;
  const template = {
    schemas: [
      [
        {
          name: "infrastructureTitle",
          type: "text",
          position: { x: 20, y: 20 },
          width: 170,
          height: 10,
          fontSize: 18,
          fontColor: "#1a1a1a",
          fontName: "Roboto",
        },
        {
          name: "infrastructureSubtitle",
          type: "text",
          position: { x: 20, y: 35 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontColor: "#333333",
          fontName: "Roboto",
        },
        {
          name: "utilitiesTitle",
          type: "text",
          position: { x: 20, y: 50 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "utilities",
          type: "text",
          position: { x: 20, y: 62 },
          width: 170,
          height: 30,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
        {
          name: "amenitiesTitle",
          type: "text",
          position: { x: 20, y: 100 },
          width: 170,
          height: 8,
          fontSize: 12,
          fontName: "Roboto",
        },
        {
          name: "amenities",
          type: "text",
          position: { x: 20, y: 112 },
          width: 170,
          height: 60,
          fontSize: 10,
          lineHeight: 1.5,
          fontName: "Roboto",
        },
      ],
    ],
    basePdf: "",
  };

  const utilitiesLines = [];
  if (infrastructure.sewer !== undefined) {
    utilitiesLines.push(
      `Sewer: ${infrastructure.sewer ? "Connected" : "Not Connected"}`
    );
  }
  if (infrastructure.water !== undefined) {
    utilitiesLines.push(
      `Water: ${infrastructure.water ? "Connected" : "Not Connected"}`
    );
  }
  if (infrastructure.stormwater !== undefined) {
    utilitiesLines.push(
      `Stormwater: ${infrastructure.stormwater ? "Connected" : "Not Connected"}`
    );
  }
  if (infrastructure.electricity !== undefined) {
    utilitiesLines.push(
      `Electricity: ${
        infrastructure.electricity ? "Connected" : "Not Connected"
      }`
    );
  }

  const amenitiesLines = [];
  if (infrastructure.publicTransport) {
    const distance = infrastructure.publicTransport.distance
      ? ` (${infrastructure.publicTransport.distance} km)`
      : "";
    amenitiesLines.push(
      `Public Transport: ${
        infrastructure.publicTransport.available ? "Available" : "Not Available"
      }${distance}`
    );
  }
  if (infrastructure.shoppingCenter) {
    const distance = infrastructure.shoppingCenter.distance
      ? ` (${infrastructure.shoppingCenter.distance} km)`
      : "";
    amenitiesLines.push(
      `Shopping Center: ${
        infrastructure.shoppingCenter.available ? "Available" : "Not Available"
      }${distance}`
    );
  }
  if (infrastructure.parkAndPlayground) {
    const distance = infrastructure.parkAndPlayground.distance
      ? ` (${infrastructure.parkAndPlayground.distance} km)`
      : "";
    amenitiesLines.push(
      `Parks & Playgrounds: ${
        infrastructure.parkAndPlayground.available
          ? "Available"
          : "Not Available"
      }${distance}`
    );
  }
  if (infrastructure.emergencyServices) {
    const distance = infrastructure.emergencyServices.distance
      ? ` (${infrastructure.emergencyServices.distance} km)`
      : "";
    amenitiesLines.push(
      `Emergency Services: ${
        infrastructure.emergencyServices.available
          ? "Available"
          : "Not Available"
      }${distance}`
    );
  }

  const inputs = [
    {
      infrastructureTitle: "Infrastructure Considerations",
      infrastructureSubtitle: "Available utilities and nearby amenities",
      utilitiesTitle: "Utilities",
      utilities:
        utilitiesLines.length > 0
          ? utilitiesLines.join("\n")
          : "No utility information available",
      amenitiesTitle: "Nearby Amenities",
      amenities:
        amenitiesLines.length > 0
          ? amenitiesLines.join("\n")
          : "No amenity information available",
    },
  ];

  return {
    template,
    inputs,
  };
};

export default createInfrastructureSection;
