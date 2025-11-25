import { config as dotenvConfig } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenvConfig();

// Validate environment variables using Zod
export const EnvSchema = z.object({
  GOOGLE_MAPS_API_KEY: z.string().optional().default(""),
  GOOGLE_STREET_VIEW_API_KEY: z.string().optional().default(""),
  FIGMA_ACCESS_TOKEN: z.string().optional().default(""),
  FIGMA_PDF_DESIGN_FILE_URL: z.string().optional().default(""),

  CORELOGIC_EMAIL: z.string().default("bradysuryasie@gmail.com"),
  CORELOGIC_USERNAME: z.string().default("megturism0"),
  CORELOGIC_PASSWORD: z.string().default("Mycariscclass1$"),
  CORELOGIC_URL: z.string().default("https://propertyhub.corelogic.asia/"),

  // Railway uses PORT, locally we use SERVER_PORT
  PORT: z.string().optional(),
  SERVER_PORT: z.string().default("3000"),
});

const env = EnvSchema.parse(process.env);

export const {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_STREET_VIEW_API_KEY,
  FIGMA_ACCESS_TOKEN,
  FIGMA_PDF_DESIGN_FILE_URL,
  CORELOGIC_EMAIL,
  CORELOGIC_USERNAME,
  CORELOGIC_PASSWORD,
  CORELOGIC_URL,
} = env;

// Railway injects PORT, fallback to SERVER_PORT for local dev
export const SERVER_PORT = env.PORT || env.SERVER_PORT;
