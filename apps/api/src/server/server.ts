// server.ts
import { Queue } from "bullmq";
import { Hono } from "hono";
import { SERVER_PORT } from "../shared/config";
import { generateFakeRentalAppraisalData } from "./generateFakeRentalAppraisalData";

const app = new Hono();

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



app.get("/api/reports/jobs/:jobId", async (c) => {
  const jobId = c.req.param("jobId");
  const job = await getReportQueue().getJob(jobId);

  if (!job) return c.json({ error: "Job not found" }, 404);

  return c.json({
    status: await job.getState(),
    progress: job.progress,
    result: job.returnvalue,
  });
});

console.log(`Starting server on port ${SERVER_PORT}...`);

export default {
  port: SERVER_PORT,
  hostname: "0.0.0.0", // Required for Docker/Railway to accept external connections
  fetch: app.fetch,
};
