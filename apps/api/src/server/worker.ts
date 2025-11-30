// worker.ts (Separate process - consumes jobs)
import { Worker } from "bullmq";

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

const worker = new Worker(
  "property-reports",
  async (job) => {
    console.log(`Processing job ${job.id}`);

    // Do the actual work here
    // const report = await generateReport(job.data.propertyId);

    // return report; // This becomes job.returnvalue
  },
  {
    connection: getRedisConnection(),
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed:`, err);
});
