// worker.ts (Separate process - consumes jobs)
import { Worker } from "bullmq";

const worker = new Worker(
  "property-reports",
  async (job) => {
    console.log(`Processing job ${job.id}`);

    // Do the actual work here
    // const report = await generateReport(job.data.propertyId);

    // return report; // This becomes job.returnvalue
  },
  {
    connection: { host: process.env.REDIS_HOST, port: 6379 },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});
