// server.ts
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
// Note: desc, eq from drizzle-orm available when switching from sample data to real DB queries
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { zodToJsonSchema } from "zod-to-json-schema";
import { auth } from "../auth/auth";
import { createRentalAppraisalRecord } from "../db/createRentalAppraisalRecord";
// Note: db from drizzle available when switching from sample data to real DB queries
// Note: property, appraisal schemas available for real DB queries
import { RentalAppraisalDataSchema } from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";
import { PDF_BASE_URL, SERVER_BASE_URL, SERVER_PORT } from "../shared/config";
import { AddressSchema } from "../shared/types";
import { generateFakeRentalAppraisalData } from "./generateFakeRentalAppraisalData";
import type { Session } from "../auth/auth";

// Type for auth context variables
type AuthVariables = {
  session: Session["session"];
  user: Session["user"];
};

const app = new Hono<{ Variables: AuthVariables }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:8080", "http://localhost:8000"],
    credentials: true,
  })
);

// Internal API key validation middleware for /api/* routes
const validateInternalApiKey = createMiddleware(async (c, next) => {
  const apiKey = c.req.header("X-Internal-Api-Key");
  const expectedKey = process.env.INTERNAL_API_KEY;

  // Skip validation if no key is configured (development mode)
  if (!expectedKey) {
    console.warn("[SERVER] INTERNAL_API_KEY not configured - skipping auth");
    return next();
  }

  if (apiKey !== expectedKey) {
    console.warn(
      "[SERVER] Invalid or missing API key from:",
      c.req.header("X-Forwarded-For") || "unknown"
    );
    return c.json({ error: "Unauthorized" }, 401);
  }

  return next();
});

// Apply API key validation to all /api/* routes
app.use("/api/*", validateInternalApiKey);

// Health check endpoint (public, before /api/* middleware)
app.get("/health", (c) => c.json({ status: "ok" }));

// BetterAuth handler - handles all /api/auth/* routes
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Auth session middleware for protected routes
const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized - Please sign in" }, 401);
  }

  // Attach session to context for use in route handlers
  c.set("session", session.session);
  c.set("user", session.user);

  return next();
});

// Helper to parse Redis connection from environment
function getRedisConnection() {
  // Railway provides REDIS_URL, parse it if available
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    // Parse redis://user:pass@host:port format
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || "6379"),
      ...(url.password && { password: url.password }),
    };
  }

  // Local development using individual env vars
  return {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  };
}

// Lazy-initialize queue only when needed
let reportQueue: Queue | null = null;
function getReportQueue() {
  if (!reportQueue) {
    reportQueue = new Queue("property-reports", {
      connection: getRedisConnection(),
    });
  }
  return reportQueue;
}

// Also support GET for placeholder (must come before :jobId)
app.get("/api/reports/placeholder", async (c) => {
  const placeholderRentalAppraisalData = generateFakeRentalAppraisalData();
  return c.json(placeholderRentalAppraisalData);
});

app.get("/api/reports/schema", async (c) => {
  const jsonSchema = zodToJsonSchema(RentalAppraisalDataSchema);
  return c.json(jsonSchema);
});

// Sample data generator for properties (matches Drizzle schema)
const generateSampleProperties = () => {
  const now = new Date().toISOString();
  return [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      addressCommonName: "42 Wallaby Way, Sydney NSW 2000",
      bedroomCount: 4,
      bathroomCount: 2,
      propertyType: "House",
      landAreaSqm: "650",
      propertyImageUrl: null,
      createdAt: now,
      updatedAt: now,
      latestAppraisal: {
        id: "660e8400-e29b-41d4-a716-446655440001",
        status: "completed",
        pdfUrl: "https://example.com/reports/sample-report-1.pdf",
        createdAt: now,
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      addressCommonName: "15 Collins Street, Melbourne VIC 3000",
      bedroomCount: 3,
      bathroomCount: 2,
      propertyType: "Apartment",
      landAreaSqm: null,
      propertyImageUrl: null,
      createdAt: now,
      updatedAt: now,
      latestAppraisal: {
        id: "660e8400-e29b-41d4-a716-446655440002",
        status: "pending",
        pdfUrl: null,
        createdAt: now,
      },
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      addressCommonName: "88 Queen Street, Brisbane QLD 4000",
      bedroomCount: 5,
      bathroomCount: 3,
      propertyType: "House",
      landAreaSqm: "820",
      propertyImageUrl: null,
      createdAt: now,
      updatedAt: now,
      latestAppraisal: null,
    },
  ];
};

// Sample appraisal data generator (matches Drizzle schema)
const generateSampleAppraisals = (propertyId: string) => {
  const now = new Date().toISOString();
  const fakeReportData = generateFakeRentalAppraisalData();

  return [
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      propertyId,
      data: fakeReportData,
      status: "completed",
      pdfUrl: "https://example.com/reports/sample-report-1.pdf",
      createdAt: now,
      updatedAt: now,
    },
  ];
};

// GET endpoint to list all properties with their latest appraisal status (protected)
app.get("/api/properties", requireAuth, async (c) => {
  // Return sample data matching Drizzle schema
  const sampleProperties = generateSampleProperties();
  // User info available via c.get("user") if needed
  return c.json({ properties: sampleProperties });
});

// GET endpoint to fetch a single property with its appraisals (protected)
app.get("/api/properties/:id", requireAuth, async (c) => {
  const propertyId = c.req.param("id");
  const sampleProperties = generateSampleProperties();

  // Find the property by ID or return the first one as fallback
  const foundProperty = sampleProperties.find(p => p.id === propertyId) || sampleProperties[0];

  // Generate sample appraisals for this property
  const sampleAppraisals = foundProperty.latestAppraisal
    ? generateSampleAppraisals(foundProperty.id)
    : [];

  return c.json({
    property: {
      id: foundProperty.id,
      addressCommonName: foundProperty.addressCommonName,
      bedroomCount: foundProperty.bedroomCount,
      bathroomCount: foundProperty.bathroomCount,
      propertyType: foundProperty.propertyType,
      landAreaSqm: foundProperty.landAreaSqm,
      propertyImageUrl: foundProperty.propertyImageUrl,
      createdAt: foundProperty.createdAt,
      updatedAt: foundProperty.updatedAt,
    },
    appraisals: sampleAppraisals,
  });
});

// POST endpoint to generate a PDF report (protected)
app.post("/api/reports/generatePdf", requireAuth, async (c) => {
  try {
    const body = await c.req.json();

    // Validate and convert request body to Address object using AddressSchema
    const addressValidation = AddressSchema.safeParse(body);

    if (!addressValidation.success) {
      return c.json(
        {
          error: "Invalid address data",
          details: addressValidation.error.errors,
        },
        400
      );
    }

    const address = addressValidation.data;

    // Create a worker job and pass the address to getRentalAppraisalData
    const job = await getReportQueue().add("generate-rental-appraisal", {
      address,
    });

    console.log(`[SERVER] Created job ${job.id} for address:`, address);
    console.log(
      `[SERVER] Job added to queue - waiting for worker to process...`
    );

    const statusUrl = `${SERVER_BASE_URL}/api/reports/jobs/${job.id}`;

    // Return the job url
    return c.json({
      jobId: job.id,
      statusUrl,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return c.json(
      {
        error: "Failed to create job",
        message: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// GET endpoint to check job status (protected)
app.get("/api/reports/jobs/:jobId", requireAuth, async (c) => {
  const jobId = c.req.param("jobId");
  const job = await getReportQueue().getJob(jobId);

  if (!job) return c.json({ error: "Job not found" }, 404);

  const status = await job.getState();

  // On happy path complete
  if (status === "completed" && job.returnvalue) {
    try {
      // Check if we've already created a record for this job
      let id = job.data.id;

      if (!id) {
        // First time - create a unique id
        id = randomUUID();

        // Insert the rental appraisal data into the database
        await createRentalAppraisalRecord({
          id,
          data: job.returnvalue,
        });

        console.log(`Created rental appraisal record with id: ${id}`);

        // Update the job data to store the id for subsequent polls
        await job.updateData({
          ...job.data,
          id,
        });
      }

      // Craft the generateAPIUrl
      const pdfBaseUrl =
        PDF_BASE_URL || "https://builder-io-react-production.up.railway.app";
      const generateAPIUrl = `${pdfBaseUrl}/api/pdf/${id}`;

      return c.json({
        status: "success",
        generateAPIUrl,
        progress: job.progress,
      });
    } catch (error) {
      console.error("Error creating rental appraisal record:", error);
      return c.json(
        {
          error: "Failed to create rental appraisal record",
          message: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }

  // For other statuses, return the status and progress
  return c.json({
    status,
    progress: job.progress,
    result: status === "completed" ? job.returnvalue : undefined,
  });
});

console.log(`Starting server on port ${SERVER_PORT}...`);

export default {
  port: SERVER_PORT,
  hostname: "0.0.0.0", // Required for Docker/Railway to accept external connections
  fetch: app.fetch,
};
