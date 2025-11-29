import { RequestHandler } from "express";
import { RentalAppraisalDataSchema } from "../../../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";

export const handleGetRentalAppraisalSchema: RequestHandler = (_req, res) => {
  try {
    // Convert Zod schema to JSON Schema using native Zod v4 method
    const jsonSchema = RentalAppraisalDataSchema.toJSONSchema();

    res.status(200).json(jsonSchema);
  } catch (error) {
    console.error("Error converting schema to JSON:", error);
    res.status(500).json({
      error: "Failed to generate schema",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
