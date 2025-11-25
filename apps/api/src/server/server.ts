// server.ts
import { Queue } from "bullmq";
import { Hono } from "hono";
import { SERVER_PORT } from "../shared/config";
import { generateFakeRentalAppraisalData } from "./generateFakeRentalAppraisalData";

const app = new Hono();

// Lazy-initialize queue only when needed
let reportQueue: Queue | null = null;
function getReportQueue() {
  if (!reportQueue) {
    reportQueue = new Queue("property-reports", {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: 6379,
      },
    });
  }
  return reportQueue;
}

app.post("/api/reports/placeholder", async (c) => {
  const placeholderRentalAppraisalData = generateFakeRentalAppraisalData();
  return c.json(placeholderRentalAppraisalData);
});

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

export default {
  port: SERVER_PORT,
  fetch: app.fetch,
};
