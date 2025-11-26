import { z } from "zod";

export const AppraisalSummarySchema = z.string().min(1);

export type AppraisalSummary = z.infer<typeof AppraisalSummarySchema> | null;
