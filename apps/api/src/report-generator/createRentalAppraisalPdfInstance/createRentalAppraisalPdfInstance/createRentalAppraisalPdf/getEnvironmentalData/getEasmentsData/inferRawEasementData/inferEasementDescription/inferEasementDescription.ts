import { EasementFeature, InferredEasementData } from "../../types";
import createAIGeneratedEasementDescription from "./createAIGeneratedEasementDescription/createAIGeneratedEasementDescription";
import createDefaultEasementDescription from "./createDefaultEasementDescription";

export type InferredEasementDataWithoutDescription = Omit<
  InferredEasementData,
  "description"
>;

type Args = {
  rawEasementFeatures: EasementFeature;
  inferredEasementData: InferredEasementDataWithoutDescription;
};

type Return = {
  description: string;
};

const inferEasementDescription = async ({
  rawEasementFeatures,
  inferredEasementData,
}: Args): Promise<Return> => {
  let aiGeneratedDescription: string | undefined;

  try {
    const result = await createAIGeneratedEasementDescription({
      rawEasementFeatures,
      inferredEasementData,
    });
    aiGeneratedDescription = result.aiGeneratedDescription;
  } catch (error) {
    // Silently fall back to default description if AI fails
    console.warn('⚠️  AI description generation failed, using default:', error instanceof Error ? error.message : 'Unknown error');
  }

  const { defaultDescription } = createDefaultEasementDescription({
    inferredEasementData,
  });

  const description = aiGeneratedDescription || defaultDescription;

  return { description };
};

export default inferEasementDescription;
