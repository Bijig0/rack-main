import { NextResponse } from "next/server";

// In-memory job storage (in production, use Redis or a database)
const jobs = new Map<
  string,
  {
    id: string;
    status: "pending" | "in-progress" | "completed" | "failed";
    progress: number;
    result?: any;
    error?: string;
    data: any;
  }
>();

// Simulate PDF generation
async function simulatePdfGeneration(jobId: string, data: any) {
  const job = jobs.get(jobId);
  if (!job) return;

  try {
    // Update to in-progress
    job.status = "in-progress";
    job.progress = 0;

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      job.progress = i;
      console.log(`Job ${jobId} progress: ${i}%`);
    }

    // Complete the job
    job.status = "completed";
    job.progress = 100;
    job.result = {
      pdfUrl: `https://example.com/pdf/${jobId}.pdf`,
      generatedAt: new Date().toISOString(),
      data: data,
    };
  } catch (error) {
    job.status = "failed";
    job.error = error instanceof Error ? error.message : "Unknown error";
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate a unique job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create job record
    const job = {
      id: jobId,
      status: "pending" as const,
      progress: 0,
      data: body,
    };

    jobs.set(jobId, job);

    // Start processing in background
    simulatePdfGeneration(jobId, body);

    // Return job ID immediately
    return NextResponse.json({
      jobId,
      status: "pending",
      message: "PDF generation started",
    });
  } catch (error) {
    console.error("Error creating PDF job:", error);
    return NextResponse.json(
      { error: "Failed to create PDF generation job" },
      { status: 500 }
    );
  }
}

// Export the jobs Map so it can be accessed by the jobs endpoint
export { jobs };
