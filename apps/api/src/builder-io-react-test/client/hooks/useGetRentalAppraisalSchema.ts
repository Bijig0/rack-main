import { useQuery } from "@tanstack/react-query";
import { sampleRentalAppraisalSchema } from "./sampleRentalAppraisalSchema";

// JSON Schema type definition
export interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  nullable?: boolean;
  [key: string]: any;
}

const isDevelopment = import.meta.env.DEV;

async function fetchRentalAppraisalSchema(): Promise<JsonSchema> {
  const response = await fetch("/api/rental-appraisal-schema");

  if (!response.ok) {
    throw new Error(`Failed to fetch rental appraisal schema: ${response.status}`);
  }

  return response.json();
}

export function useGetRentalAppraisalSchema() {
  const query = useQuery({
    queryKey: ["rentalAppraisalSchema"],
    queryFn: fetchRentalAppraisalSchema,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // In development mode, if there's an error, return the sample schema
  if (isDevelopment && query.error) {
    return {
      ...query,
      data: sampleRentalAppraisalSchema,
      error: query.error, // Keep the error so we can show the message
    };
  }

  return query;
}
