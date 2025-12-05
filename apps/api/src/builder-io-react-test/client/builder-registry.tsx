import { Builder } from "@builder.io/sdk-react";
import { DataBindingReference } from "./components/builder/DataBindingReference";
import { HelloWorldModal } from "./components/builder/HelloWorldModal";
import { BindableText } from "./components/builder/BindableText";
import { BindableList } from "./components/builder/BindableList";

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

// Register BindableText - A text element that can be bound to schema string/number fields
Builder.registerComponent(BindableText, {
  name: "BindableText",
  friendlyName: "Bindable Text",
  description: "A text element that can be bound to schema string/number fields. Use this to mark where dynamic text should appear.",
  inputs: [
    {
      name: "bindingId",
      type: "string",
      helperText: "Unique identifier for this binding (auto-generated if empty)",
      advanced: true,
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Bindable Text",
      helperText: "Preview text shown in the editor before data is bound",
    },
    {
      name: "defaultValue",
      type: "string",
      helperText: "Fallback value if no data is bound at render time",
    },
    {
      name: "tag",
      type: "string",
      defaultValue: "span",
      enum: ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "label"],
      helperText: "HTML tag to render",
    },
    {
      name: "className",
      type: "string",
      helperText: "CSS classes for styling",
    },
  ],
  image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F6bef27ee40d24f3b88239fd7e616f82a",
});

// Register BindableList - A container for repeating content bound to schema arrays
Builder.registerComponent(BindableList, {
  name: "BindableList",
  friendlyName: "Bindable List",
  description: "A container for repeating content bound to schema arrays. Child elements form the item template that gets repeated for each array item.",
  canHaveChildren: true,
  inputs: [
    {
      name: "bindingId",
      type: "string",
      helperText: "Unique identifier for this binding (auto-generated if empty)",
      advanced: true,
    },
    {
      name: "previewCount",
      type: "number",
      defaultValue: 3,
      helperText: "Number of items to show in preview mode",
    },
    {
      name: "tag",
      type: "string",
      defaultValue: "div",
      enum: ["div", "ul", "ol", "section"],
      helperText: "HTML tag for the container",
    },
    {
      name: "itemTag",
      type: "string",
      defaultValue: "div",
      enum: ["div", "li", "article"],
      helperText: "HTML tag for each item wrapper",
    },
    {
      name: "className",
      type: "string",
      helperText: "CSS classes for the container",
    },
    {
      name: "itemClassName",
      type: "string",
      helperText: "CSS classes for each item",
    },
  ],
  image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F6bef27ee40d24f3b88239fd7e616f82a",
});
