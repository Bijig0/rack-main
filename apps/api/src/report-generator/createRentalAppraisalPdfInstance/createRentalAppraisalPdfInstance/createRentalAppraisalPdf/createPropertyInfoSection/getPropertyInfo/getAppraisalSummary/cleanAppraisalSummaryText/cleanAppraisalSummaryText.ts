import { AppraisalSummary, AppraisalSummarySchema } from "../types";

type Return = {
  cleanedAppraisalSummary: AppraisalSummary;
};

type Args = {
  appraisalSummaryText: string | null;
};

/**
 * Cleans appraisal summary text by trimming and validating.
 */
export function cleanAppraisalSummaryText({ appraisalSummaryText }: Args): Return {
  if (!appraisalSummaryText) return { cleanedAppraisalSummary: null };

  const cleaned = appraisalSummaryText.trim();

  if (cleaned.length === 0) return { cleanedAppraisalSummary: null };

  const cleanedAppraisalSummary = AppraisalSummarySchema.parse(cleaned);
  return { cleanedAppraisalSummary };
}
