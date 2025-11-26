import { GoogleGenAI } from "@google/genai";
import { GOOGLE_GEMINI_API_KEY } from "../../../../../../../../../shared/config";
import { EasementFeature } from "../../../types";
import { InferredEasementDataWithoutDescription } from "../inferEasementDescription";
import { createAIEasementTaskText } from "./createAIEasementTaskText";

type Args = {
  rawEasementFeatures: EasementFeature;
  inferredEasementData: InferredEasementDataWithoutDescription;
};

type Return = {
  aiGeneratedDescription: string | undefined;
};

const apiKey = GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

const createAIGeneratedEasementDescription = async ({
  rawEasementFeatures,
  inferredEasementData,
}: Args): Promise<Return> => {
  const { taskText } = await createAIEasementTaskText({
    rawEasementFeatures,
    inferredEasementData,
  });

  const { text: aiGeneratedDescription } = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: taskText,
  });

  return { aiGeneratedDescription };
};

export default createAIGeneratedEasementDescription;
