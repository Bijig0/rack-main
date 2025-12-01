import { z } from "zod";

/**
 * Environment variable schema for client-side configuration
 * All VITE_ prefixed variables are exposed to the client
 */
const EnvSchema = z.object({
  VITE_PUBLIC_BUILDER_KEY: z.string().optional(),
  VITE_PUBLIC_SCHEMA_FETCH_URL: z
    .string()
    .url("VITE_PUBLIC_SCHEMA_FETCH_URL must be a valid URL"),
});

type EnvConfig = z.infer<typeof EnvSchema>;

function parseEnv(): EnvConfig {
  const env = {
    VITE_PUBLIC_BUILDER_KEY: import.meta.env.VITE_PUBLIC_BUILDER_KEY,
    VITE_PUBLIC_SCHEMA_FETCH_URL: import.meta.env.VITE_PUBLIC_SCHEMA_FETCH_URL,
  };

  const result = EnvSchema.safeParse(env);

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors,
    );
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`,
    );
  }

  return result.data;
}

export const {VITE_PUBLIC_SCHEMA_FETCH_URL, VITE_PUBLIC_BUILDER_KEY} = parseEnv();
