import z from "zod";

/**
 * Property image
 */
export const PropertyImageSchema = z
  .object({
    url: z.string().url("Must be a valid URL"),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })
  .or(z.string().url("Must be a valid URL"))
  .transform((val) =>
    typeof val === "string" ? { url: val, isPrimary: true } : val
  )
  .nullish()
  .describe("Property image URL or image object");

export type PropertyImage = z.infer<typeof PropertyImageSchema>;
