import cors from "cors";
import "dotenv/config";
import express from "express";
import type { DomBindingMapping } from "../client/types/domBinding";
import { sql } from "./db";
import { generatePdfFromUrl } from "../scripts/generatePdf";
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

  // Proxy endpoint for report data (legacy)
  app.get("/api/report", async (_req, res) => {
    try {
      const response = await fetch(
        "https://rack-main-production.up.railway.app/api/reports/placeholder",
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
      const data =
        typeof result[0].data === "string"
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
          conditionalStyles:
            properties.conditionalStyles as DomBindingMapping["conditionalStyles"],
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

  // Save DOM bindings (bulk replace for a PDF)
  app.post("/api/bindings/:pdfId", async (req, res) => {
    try {
      const pdfId = parseInt(req.params.pdfId, 10);
      if (isNaN(pdfId)) {
        return res.status(400).json({ error: "Invalid PDF ID" });
      }

      const bindings: DomBindingMapping[] = req.body;
      if (!Array.isArray(bindings)) {
        return res.status(400).json({ error: "Request body must be an array of bindings" });
      }

      // Delete existing bindings for this PDF
      await sql`DELETE FROM dom_bindings WHERE pdf_id = ${pdfId}`;

      // Insert new bindings
      for (const binding of bindings) {
        const properties = {
          dataType: binding.dataType,
          isListContainer: binding.isListContainer,
          listItemPattern: binding.listItemPattern,
          conditionalStyles: binding.conditionalStyles,
        };

        await sql`
          INSERT INTO dom_bindings (pdf_id, path, state_binding, properties, created_at, updated_at)
          VALUES (${pdfId}, ${binding.path}, ${binding.dataBinding}, ${JSON.stringify(properties)}::jsonb, NOW(), NOW())
        `;
      }

      console.log(`✅ Saved ${bindings.length} bindings for PDF ${pdfId}`);
      res.json({ success: true, count: bindings.length });
    } catch (error) {
      console.error("Error saving bindings:", error);
      res.status(500).json({
        error: "Failed to save bindings",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Delete a single DOM binding by ID
  app.delete("/api/bindings/item/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid binding ID" });
      }

      const result = await sql`
        DELETE FROM dom_bindings WHERE id = ${id} RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Binding not found" });
      }

      console.log(`✅ Deleted binding ${id}`);
      res.json({ success: true, deletedId: id });
    } catch (error) {
      console.error("Error deleting binding:", error);
      res.status(500).json({
        error: "Failed to delete binding",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get the current PDF ID for rental appraisal (helper endpoint)
  app.get("/api/pdf-info", async (_req, res) => {
    try {
      const result = await sql`
        SELECT id, name FROM pdf WHERE name = 'rental appraisal' LIMIT 1
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "PDF not found" });
      }

      res.json({ id: result[0].id, name: result[0].name });
    } catch (error) {
      console.error("Error fetching PDF info:", error);
      res.status(500).json({
        error: "Failed to fetch PDF info",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Generate PDF by ID using the generatePdf module
  app.get("/api/pdf/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Get the actual host from the request (handles dynamic port)
      const host = req.get("host") || `localhost:${process.env.PORT || 8080}`;
      const protocol = req.protocol || "http";
      const baseUrl = `${protocol}://${host}`;
      const url = `${baseUrl}/report/${id}`;

      console.log(`Generating PDF for report ${id}, navigating to ${url}`);

      const pdf = await generatePdfFromUrl(url, {
        verbose: true,
        waitForReady: true,
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-${id}.pdf`,
      );
      res.send(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return app;
}
