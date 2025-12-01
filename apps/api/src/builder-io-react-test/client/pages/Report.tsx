import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { renderAllBindings } from "@/utils/domBindingRenderer";
import type { DomBindingMapping } from "@/types/domBinding";

declare global {
  interface Window {
    __PDF_READY?: boolean;
  }
}

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAndBind() {
      try {
        // Fetch data and bindings in parallel
        const [dataRes, bindingsRes] = await Promise.all([
          fetch(`/api/report-data/${id}`),
          fetch(`/api/bindings/1`), // pdfId=1 for rental appraisal
        ]);

        if (!dataRes.ok) {
          throw new Error(`Failed to fetch report data: ${dataRes.statusText}`);
        }
        if (!bindingsRes.ok) {
          throw new Error(`Failed to fetch bindings: ${bindingsRes.statusText}`);
        }

        const data = await dataRes.json();
        const bindings: DomBindingMapping[] = await bindingsRes.json();

        // Apply bindings to DOM
        const result = renderAllBindings(bindings, data, document);
        console.log(`Applied ${result.success} bindings, ${result.failed} failed`);

        // Signal ready for PDF capture
        window.__PDF_READY = true;
        setStatus("ready");
      } catch (err) {
        console.error("Error loading report:", err);
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
        // Still signal ready so Puppeteer doesn't hang
        window.__PDF_READY = true;
      }
    }

    if (id) {
      loadAndBind();
    }
  }, [id]);

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

  return (
    <div id="report-container" className="min-h-screen bg-white">
      {/* Cover Page */}
      <div id="cover-page" className="p-8 mb-8 border-b">
        <h1 id="property-address" className="text-3xl font-bold text-gray-900 mb-2">
          {status === "loading" ? "Loading..." : ""}
        </h1>
        <p id="report-date" className="text-gray-500"></p>
      </div>

      {/* Property Information Section */}
      <div id="property-info" className="p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Information</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="property-stat">
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p id="bedroom-count" className="text-xl font-semibold"></p>
          </div>

          <div className="property-stat">
            <p className="text-sm text-gray-500">Bathrooms</p>
            <p id="bathroom-count" className="text-xl font-semibold"></p>
          </div>

          <div className="property-stat">
            <p className="text-sm text-gray-500">Year Built</p>
            <p id="year-built" className="text-xl font-semibold"></p>
          </div>

          <div className="property-stat">
            <p className="text-sm text-gray-500">Land Area</p>
            <p id="land-area" className="text-xl font-semibold"></p>
          </div>

          <div className="property-stat">
            <p className="text-sm text-gray-500">Floor Area</p>
            <p id="floor-area" className="text-xl font-semibold"></p>
          </div>

          <div className="property-stat">
            <p className="text-sm text-gray-500">Property Type</p>
            <p id="property-type" className="text-xl font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Appraisal Summary Section */}
      <div id="appraisal-summary" className="p-8 mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Rental Appraisal Summary</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Estimated Rent (Weekly)</p>
            <p id="rent-per-week" className="text-2xl font-bold text-green-600"></p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Estimated Rent (Monthly)</p>
            <p id="rent-per-month" className="text-2xl font-bold text-green-600"></p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Confidence Level</p>
            <p id="confidence" className="text-xl font-semibold"></p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <p className="text-sm text-gray-500">Notes</p>
            <p id="appraisal-notes" className="text-gray-700"></p>
          </div>
        </div>
      </div>

      {/* Estimated Value Section */}
      <div id="estimated-value-section" className="p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Estimated Property Value</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-500">Low</p>
            <p id="estimated-value-low" className="text-xl font-semibold"></p>
          </div>

          <div className="text-center p-4 bg-blue-100 rounded">
            <p className="text-sm text-gray-500">Median</p>
            <p id="estimated-value-median" className="text-xl font-bold text-blue-600"></p>
          </div>

          <div className="text-center p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-500">High</p>
            <p id="estimated-value-high" className="text-xl font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Location & Suburb Data Section */}
      <div id="location-section" className="p-8 mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Location & Suburb Data</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Distance from CBD</p>
            <p id="distance-from-cbd" className="text-xl font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Population</p>
            <p id="population" className="text-xl font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">5-Year Population Growth</p>
            <p id="population-growth" className="text-xl font-semibold"></p>
          </div>
        </div>

        {/* Occupancy Chart Data */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Occupancy Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Owner Occupied</p>
              <p id="occupancy-owner" className="text-lg font-semibold"></p>
            </div>
            <div className="text-center p-3 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Rented</p>
              <p id="occupancy-rented" className="text-lg font-semibold"></p>
            </div>
            <div className="text-center p-3 bg-white rounded shadow">
              <p className="text-sm text-gray-500">Other</p>
              <p id="occupancy-other" className="text-lg font-semibold"></p>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Schools Section */}
      <div id="schools-section" className="p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Nearby Schools</h2>
        <div id="nearby-schools-list" className="space-y-3">
          <div className="school-item flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="school-name font-medium"></span>
            <span className="school-distance text-gray-500"></span>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      <div id="similar-properties-section" className="p-8 mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Properties for Rent</h2>
        <div id="similar-properties-list" className="space-y-3">
          <div className="similar-property-item p-4 bg-white rounded shadow">
            <p className="property-address font-medium"></p>
            <p className="property-rent text-green-600 font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Planning & Zoning Section */}
      <div id="planning-section" className="p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Planning & Zoning</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Zone Code</p>
            <p id="zone-code" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Zone Description</p>
            <p id="zone-description" className="text-gray-700"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Planning Scheme</p>
            <p id="planning-scheme" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Current Land Use</p>
            <p id="land-use" className="text-lg font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Environmental Data Section */}
      <div id="environmental-section" className="p-8 mb-8 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Environmental Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Flood Risk</p>
            <p id="flood-risk" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Bushfire Risk</p>
            <p id="bushfire-risk" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Heritage Listed</p>
            <p id="heritage-listed" className="text-lg font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Infrastructure Section */}
      <div id="infrastructure-section" className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Infrastructure & Services</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Water Provider</p>
            <p id="water-provider" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Electricity Provider</p>
            <p id="electricity-provider" className="text-lg font-semibold"></p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Sewage System</p>
            <p id="sewage-system" className="text-lg font-semibold"></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id="report-footer" className="p-8 mt-8 border-t text-center text-gray-500">
        <p id="footer-text">Generated by Rental Appraisal System</p>
      </div>
    </div>
  );
}
