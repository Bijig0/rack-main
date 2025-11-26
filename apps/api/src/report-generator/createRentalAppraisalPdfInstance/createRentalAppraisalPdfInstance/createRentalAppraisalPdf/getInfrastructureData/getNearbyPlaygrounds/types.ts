import { z } from "zod";
import { GooglePlaceSchema } from "../types";

export const PlaygroundSchema = GooglePlaceSchema;

export type Playground = z.infer<typeof PlaygroundSchema>;

export const PlaygroundsSchema = z.array(PlaygroundSchema);

export type Playgrounds = z.infer<typeof PlaygroundsSchema>;
