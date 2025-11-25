import z from "zod";

type Args = {
  rawStatus: string;
};

type Return = {
  inferredStatusText: string;
};

const rawStatusTextSchema = z.union([z.literal("A"), z.literal("I")]);

const rawStatusToInferredStatusText = {
  A: "Active (Registered)",
  I: "Inactive / Historic",
};

const inferStatusText = ({ rawStatus }: Args): Return => {
  const status = rawStatus.toUpperCase();
  const parsedStatus = rawStatusTextSchema.parse(status);
  const inferredStatusText =
    rawStatusToInferredStatusText[parsedStatus] ?? "Unknown";
  return { inferredStatusText };
};

export default inferStatusText;
