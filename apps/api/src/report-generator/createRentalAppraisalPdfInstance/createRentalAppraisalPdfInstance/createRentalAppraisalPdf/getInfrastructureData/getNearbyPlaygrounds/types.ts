import { z } from "zod";
import { GooglePlaceSchema } from "../types";

export const PlaygroundSchema = GooglePlaceSchema;

export type Playground = z.infer<typeof PlaygroundSchema>;
