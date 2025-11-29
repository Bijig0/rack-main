import { Content } from "@builder.io/sdk-react";
import { HelloWorldModal } from "@/components/builder/HelloWorldModal";
import { DataBindingReference } from "@/components/builder/DataBindingReference";
import "../builder-registry";

// You'll need to set your Builder.io API key in your .env file
// VITE_BUILDER_API_KEY=your_api_key_here
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY || "demo";

export default function BuilderDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Builder.io Plugin Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the custom HelloWorldModal plugin for Builder.io.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Standalone Component Demo
            </h2>
            <p className="text-blue-700 mb-4">
              Here's the component working directly in React:
            </p>
            <div className="flex gap-4 flex-wrap">
              <HelloWorldModal />
              <HelloWorldModal
                buttonText="Custom Button"
                title="Custom Title"
                message="This modal has custom properties!"
                buttonVariant="secondary"
              />
              <HelloWorldModal
                buttonText="Click Me!"
                title="Amazing!"
                message="You can customize all the text and button styles."
                buttonVariant="outline"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-900 mb-3">
              How to Use in Builder.io
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-green-800">
              <li>Log into your Builder.io account</li>
              <li>Create or edit a page</li>
              <li>Look for "HelloWorldModal" in the custom components section</li>
              <li>Drag it onto your page</li>
              <li>Customize the properties in the right panel:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>buttonText - Text on the trigger button</li>
                  <li>title - Modal header title</li>
                  <li>message - Modal content message</li>
                  <li>buttonVariant - Button style (default, outline, etc.)</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">
              Data Binding Reference Component
            </h2>
            <p className="text-purple-700 mb-4">
              The DataBindingReference component helps designers see all available data bindings from the RentalAppraisalData schema:
            </p>
            <ul className="list-disc list-inside space-y-2 text-purple-800 mb-4">
              <li>Shows all available bindings in the schema</li>
              <li>Highlights which bindings are currently used in your content</li>
              <li>Searchable and filterable for easy navigation</li>
              <li>Displays as a floating panel in the Builder.io editor</li>
            </ul>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Example Usage in Builder.io:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Drag the "DataBindingReference" component onto your page</li>
                <li>It will appear as a floating panel (usually bottom-right)</li>
                <li>Search for bindings or filter to show only used ones</li>
                <li>Copy binding paths like <code className="bg-gray-100 px-1 rounded text-xs">{"{{state.propertyInfo.yearBuilt}}"}</code></li>
                <li>Set <code className="bg-gray-100 px-1 rounded text-xs">hidden=true</code> before publishing to production</li>
              </ol>
            </div>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This component is meant for the design phase. Make sure to hide it in production by setting the <code className="bg-yellow-100 px-1 rounded">hidden</code> prop to <code className="bg-yellow-100 px-1 rounded">true</code>.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Setup Instructions
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                To connect to Builder.io, add your API key to <code className="bg-gray-200 px-2 py-1 rounded">.env</code>:
              </p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                VITE_BUILDER_API_KEY=your_api_key_here
              </pre>
              <p className="text-sm text-gray-500 mt-4">
                The plugin is registered in <code className="bg-gray-200 px-1 rounded">client/builder-registry.tsx</code>
              </p>
            </div>
          </div>
        </div>

        {/* Builder.io Content Area */}
        {BUILDER_API_KEY && BUILDER_API_KEY !== "demo" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Builder.io Content
            </h2>
            <Content
              apiKey={BUILDER_API_KEY}
              model="page"
            />
          </div>
        )}
      </div>
    </div>
  );
}
