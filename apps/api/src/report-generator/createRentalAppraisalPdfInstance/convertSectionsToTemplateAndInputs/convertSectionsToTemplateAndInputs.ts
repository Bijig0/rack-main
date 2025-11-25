import { Inputs, Sections, Template } from "../../types";
import { createBlankPdf } from "../createBlankPdf";

type Args = {
  sections: Sections;
};

type Return = Promise<{
  template: Template;
  inputs: Inputs;
}>;

/**
 * Converts an array of sections into a single template and inputs object for pdfme.
 *
 * Each section contains its own template (with schemas and basePdf) and inputs.
 * This function merges all sections into a single template with combined schemas
 * and a single inputs array.
 *
 * @param sections - Array of Section objects, each containing template and inputs
 * @returns Object with merged template and inputs for pdfme generate function
 */
const convertSectionsToTemplateAndInputs = async ({
  sections,
}: Args): Return => {
  // Combine schemas from all sections
  // Each section.template.schemas is an array containing one inner array (one page)
  // We need to flatten these into a single array of page schemas
  const combinedSchemas: Template["schemas"] = [];
  const mergedInput: Record<string, any> = {};

  for (const section of sections) {
    // Each section has schemas: [[fields...]] and inputs: [{data...}]
    // Push each page schema
    if (section.template.schemas && Array.isArray(section.template.schemas)) {
      combinedSchemas.push(...section.template.schemas);
    }

    // Merge all input data into a single object
    // Each input object contains field data for one page
    if (section.inputs && Array.isArray(section.inputs)) {
      for (const inputObj of section.inputs) {
        Object.assign(mergedInput, inputObj);
      }
    }
  }

  console.log({ mergedInput });

  // Create a blank PDF with one page per schema
  const basePdf = await createBlankPdf(combinedSchemas.length);

  const template: Template = {
    schemas: combinedSchemas,
    basePdf,
  };

  // pdfme expects inputs as an array where each element creates one complete document
  // Since we want ONE document with 7 pages, we provide ONE input object
  return {
    template,
    inputs: [mergedInput],
  };
};

export default convertSectionsToTemplateAndInputs;
