import z from "zod";

export const HeritageOverlaySchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const HeritageOverlaysSchema = z.array(HeritageOverlaySchema);

export type HeritageOverlays = z.infer<typeof HeritageOverlaysSchema>;

export type HeritageOverlay = z.infer<typeof HeritageOverlaySchema>;
