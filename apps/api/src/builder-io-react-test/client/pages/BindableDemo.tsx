import { useState } from "react";
import { BindableText } from "@/components/builder/BindableText";
import { BindableList } from "@/components/builder/BindableList";
import { SchemaFirstSelector } from "@/components/builder/SchemaFirstSelector";
import { DomBindingMapping } from "@/types/domBinding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Save } from "lucide-react";
import { useFetchDomBindings, useSaveDomBindings } from "@/hooks/useDomBindingsApi";

/**
 * Demo page showcasing the BindableText and BindableList components
 * with schema-first binding workflow.
 *
 * This demonstrates:
 * 1. BindableText - for binding string/number fields
 * 2. BindableList - for binding array fields with repeating templates
 * 3. SchemaFirstSelector - for schema → element binding workflow
 */
export default function BindableDemo() {
  // Fetch existing bindings from database
  const { data: savedBindings = [], isLoading } = useFetchDomBindings();
  const saveMutation = useSaveDomBindings();

  // Local bindings state
  const [bindings, setBindings] = useState<DomBindingMapping[]>([]);
  const [showPanel, setShowPanel] = useState(true);

  // Sync with saved bindings when loaded
  useState(() => {
    if (savedBindings.length > 0) {
      setBindings(savedBindings);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(bindings, {
      onSuccess: () => {
        console.log("Bindings saved successfully");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Bindable Components Demo</h1>
          <p className="text-sm text-gray-500">
            Schema-first binding with BindableText and BindableList
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPanel(!showPanel)}
          >
            {showPanel ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showPanel ? "Hide Panel" : "Show Panel"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-1" />
            {saveMutation.isPending ? "Saving..." : "Save Bindings"}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main content area - simulated PDF template */}
        <div className="flex-1 p-8">
          <div className="max-w-[210mm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Cover Page Section */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-12">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                  <BindableText
                    bindingId="cover-title"
                    placeholder="Property Report Title"
                    tag="span"
                    className="block"
                  />
                </h1>
                <div className="text-xl opacity-90">
                  <BindableText
                    bindingId="cover-address"
                    placeholder="123 Example Street, Suburb VIC 3000"
                    tag="span"
                  />
                </div>
                <div className="mt-4 text-sm opacity-75">
                  <BindableText
                    bindingId="cover-date"
                    placeholder="Report Date: January 2025"
                    tag="span"
                  />
                </div>
              </div>
            </div>

            {/* Property Info Section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Information</h2>

              <div className="grid grid-cols-2 gap-6">
                {/* Year Built */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Year Built</div>
                  <div className="text-xl font-semibold">
                    <BindableText
                      bindingId="property-year-built"
                      placeholder="1985"
                      tag="span"
                    />
                  </div>
                </div>

                {/* Land Area */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Land Area</div>
                  <div className="text-xl font-semibold">
                    <BindableText
                      bindingId="property-land-area"
                      placeholder="650 m²"
                      tag="span"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Bedrooms</div>
                  <div className="text-xl font-semibold">
                    <BindableText
                      bindingId="property-bedrooms"
                      placeholder="4"
                      tag="span"
                    />
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Bathrooms</div>
                  <div className="text-xl font-semibold">
                    <BindableText
                      bindingId="property-bathrooms"
                      placeholder="2"
                      tag="span"
                    />
                  </div>
                </div>

                {/* Estimated Value */}
                <div className="bg-blue-50 p-4 rounded-lg col-span-2">
                  <div className="text-sm text-blue-600 mb-1">Estimated Value</div>
                  <div className="text-2xl font-bold text-blue-800">
                    <BindableText
                      bindingId="property-estimated-value"
                      placeholder="$850,000 - $950,000"
                      tag="span"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Schools Section - demonstrates BindableList */}
            <div className="p-8 bg-gray-50">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Schools</h2>

              <BindableList
                bindingId="nearby-schools"
                previewCount={3}
                className="space-y-3"
                itemClassName="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                {/* This is the item template - will be repeated for each school */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold">
                      <BindableText
                        bindingId="school-name"
                        placeholder="Example School Name"
                        tag="span"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <BindableText
                        bindingId="school-type"
                        placeholder="Primary School"
                        tag="span"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    <BindableText
                      bindingId="school-distance"
                      placeholder="1.2 km"
                      tag="span"
                    />
                  </div>
                </div>
              </BindableList>
            </div>

            {/* Environmental Data Section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Environmental Assessment</h2>

              <div className="space-y-4">
                {/* Bushfire Risk */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                      🔥
                    </div>
                    <span className="font-medium">Bushfire Risk</span>
                  </div>
                  <div>
                    <BindableText
                      bindingId="env-bushfire-risk"
                      placeholder="Low Risk"
                      tag="span"
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Flood Risk */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      🌊
                    </div>
                    <span className="font-medium">Flood Risk</span>
                  </div>
                  <div>
                    <BindableText
                      bindingId="env-flood-risk"
                      placeholder="Not in Flood Zone"
                      tag="span"
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schema First Selector Panel */}
        {showPanel && (
          <div className="w-[400px] bg-white border-l shadow-lg">
            <SchemaFirstSelector
              bindings={bindings}
              onBindingsChange={setBindings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
