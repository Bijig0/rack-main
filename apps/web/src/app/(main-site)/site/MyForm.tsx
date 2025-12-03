"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

// TODO: Import these from your actual schema file
// For now, creating placeholders - replace with your actual imports
const AustralianStateSchema = z.enum([
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
]);

const PostcodeSchema = z
  .string()
  .min(4, "Postcode must be 4 digits")
  .max(4, "Postcode must be 4 digits")
  .regex(/^\d{4}$/, "Postcode must be 4 digits");

// Placeholder validation functions - replace with your actual implementations
function isPostcodeValidForState(postcode: number, state: string): boolean {
  // Add your actual validation logic here
  return true;
}

function getPostcodeErrorMessage(state: string): string {
  return `Please enter a valid postcode for ${state}`;
}

export const AddressSchema = z
  .object({
    addressLine: z.string().min(1, "Address is required"),
    suburb: z.string().min(1, "Suburb is required"),
    state: AustralianStateSchema,
    postcode: PostcodeSchema,
  })
  .refine(
    (data) => {
      const postcode = parseInt(data.postcode, 10);
      return isPostcodeValidForState(postcode, data.state);
    },
    (data) => ({
      message: getPostcodeErrorMessage(data.state),
      path: ["postcode"],
    })
  );

export type Address = z.infer<typeof AddressSchema>;

interface JobStatus {
  jobId: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  progress: number;
  result?: any;
  error?: string;
}

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
  });

  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestLog, setRequestLog] = useState<string[]>([]);

  // Polling logic
  useEffect(() => {
    if (!jobStatus || jobStatus.status === "completed" || jobStatus.status === "failed") {
      return;
    }

    const pollJob = async () => {
      try {
        const response = await fetch(`/api/reports/jobs/${jobStatus.jobId}`);
        const data = await response.json();

        const logEntry = `[${new Date().toLocaleTimeString()}] Poll: ${data.status} - ${data.progress}%`;
        setRequestLog(prev => [...prev, logEntry]);

        setJobStatus(data);
      } catch (error) {
        console.error("Error polling job:", error);
        const logEntry = `[${new Date().toLocaleTimeString()}] Error polling job`;
        setRequestLog(prev => [...prev, logEntry]);
      }
    };

    // Poll every 1 second
    const intervalId = setInterval(pollJob, 1000);

    return () => clearInterval(intervalId);
  }, [jobStatus]);

  const onSubmit = async (data: Address) => {
    setIsSubmitting(true);
    setJobStatus(null);
    setRequestLog([]);

    try {
      const logEntry = `[${new Date().toLocaleTimeString()}] Submitting form...`;
      setRequestLog([logEntry]);

      const response = await fetch("/api/reports/generatePdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      const successLog = `[${new Date().toLocaleTimeString()}] Job created: ${result.jobId}`;
      setRequestLog(prev => [...prev, successLog]);

      setJobStatus({
        jobId: result.jobId,
        status: result.status,
        progress: 0,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorLog = `[${new Date().toLocaleTimeString()}] Error: ${error}`;
      setRequestLog(prev => [...prev, errorLog]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="addressLine" className="block text-sm font-medium mb-1">
          Address Line
        </label>
        <input
          id="addressLine"
          type="text"
          {...register("addressLine")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.addressLine && (
          <p className="text-red-500 text-sm mt-1">{errors.addressLine.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="suburb" className="block text-sm font-medium mb-1">
          Suburb
        </label>
        <input
          id="suburb"
          type="text"
          {...register("suburb")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.suburb && (
          <p className="text-red-500 text-sm mt-1">{errors.suburb.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium mb-1">
          State
        </label>
        <select
          id="state"
          {...register("state")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a state</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="QLD">QLD</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="TAS">TAS</option>
          <option value="NT">NT</option>
          <option value="ACT">ACT</option>
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="postcode" className="block text-sm font-medium mb-1">
          Postcode
        </label>
        <input
          id="postcode"
          type="text"
          {...register("postcode")}
          maxLength={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.postcode && (
          <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || (jobStatus?.status === "in-progress")}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Job Status Display */}
      {jobStatus && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Job Status</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Job ID:</span> {jobStatus.jobId}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  jobStatus.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : jobStatus.status === "failed"
                    ? "bg-red-200 text-red-800"
                    : jobStatus.status === "in-progress"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {jobStatus.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Progress:</span> {jobStatus.progress}%
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 transition-all duration-300 ease-out"
                style={{ width: `${jobStatus.progress}%` }}
              />
            </div>

            {jobStatus.status === "completed" && jobStatus.result && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800 mb-2">Result:</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(jobStatus.result, null, 2)}
                </pre>
              </div>
            )}

            {jobStatus.status === "failed" && jobStatus.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                <p className="text-sm text-red-600">{jobStatus.error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Log Display */}
      {requestLog.length > 0 && (
        <div className="mt-8 p-4 border border-gray-300 rounded-md bg-gray-900 text-green-400 font-mono text-sm">
          <h3 className="text-lg font-semibold mb-2 text-white">Request Log</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {requestLog.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
