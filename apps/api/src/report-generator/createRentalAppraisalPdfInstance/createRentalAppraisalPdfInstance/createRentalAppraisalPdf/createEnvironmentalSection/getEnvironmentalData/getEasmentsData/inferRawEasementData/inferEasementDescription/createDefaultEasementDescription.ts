import { InferredEasementDataWithoutDescription } from "./inferEasementDescription";

type Args = {
  inferredEasementData: InferredEasementDataWithoutDescription;
};

type Return = {
  defaultDescription: string;
};

const createDefaultEasementDescription = ({
  inferredEasementData,
}: Args): Return => {
  const { status, type, measurement, dataset } = inferredEasementData;

  const description =
    `A ${status} ${type}${measurement}. Dataset name: ${dataset.name}` as const;

  return { defaultDescription: description };
};

export default createDefaultEasementDescription;
