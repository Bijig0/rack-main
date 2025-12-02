import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { renderAllBindings } from "@/utils/domBindingRenderer";
import type { DomBindingMapping } from "@/types/domBinding";
import Index from "./Index";

declare global {
  interface Window {
    __PDF_READY?: boolean;
  }
}

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [bindingsData, setBindingsData] = useState<{ data: any; bindings: DomBindingMapping[] } | null>(null);

  // Fetch data and bindings
  useEffect(() => {
    async function fetchData() {
      try {
        // First get the PDF ID dynamically
        const pdfInfoRes = await fetch('/api/pdf-info');
        if (!pdfInfoRes.ok) {
          throw new Error('Failed to fetch PDF info');
        }
        const pdfInfo = await pdfInfoRes.json();
        const pdfId = pdfInfo.id;

        // Fetch data and bindings in parallel
        const [dataRes, bindingsRes] = await Promise.all([
          fetch(`/api/report-data/${id}`),
          fetch(`/api/bindings/${pdfId}`),
        ]);

        if (!dataRes.ok) {
          throw new Error(`Failed to fetch report data: ${dataRes.statusText}`);
        }
        if (!bindingsRes.ok) {
          throw new Error(`Failed to fetch bindings: ${bindingsRes.statusText}`);
        }

        const data = await dataRes.json();
        const bindings: DomBindingMapping[] = await bindingsRes.json();

        setBindingsData({ data, bindings });
      } catch (err) {
        console.error("Error loading report:", err);
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
        window.__PDF_READY = true;
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  // Apply bindings after Index component has rendered
  useEffect(() => {
    if (!bindingsData) return;

    // Use requestAnimationFrame to ensure DOM is painted
    const applyBindings = () => {
      const result = renderAllBindings(bindingsData.bindings, bindingsData.data, document);
      console.log(`Applied ${result.success} bindings, ${result.failed} failed`);

      // Signal ready for PDF capture
      window.__PDF_READY = true;
      setStatus("ready");
    };

    // Wait for next frame to ensure Index has rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(applyBindings);
    });
  }, [bindingsData]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Report</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render the Index component (Builder.io content) without controls, and apply DOM bindings on top
  return <Index showControls={false} />;
}
