import z from "zod";

export const ShoppingMallSchema = z.object({
  name: z.string(),
  place_id: z.string(),
  address: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type ShoppingMall = z.infer<typeof ShoppingMallSchema>;
