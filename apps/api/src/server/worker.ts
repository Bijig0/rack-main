// worker.ts (Separate process - consumes jobs)
import { Worker } from "bullmq";
import getRentalAppraisalData from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/getRentalAppraisalData";
import { Address } from "../shared/types";

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
    console.log(`[WORKER] Processing job ${job.id} for address:`, job.data.address);

    try {
      const address = job.data.address as Address;

      // Update progress
      await job.updateProgress(10);
      console.log(`[WORKER] Job ${job.id}: Starting data fetch...`);

      // Fetch the rental appraisal data
      await job.updateProgress(50);
      const { rentalAppraisalData } = await getRentalAppraisalData({ address });

      await job.updateProgress(90);
      console.log(`[WORKER] Job ${job.id}: Successfully fetched rental appraisal data`);

      // Return the data - this becomes job.returnvalue
      await job.updateProgress(100);
      return rentalAppraisalData;
    } catch (error) {
      console.error(`[WORKER] Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: getRedisConnection(),
  }
);

worker.on("completed", (job) => {
  console.log(`[WORKER] ✓ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`[WORKER] ✗ Job ${job?.id} failed:`, err.message);
});

worker.on("active", (job) => {
  console.log(`[WORKER] → Job ${job.id} is now active`);
});

worker.on("progress", (job, progress) => {
  console.log(`[WORKER] ⋯ Job ${job.id} progress: ${progress}%`);
});

console.log("[WORKER] Worker started and listening for jobs...");
console.log(`[WORKER] Connected to Redis: ${JSON.stringify(getRedisConnection())}`);
