import { z } from "zod";

// Australian State/Territory schema
export const AustralianStateSchema = z.enum([
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
]);

export type AustralianState = z.infer<typeof AustralianStateSchema>;

// Postcode ranges for each state/territory
const POSTCODE_RANGES: Record<AustralianState, Array<[number, number]>> = {
  ACT: [
    [200, 299],
    [2600, 2639],
  ],
  NSW: [
    [1000, 1999],
    [2000, 2599],
    [2640, 2914],
  ],
  NT: [
    [800, 899],
    [900, 999],
  ],
  QLD: [
    [4000, 4999],
    [9000, 9999],
  ],
  SA: [[5000, 5999]],
  TAS: [
    [7000, 7499],
    [7800, 7999],
  ],
  VIC: [
    [3000, 3999],
    [8000, 8999],
  ],
  WA: [[6800, 6999]],
};

// Helper function to check if postcode is valid for a given state
const isPostcodeValidForState = (
  postcode: number,
  state: AustralianState
): boolean => {
  return POSTCODE_RANGES[state].some(
    ([min, max]) => postcode >= min && postcode <= max
  );
};

// Helper function to generate a readable error message
const getPostcodeErrorMessage = (state: AustralianState): string => {
  const ranges = POSTCODE_RANGES[state]
    .map(([min, max]) => `${String(min).padStart(4, "0")}-${max}`)
    .join(", ");
  return `Postcode must be in valid ${state} ranges: ${ranges}`;
};

// Standalone Postcode schema with regex validation
export const PostcodeSchema = z
  .string()
  .regex(
    /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/,
    "Postcode must be a valid 4-digit Australian postcode"
  );

// Address schema with state-specific postcode validation
export const AddressSchema = z
  .object({
    addressLine: z.string().min(1, "Address is required"),
    suburb: z.string().min(1, "Suburb is required"),
    state: AustralianStateSchema,
    postcode: PostcodeSchema,
  })
  .refine(
    (data) => {
      const postcode = parseInt(data.postcode, 10);
      return isPostcodeValidForState(postcode, data.state);
    },
    (data) => ({
      message: getPostcodeErrorMessage(data.state),
      path: ["postcode"],
    })
  );

export type Address = z.infer<typeof AddressSchema>;
