import { Address } from "../../../../../shared/types";
import { Section } from "../../../../types";
import getPropertyInfo from "./getPropertyInfo/getPropertyInfo";

type Args = {
  address: Address;
};

type Return = {
  section: Section;
};

const createPropertyInfoSection = async ({
  address,
}: Args): Promise<Return> => {
  // Fetch property info data
  const { propertyInfo } = await getPropertyInfo({ address });

  const schemaArray: any[] = [
    {
      name: "propertyInfoTitle",
      type: "text",
      position: { x: 20, y: 20 },
      width: 170,
      height: 10,
      fontSize: 18,
      fontColor: "#1a1a1a",
      fontName: "Roboto",
    },
    {
      name: "propertyInfoSubtitle",
      type: "text",
      position: { x: 20, y: 35 },
      width: 170,
      height: 8,
      fontSize: 12,
      fontColor: "#333333",
      fontName: "Roboto",
    },
    {
      name: "propertyDetails",
      type: "text",
      position: { x: 20, y: 50 },
      width: 170,
      height: 60,
      fontSize: 10,
      lineHeight: 1.5,
      fontName: "Roboto",
    },
  ];

  const template = {
    schemas: [schemaArray],
    basePdf: "",
  };

  const inputsObj: any = {
    propertyInfoTitle: "Property Information",
    propertyInfoSubtitle:
      "Detailed property characteristics and specifications",
    propertyDetails: `Property type is ${propertyInfo.propertyType}`,
  };

  const inputs = [inputsObj];

  return {
    section: {
      template,
      inputs,
    },
  };
};

if (import.meta.main) {
  const { propertyInfo } = await getPropertyInfo({
    address: {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log({ propertyInfo });
}

export default createPropertyInfoSection;
