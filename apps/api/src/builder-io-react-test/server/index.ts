import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
// Temporarily removed - causes import of parent app code with env requirements
// import { handleGetRentalAppraisalSchema } from "./routes/schema";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint for Railway
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Schema endpoint - temporarily disabled to avoid importing parent app code
  // TODO: Copy schema locally or make this a separate microservice
  // app.get("/api/rental-appraisal-schema", handleGetRentalAppraisalSchema);

  // Proxy endpoint for report data
  app.get("/api/report", async (_req, res) => {
    try {
      const response = await fetch(
        "https://rack-main-production.up.railway.app/api/reports/placeholder"
      );

      if (!response.ok) {
        return res.status(response.status).json({
          error: `External API returned status ${response.status}`,
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      res.status(500).json({
        error: "Failed to fetch report data",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return app;
}
