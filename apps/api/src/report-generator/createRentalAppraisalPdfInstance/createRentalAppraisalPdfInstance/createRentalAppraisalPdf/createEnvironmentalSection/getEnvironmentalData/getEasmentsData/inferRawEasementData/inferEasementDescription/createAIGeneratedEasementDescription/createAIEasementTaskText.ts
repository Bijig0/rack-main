import { EasementFeature } from "../../../types";
import { InferredEasementDataWithoutDescription } from "../inferEasementDescription";

type Args = {
  rawEasementFeatures: EasementFeature;
  inferredEasementData: InferredEasementDataWithoutDescription;
};

type Return = {
  taskText: string;
};

export const createAIEasementTaskText = async ({
  rawEasementFeatures,
  inferredEasementData,
}: Args): Promise<Return> => {
  const jsonifiedRaweEasementFeatures = JSON.stringify(rawEasementFeatures);
  const jsonifiedInferredEasementData = JSON.stringify(inferredEasementData);

  const taskText = `
    You are an AI assistant helping a real estate agent to describe an easement.
    The easement is described as follows:
    ${jsonifiedRaweEasementFeatures}
    
    The easement is inferred as follows:
    ${jsonifiedInferredEasementData}
    
    Please generate a description of the easement that accurately reflects its features.
    `;

  return { taskText };
};
