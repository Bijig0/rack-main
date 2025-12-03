import cors from "cors";
import "dotenv/config";
import express from "express";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import type { DomBindingMapping } from "../client/types/domBinding";
import { sql } from "./db";
import { generatePdfFromUrl } from "../scripts/generatePdf";
// Temporarily removed - causes import of parent app code with env requirements
// import { handleGetRentalAppraisalSchema } from "./routes/schema";

// Initialize S3 client for Railway bucket (lazy initialization)
let s3Client: S3Client | null = null;
function getS3Client(): S3Client | null {
  if (s3Client) return s3Client;

  const accessKeyId = process.env.BUCKET_ACCESS_KEY;
  const secretAccessKey = process.env.BUCKET_SECRET_KEY;

  if (!accessKeyId || !secretAccessKey) return null;

  s3Client = new S3Client({
    endpoint: "https://storage.railway.app",
    region: "auto",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Required for S3-compatible services
  });

  return s3Client;
}

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

  // Get report data by ID (UUID) from rental_appraisal_data table
  app.get("/api/report-data/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const result = await sql`
        SELECT id, data, status, pdf_url FROM rental_appraisal_data WHERE id = ${id} LIMIT 1
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

  // Generate PDF by ID using the generatePdf module (returns PDF directly)
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
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
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

  // Generate PDF, upload to bucket, and return URL
  app.post("/api/generate-pdf/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Find the report by ID (UUID)
      const reportResult = await sql`
        SELECT id FROM rental_appraisal_data WHERE id = ${id} LIMIT 1
      `;

      if (reportResult.length === 0) {
        return res.status(404).json({ error: "Report not found" });
      }

      const reportId = reportResult[0].id;

      // Update status to processing
      await sql`
        UPDATE rental_appraisal_data
        SET status = 'processing', updated_at = NOW()
        WHERE id = ${reportId}
      `;

      // Get the actual host from the request
      const host = req.get("host") || `localhost:${process.env.PORT || 8080}`;
      const protocol = req.protocol || "http";
      const baseUrl = `${protocol}://${host}`;
      const url = `${baseUrl}/report/${id}`;

      console.log(`Generating PDF for report ${id}, navigating to ${url}`);

      const pdfBuffer = await generatePdfFromUrl(url, {
        verbose: true,
        waitForReady: true,
        format: "A4",
        printBackground: true,
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
      });

      // Upload to Railway bucket using AWS SDK
      const bucketName = "pdfs-urro8dpjdf-cxa59g-ro";
      const s3 = getS3Client();

      let pdfUrl: string;

      if (s3) {
        const filename = `reports/${reportId}-${Date.now()}.pdf`;

        try {
          await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: pdfBuffer,
            ContentType: "application/pdf",
          }));

          // Use proxy endpoint since Railway buckets are private
          pdfUrl = `${baseUrl}/api/stored-pdf/${filename}`;
          console.log(`✅ PDF uploaded to bucket, accessible at: ${pdfUrl}`);
        } catch (uploadError) {
          console.error("Bucket upload failed:", uploadError);
          // Fallback: use the on-demand PDF endpoint
          pdfUrl = `${baseUrl}/api/pdf/${id}`;
        }
      } else {
        // No bucket configured - use a local file URL or data URL for testing
        console.log("⚠️ No bucket configured. Storing PDF URL as placeholder.");
        // For testing, we'll create a URL that points back to the PDF endpoint
        pdfUrl = `${baseUrl}/api/pdf/${id}`;
      }

      // Update status to completed and store PDF URL
      await sql`
        UPDATE rental_appraisal_data
        SET status = 'completed', pdf_url = ${pdfUrl}, updated_at = NOW()
        WHERE id = ${reportId}
      `;

      console.log(`✅ PDF generated for report ${id}`);

      res.json({
        success: true,
        reportId,
        status: "completed",
        pdfUrl,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Try to update status to failed
      try {
        await sql`
          UPDATE rental_appraisal_data
          SET status = 'failed', updated_at = NOW()
          WHERE id = ${id}
        `;
      } catch {
        // Ignore update error
      }

      res.status(500).json({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Get report status and PDF URL
  app.get("/api/report-status/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const result = await sql`
        SELECT id, status, pdf_url, created_at, updated_at
        FROM rental_appraisal_data WHERE id = ${id} LIMIT 1
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Report not found" });
      }

      res.json({
        id: result[0].id,
        status: result[0].status,
        pdfUrl: result[0].pdf_url,
        createdAt: result[0].created_at,
        updatedAt: result[0].updated_at,
      });
    } catch (error) {
      console.error("Error fetching report status:", error);
      res.status(500).json({
        error: "Failed to fetch report status",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Proxy endpoint to serve PDFs from the private bucket
  // Using named wildcard to capture paths like "reports/sample-123.pdf"
  app.get("/api/stored-pdf/{*filepath}", async (req, res) => {
    // Get the filename from the wildcard part of the URL
    // In Express 5 with path-to-regexp v8, wildcard params can be arrays
    const filepathParam = (req.params as { filepath: string | string[] }).filepath;
    const filename = Array.isArray(filepathParam) ? filepathParam.join('/') : filepathParam;
    const bucketName = "pdfs-urro8dpjdf-cxa59g-ro";
    const s3 = getS3Client();

    if (!s3) {
      return res.status(500).json({ error: "Storage not configured" });
    }

    try {
      const response = await s3.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
      }));

      if (!response.Body) {
        return res.status(404).json({ error: "PDF not found" });
      }

      // Set headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${filename.split('/').pop()}"`);

      if (response.ContentLength) {
        res.setHeader("Content-Length", response.ContentLength);
      }

      // Stream the PDF to the response
      const stream = response.Body as NodeJS.ReadableStream;
      stream.pipe(res);
    } catch (error: any) {
      console.error("Error fetching PDF from bucket:", error);
      if (error.name === "NoSuchKey") {
        return res.status(404).json({ error: "PDF not found" });
      }
      res.status(500).json({
        error: "Failed to fetch PDF",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return app;
}
