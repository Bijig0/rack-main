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
  const { aiGeneratedDescription } = await createAIGeneratedEasementDescription(
    {
      rawEasementFeatures,
      inferredEasementData,
    }
  );

  const { defaultDescription } = createDefaultEasementDescription({
    inferredEasementData,
  });

  const description = aiGeneratedDescription || defaultDescription;

  return { description };
};

export default inferEasementDescription;
