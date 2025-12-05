import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { renderAllBindingsWithDetails, BindingRenderResult } from "@/utils/domBindingRenderer";
import type { DomBindingMapping } from "@/types/domBinding";
import Index from "./Index";
import { CheckCircle, XCircle, AlertCircle, Eye, ChevronDown, ChevronUp, List, FileCode } from "lucide-react";

export default function ReportPreview() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [bindingsData, setBindingsData] = useState<{ data: any; bindings: DomBindingMapping[] } | null>(null);
  const [renderResults, setRenderResults] = useState<BindingRenderResult[]>([]);
  const [highlightedBinding, setHighlightedBinding] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed">("all");

  // Fetch data and bindings
  useEffect(() => {
    async function fetchData() {
      try {
        const pdfInfoRes = await fetch('/api/pdf-info');
        if (!pdfInfoRes.ok) {
          throw new Error('Failed to fetch PDF info');
        }
        const pdfInfo = await pdfInfoRes.json();
        const pdfId = pdfInfo.id;

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
        console.error("Error loading report preview:", err);
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  // Apply bindings and show visual indicators
  useEffect(() => {
    if (!bindingsData) return;

    const applyBindings = () => {
      const result = renderAllBindingsWithDetails(bindingsData.bindings, bindingsData.data, document);
      setRenderResults(result.results);
      console.log(`Preview: Applied ${result.success} bindings, ${result.failed} failed`);

      // Apply visual borders to all bound elements
      applyVisualBorders(result.results);

      setStatus("ready");
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(applyBindings);
    });
  }, [bindingsData]);

  // Apply visual borders around bound elements
  const applyVisualBorders = useCallback((results: BindingRenderResult[]) => {
    results.forEach((result) => {
      try {
        const element = document.querySelector(result.binding.path) as HTMLElement;
        if (element) {
          element.style.outline = result.success
            ? "2px solid #22c55e" // green for success
            : "2px solid #ef4444"; // red for failure
          element.style.outlineOffset = "2px";

          // Add list container indicator
          if (result.binding.isListContainer) {
            element.style.outline = result.success
              ? "2px dashed #8b5cf6" // purple dashed for list containers
              : "2px dashed #ef4444";
          }
        }
      } catch (err) {
        console.error("Error applying border:", err);
      }
    });
  }, []);

  // Highlight a specific element when clicking on a binding in the panel
  const highlightElement = useCallback((binding: DomBindingMapping) => {
    // Clear previous highlight
    if (highlightedBinding) {
      try {
        const prevElement = document.querySelector(`[data-highlight-active="true"]`) as HTMLElement;
        if (prevElement) {
          prevElement.removeAttribute("data-highlight-active");
          prevElement.style.boxShadow = "";
          prevElement.style.zIndex = "";
        }
      } catch (err) {
        // Ignore
      }
    }

    // Apply new highlight
    try {
      const element = document.querySelector(binding.path) as HTMLElement;
      if (element) {
        element.setAttribute("data-highlight-active", "true");
        element.style.boxShadow = "0 0 0 4px #f59e0b, 0 0 20px 8px rgba(245, 158, 11, 0.5)";
        element.style.zIndex = "9999";
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedBinding(binding.id);

        // Auto-clear highlight after 3 seconds
        setTimeout(() => {
          element.removeAttribute("data-highlight-active");
          element.style.boxShadow = "";
          element.style.zIndex = "";
          setHighlightedBinding(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Error highlighting element:", err);
    }
  }, [highlightedBinding]);

  // Filter results based on status
  const filteredResults = renderResults.filter((r) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "success") return r.success;
    if (filterStatus === "failed") return !r.success;
    return true;
  });

  const successCount = renderResults.filter((r) => r.success).length;
  const failedCount = renderResults.filter((r) => !r.success).length;

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Preview</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* The actual report content - hide controls but don't disable indicators (we apply our own) */}
      <Index showControls={false} />

      {/* Floating Debug Panel */}
      <div
        className={`fixed top-4 left-4 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] transition-all duration-200 ${
          isPanelCollapsed ? "w-auto" : "w-[400px] max-h-[80vh]"
        }`}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg cursor-pointer"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-sm">DOM Binding Preview</span>
          </div>
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <span className="text-xs text-gray-500">Loading...</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  {successCount}
                </span>
                <span className="flex items-center gap-1 text-xs text-red-600">
                  <XCircle className="w-3 h-3" />
                  {failedCount}
                </span>
              </div>
            )}
            {isPanelCollapsed ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Panel Content */}
        {!isPanelCollapsed && (
          <div className="flex flex-col max-h-[calc(80vh-48px)]">
            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 px-2 pt-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
                  filterStatus === "all"
                    ? "bg-purple-100 text-purple-700 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All ({renderResults.length})
              </button>
              <button
                onClick={() => setFilterStatus("success")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
                  filterStatus === "success"
                    ? "bg-green-100 text-green-700 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Success ({successCount})
              </button>
              <button
                onClick={() => setFilterStatus("failed")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
                  filterStatus === "failed"
                    ? "bg-red-100 text-red-700 border-b-2 border-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Failed ({failedCount})
              </button>
            </div>

            {/* Legend */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-green-500 rounded-sm"></div>
                <span className="text-gray-600">Success</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-red-500 rounded-sm"></div>
                <span className="text-gray-600">Failed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-dashed border-purple-500 rounded-sm"></div>
                <span className="text-gray-600">List</span>
              </div>
            </div>

            {/* Bindings List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {status === "loading" ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Loading bindings...
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {renderResults.length === 0
                    ? "No bindings configured"
                    : "No bindings match filter"}
                </div>
              ) : (
                filteredResults.map((result) => (
                  <div
                    key={result.binding.id}
                    onClick={() => highlightElement(result.binding)}
                    className={`p-2 rounded border cursor-pointer transition-all hover:shadow-md ${
                      highlightedBinding === result.binding.id
                        ? "ring-2 ring-amber-400 bg-amber-50"
                        : result.success
                        ? "bg-green-50 border-green-200 hover:bg-green-100"
                        : "bg-red-50 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Status Icon */}
                      <div className="mt-0.5">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>

                      {/* Binding Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          {result.binding.isListContainer && (
                            <List className="w-3 h-3 text-purple-600" />
                          )}
                          {result.binding.multiFieldBindings && (
                            <FileCode className="w-3 h-3 text-blue-600" />
                          )}
                          <span className="font-mono text-xs font-medium text-gray-900 truncate">
                            {result.binding.dataBinding}
                          </span>
                        </div>

                        {/* CSS Selector */}
                        <div className="text-[10px] text-gray-500 font-mono truncate mb-1">
                          {result.binding.path}
                        </div>

                        {/* Rendered Value or Error */}
                        {result.success && result.renderedValue && (
                          <div className="text-xs text-gray-600 truncate bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {result.renderedValue}
                          </div>
                        )}
                        {!result.success && result.error && (
                          <div className="text-xs text-red-600 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{result.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              Click on a binding to highlight its element
            </div>
          </div>
        )}
      </div>
    </>
  );
}
