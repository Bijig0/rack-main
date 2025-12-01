import { Builder } from "@builder.io/sdk-react";
import { DataBindingReference } from "./components/builder/DataBindingReference";
import { HelloWorldModal } from "./components/builder/HelloWorldModal";

// Register the HelloWorldModal component with Builder.io
Builder.registerComponent(HelloWorldModal, {
  name: "HelloWorldModal",
  inputs: [
    {
      name: "buttonText",
      type: "string",
      defaultValue: "Open Modal",
      helperText: "Text displayed on the button that opens the modal",
    },
    {
      name: "title",
      type: "string",
      defaultValue: "Hello World!",
      helperText: "Title text shown in the modal header",
    },
    {
      name: "message",
      type: "string",
      defaultValue:
        "This is a custom Builder.io plugin showing a modal dialog.",
      helperText: "Message content displayed in the modal",
    },
    {
      name: "buttonVariant",
      type: "string",
      defaultValue: "default",
      enum: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      helperText: "Visual style variant for the trigger button",
    },
  ],
  image:
    "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
});

// Register the DataBindingReference component with Builder.io
Builder.registerComponent(DataBindingReference, {
  name: "DataBindingReference",
  inputs: [
    {
      name: "builderContent",
      type: "object",
      helperText:
        "The Builder.io content to scan for used bindings (automatically provided by Builder)",
      advanced: true,
    },
    {
      name: "hidden",
      type: "boolean",
      defaultValue: false,
      helperText: "Hide this component (useful for production builds)",
    },
    {
      name: "position",
      type: "string",
      defaultValue: "fixed",
      enum: ["fixed", "static", "relative"],
      helperText:
        "Positioning mode - 'fixed' creates a floating panel in the editor",
    },
  ],
  noWrap: true,
  image:
    "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
});
