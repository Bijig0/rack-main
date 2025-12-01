import "dotenv/config";
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import { handleDemo } from "./routes/demo";
import { sql } from "./db";
import type { DomBindingMapping } from "../client/types/domBinding";
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

  // Proxy endpoint for report data (legacy)
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

  // Get report data by ID from rental_appraisal_data table
  app.get("/api/report-data/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const result = await sql`
        SELECT data FROM rental_appraisal_data WHERE id = ${id} LIMIT 1
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Report data not found" });
      }

      // The data column is jsonb, postgres driver returns it parsed
      // But if it was inserted as a string, parse it
      const data = typeof result[0].data === 'string'
        ? JSON.parse(result[0].data)
        : result[0].data;
      res.json(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      res.status(500).json({
        error: "Failed to fetch report data",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get DOM bindings by PDF ID
  app.get("/api/bindings/:pdfId", async (req, res) => {
    try {
      const pdfId = parseInt(req.params.pdfId, 10);
      if (isNaN(pdfId)) {
        return res.status(400).json({ error: "Invalid PDF ID" });
      }

      const result = await sql`
        SELECT id, path, state_binding, properties
        FROM dom_bindings
        WHERE pdf_id = ${pdfId}
      `;

      // Transform to DomBindingMapping format
      const bindings: DomBindingMapping[] = result.map((row) => {
        const properties = (row.properties || {}) as Record<string, unknown>;
        return {
          id: String(row.id),
          path: row.path as string,
          dataBinding: row.state_binding as string,
          dataType: (properties.dataType as string) || "string",
          isListContainer: properties.isListContainer as boolean | undefined,
          listItemPattern: properties.listItemPattern as string | undefined,
          conditionalStyles: properties.conditionalStyles as DomBindingMapping["conditionalStyles"],
        };
      });

      res.json(bindings);
    } catch (error) {
      console.error("Error fetching bindings:", error);
      res.status(500).json({
        error: "Failed to fetch bindings",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Generate PDF by ID using Puppeteer
  app.get("/api/pdf/:id", async (req, res) => {
    const id = req.params.id;
    let browser = null;

    try {
      // Get the actual host from the request (handles dynamic port)
      const host = req.get('host') || `localhost:${process.env.PORT || 8080}`;
      const protocol = req.protocol || 'http';
      const baseUrl = `${protocol}://${host}`;

      console.log(`Generating PDF for report ${id}, navigating to ${baseUrl}/report/${id}`);

      // Launch Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 800 });

      // Log console messages from the page for debugging
      page.on('console', msg => console.log('Page console:', msg.text()));
      page.on('pageerror', error => console.log('Page error:', error.message));

      // Navigate to the React report page
      await page.goto(`${baseUrl}/report/${id}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Wait for React + binding injection to complete
      await page.waitForFunction(
        () => (window as unknown as { __PDF_READY?: boolean }).__PDF_READY === true,
        { timeout: 30000 }
      );

      // Generate PDF
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
      });

      await browser.close();
      browser = null;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-${id}.pdf`
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (browser) {
        await browser.close();
      }
      res.status(500).json({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return app;
}
