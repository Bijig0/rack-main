/**
 * Example component demonstrating how to use DOM bindings
 * This shows a complete workflow from configuration to rendering
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataBindingReference } from "./DataBindingReference";
import { DomBindingMapping } from "@/types/domBinding";
import { renderAllBindings } from "@/utils/domBindingRenderer";

// Sample data matching the rental appraisal schema
const sampleData = {
  state: {
    propertyInfo: {
      yearBuilt: { value: 1985, source: "Council records" },
      bedroomCount: { value: 3, source: "Property listing" },
      bathroomCount: { value: 2, source: "Property listing" },
      nearbySchools: [
        { name: "Sunrise Primary", type: "Primary", distance: 0.5, rating: 4.5 },
        { name: "Valley High School", type: "Secondary", distance: 1.2, rating: 4.2 },
        { name: "Green Park College", type: "College", distance: 2.0, rating: 4.8 },
      ],
    },
    environmentalData: {
      easementsData: [
        { type: "drainage", beneficiary: "City Council", width: 2.5 },
        { type: "utility", beneficiary: "Power Company", width: 1.0 },
      ],
    },
  },
};

export const DomBindingExample = () => {
  const [bindings, setBindings] = useState<DomBindingMapping[]>([]);
  const [rendered, setRendered] = useState(false);

  const handleRender = () => {
    const container = document.getElementById("pdf-preview");
    if (container) {
      const result = renderAllBindings(bindings, sampleData, container);
      console.log(`Rendered ${result.success} bindings, ${result.failed} failed`);
      setRendered(true);
    }
  };

  const handleLoadExample = () => {
    // Example bindings configuration
    const exampleBindings: DomBindingMapping[] = [
      {
        id: "1",
        path: "#year-built",
        dataBinding: "state.propertyInfo.yearBuilt.value",
        dataType: "number",
      },
      {
        id: "2",
        path: "#bedrooms",
        dataBinding: "state.propertyInfo.bedroomCount.value",
        dataType: "number",
      },
      {
        id: "3",
        path: "#schools-container",
        dataBinding: "state.propertyInfo.nearbySchools",
        dataType: "array",
        isListContainer: true,
        listItemPattern: ".school-item",
      },
      {
        id: "4",
        path: "#easements-container",
        dataBinding: "state.environmentalData.easementsData",
        dataType: "array",
        isListContainer: true,
        listItemPattern: ".easement-card",
        conditionalStyles: [
          {
            dependsOn: "state.environmentalData.easementsData[0].type",
            conditions: [
              {
                value: "drainage",
                operator: "equals",
                cssProperties: {
                  backgroundColor: "#e3f2fd",
                  borderLeft: "4px solid #2196f3",
                },
              },
              {
                value: "utility",
                operator: "equals",
                cssProperties: {
                  backgroundColor: "#fff3e0",
                  borderLeft: "4px solid #ff9800",
                },
              },
            ],
          },
        ],
      },
    ];

    setBindings(exampleBindings);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: PDF Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>PDF Preview</CardTitle>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleRender} size="sm">
                  Render Data
                </Button>
                <Button onClick={handleLoadExample} variant="outline" size="sm">
                  Load Example Bindings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                id="pdf-preview"
                className="bg-white p-6 rounded border min-h-[600px]"
              >
                <h1 className="text-2xl font-bold mb-4">Property Report</h1>

                <div className="space-y-4">
                  {/* Simple bindings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Year Built</div>
                      <div
                        id="year-built"
                        className="text-lg font-semibold"
                      >
                        [Not bound yet]
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                      <div id="bedrooms" className="text-lg font-semibold">
                        [Not bound yet]
                      </div>
                    </div>
                  </div>

                  {/* Schools list */}
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Nearby Schools
                    </h2>
                    <div id="schools-container" className="space-y-2">
                      <div className="school-item border rounded p-3 bg-gray-50">
                        <div className="font-medium">[School Name]</div>
                        <div className="text-sm text-gray-600">
                          [Type] • [Distance]km
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Easements with conditional styling */}
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Easements</h2>
                    <div id="easements-container" className="space-y-2">
                      <div className="easement-card border rounded p-3 transition-all">
                        <div className="font-medium">[Type]</div>
                        <div className="text-sm text-gray-600">
                          Beneficiary: [Beneficiary]
                        </div>
                        <div className="text-sm text-gray-600">
                          Width: [Width]m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Data Binding Panel */}
        <div>
          <DataBindingReference
            builderContent={null}
            hidden={false}
            position="static"
          />

          {/* Instructions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Click "Edit Mode" in the Data Binding Reference panel above
                </li>
                <li>
                  Hover over any data binding and click "Bind" to map it to a
                  DOM element
                </li>
                <li>
                  Click on a highlighted element in the PDF Preview to select
                  it
                </li>
                <li>
                  For arrays, select both the container and a child template
                  element
                </li>
                <li>
                  Use the edit icon in "DOM Bindings" tab to add conditional
                  styling
                </li>
                <li>Click "Render Data" to see the results</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <strong>Quick Start:</strong> Click "Load Example Bindings"
                then "Render Data" to see a pre-configured example!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
