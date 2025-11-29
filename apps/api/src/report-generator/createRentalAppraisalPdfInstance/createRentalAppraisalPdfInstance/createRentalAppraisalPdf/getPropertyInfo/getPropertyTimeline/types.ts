import { z } from "zod";

const PropertyOccurenceType = z.union([
  z.literal("sold"),
  z.literal("leased"),
  z.literal("rented"),
]);

export const PropertyTimelineElementSchema = z.object({
  occurenceType: PropertyOccurenceType,
  price: z.number(),
  occurenceDate: z.date(),
  occurenceBroker: z.string().nullable(),
});

export type PropertyTimelineElement = z.infer<
  typeof PropertyTimelineElementSchema
>;

export const PropertyTimelineSchema = z.array(PropertyTimelineElementSchema).nullish();

export type PropertyTimeline = z.infer<typeof PropertyTimelineSchema>;
