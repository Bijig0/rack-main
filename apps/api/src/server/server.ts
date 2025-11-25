// server.ts
import { Queue } from "bullmq";
import { Hono } from "hono";
import { SERVER_PORT } from "../shared/config";
import { generateFakeRentalAppraisalData } from "./generateFakeRentalAppraisalData";

const app = new Hono();

const reportQueue = new Queue("property-reports", {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
});

app.post("/api/reports/placeholder", async (c) => {
  const placeholderRentalAppraisalData = generateFakeRentalAppraisalData();
  return c.json(placeholderRentalAppraisalData);
});

app.get("/api/reports/:jobId", async (c) => {
  const jobId = c.req.param("jobId");
  const job = await reportQueue.getJob(jobId);

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
