import { config as dotenvConfig } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenvConfig();

// Validate environment variables using Zod
export const EnvSchema = z.object({
  GOOGLE_MAPS_API_KEY: z.string().min(1),
  GOOGLE_STREET_VIEW_API_KEY: z.string().min(1),
  FIGMA_ACCESS_TOKEN: z.string().min(1),
  FIGMA_PDF_DESIGN_FILE_URL: z.string().min(1),

  CORELOGIC_EMAIL: z.string().default("bradysuryasie@gmail.com"),
  CORELOGIC_USERNAME: z.string().default("megturism0"),
  CORELOGIC_PASSWORD: z.string().default("Mycariscclass1$"),
  CORELOGIC_URL: z.string().default("https://propertyhub.corelogic.asia/"),
});

export const {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_STREET_VIEW_API_KEY,
  FIGMA_ACCESS_TOKEN,
  FIGMA_PDF_DESIGN_FILE_URL,
  CORELOGIC_EMAIL,
  CORELOGIC_USERNAME,
  CORELOGIC_PASSWORD,
  CORELOGIC_URL
} = EnvSchema.parse(process.env);
