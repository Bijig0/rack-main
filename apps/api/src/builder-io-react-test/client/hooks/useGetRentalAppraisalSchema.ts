import { useQuery } from "@tanstack/react-query";

// JSON Schema type definition
export interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  nullable?: boolean;
  [key: string]: any;
}

async function fetchRentalAppraisalSchema(): Promise<JsonSchema> {
  const response = await fetch("/api/rental-appraisal-schema");

  if (!response.ok) {
    throw new Error(`Failed to fetch rental appraisal schema: ${response.status}`);
  }

  return response.json();
}

export function useGetRentalAppraisalSchema() {
  return useQuery({
    queryKey: ["rentalAppraisalSchema"],
    queryFn: fetchRentalAppraisalSchema,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
