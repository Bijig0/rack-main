// server.ts
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createRentalAppraisalRecord } from "../db/createRentalAppraisalRecord";
import { RentalAppraisalDataSchema } from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";
import { PDF_BASE_URL, SERVER_BASE_URL, SERVER_PORT } from "../shared/config";
import { AddressSchema } from "../shared/types";
import { generateFakeRentalAppraisalData } from "./generateFakeRentalAppraisalData";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:8080", "http://localhost:8000"],
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

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

// POST endpoint to generate a PDF report
app.post("/api/reports/generatePdf", async (c) => {
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
    console.log(`[SERVER] Job added to queue - waiting for worker to process...`);

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

app.get("/api/reports/jobs/:jobId", async (c) => {
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

        console.log(
          `Created rental appraisal record with id: ${id}`
        );

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
