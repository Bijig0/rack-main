import { EnvSchema } from "../../../../../../../../shared/config";

export const fillTestEnv = async () => {
  // Create a test object with empty strings for all keys
  const testEnv: Record<string, string> = {};

  for (const key of Object.keys(EnvSchema.shape)) {
    testEnv[key] = "";
  }

  // Parse with Zod - this will apply defaults automatically
  const parsedEnv = EnvSchema.parse(testEnv);

  // Set process.env with the parsed values (which include defaults)
  for (const [key, value] of Object.entries(parsedEnv)) {
    console.log(`Setting ${key} to ${value}`);
    process.env[key] = String(value);
  }
};
