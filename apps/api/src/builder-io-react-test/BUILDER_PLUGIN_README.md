# Builder.io Hello World Modal Plugin

This is a custom Builder.io plugin that displays a modal dialog with customizable content.

## Files Created

- `client/components/builder/HelloWorldModal.tsx` - The React component that renders the modal
- `client/builder-registry.tsx` - Builder.io plugin registration
- `client/pages/BuilderDemo.tsx` - Demo page showing the plugin in action
- `client/App.tsx` - Updated to import the plugin registry and add the demo route

## Features

The HelloWorldModal plugin provides:
- A button that triggers a modal dialog
- Customizable button text and styling
- Customizable modal title and message
- Built using shadcn/ui components (Dialog and Button)

## Usage

### Standalone React Component

You can use the component directly in your React code:

```tsx
import { HelloWorldModal } from "@/components/builder/HelloWorldModal";

<HelloWorldModal
  buttonText="Click Me"
  title="Welcome!"
  message="This is a custom modal"
  buttonVariant="default"
/>
```

### In Builder.io Visual Editor

1. **Setup** (if not already done):
   - Add your Builder.io API key to `.env`:
     ```
     VITE_BUILDER_API_KEY=your_api_key_here
     ```

2. **Using the Plugin**:
   - Log into your Builder.io account
   - Create or edit a page
   - Find "HelloWorldModal" in the custom components section
   - Drag it onto your page
   - Customize properties in the right panel:
     - `buttonText` - Text displayed on the trigger button
     - `title` - Modal header title
     - `message` - Content message in the modal
     - `buttonVariant` - Button style (default, destructive, outline, secondary, ghost, link)

## Demo

Visit `/builder-demo` to see the plugin in action with examples showing different configurations.

## Plugin Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| buttonText | string | "Open Modal" | Text displayed on the button |
| title | string | "Hello World!" | Title shown in the modal header |
| message | string | "This is a custom Builder.io plugin..." | Message content in the modal |
| buttonVariant | enum | "default" | Button style variant |

## Technical Details

- Built with React and TypeScript
- Uses shadcn/ui Dialog and Button components
- Registered with Builder.io SDK via `Builder.registerComponent()`
- Fully type-safe with TypeScript interfaces
