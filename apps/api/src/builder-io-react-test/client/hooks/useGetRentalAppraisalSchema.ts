import { VITE_PUBLIC_SCHEMA_FETCH_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { sampleRentalAppraisalSchema } from "./sampleRentalAppraisalSchema";

export const JsonSchemaSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),

      properties: z
        .record(
          z.string(),
          z.lazy(() => JsonSchemaSchema),
        )
        .optional(),

      items: z.lazy(() => JsonSchemaSchema).optional(),

      required: z.array(z.string()).optional(),

      nullable: z.boolean().optional(),
    })
    .catchall(z.any()),
);

export type JsonSchema = z.infer<typeof JsonSchemaSchema>;

const isDevelopment = import.meta.env.DEV;

async function fetchRentalAppraisalSchema(): Promise<JsonSchema> {
  // Use the server-side proxy to avoid CORS issues
  // The proxy reads SCHEMA_FETCH_URL from server environment
  const response = await fetch(VITE_PUBLIC_SCHEMA_FETCH_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rental appraisal schema: ${response.status}`,
    );
  }

  const json = await response.json();

  console.log({ json });

  return json;
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
