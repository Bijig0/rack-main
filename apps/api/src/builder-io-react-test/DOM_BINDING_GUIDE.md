# DOM Binding Feature Guide

This comprehensive guide explains how to use the visual DOM binding system in the Data Binding Reference panel to map data from your RentalAppraisalData schema to HTML elements in your PDF templates.

## Overview

The DOM binding feature allows you to:
- **Visually select** HTML elements on your page and bind them to data fields
- **Type-aware filtering** - only compatible element types are selectable based on data type
- **Visual indicators** - see which elements are bound with hover tooltips
- **Array/list binding** - map arrays to container elements with item templates
- **Conditional styling** - apply CSS styles based on data values
- **Export/import** - save and share your binding configurations

## How It Works

### 1. Enable Edit Mode

Click the "Edit Mode" button in the Data Binding Reference panel. This switches the panel into edit mode where you can:
- See all available data bindings from your schema
- Map bindings to DOM elements
- Manage existing DOM bindings

### 2. Bind Data to DOM Elements

#### For Simple Types (string, number, boolean)

1. In the "Reference" tab, hover over a data binding (e.g., `state.propertyInfo.yearBuilt.value`)
2. Click the "Bind" button that appears
3. The DOM Element Selector overlay will appear
4. Compatible elements will be highlighted in blue (grayed-out elements are incompatible)
5. Click on any highlighted element to bind it
6. The binding will be saved and appear in the "DOM Bindings" tab

#### For Array/List Types

1. Hover over an array binding (e.g., `state.propertyInfo.nearbySchools`)
2. Click "Bind"
3. **Step 1: Select Container** - Click on the container element (e.g., a `<div>` or `<ul>`)
4. **Step 2: Select Child** - Within that container, click on a child element that represents a single item
5. Both paths are saved together

### 3. Conditional Styling

You can define CSS rules that change based on other data values:

1. Go to the "DOM Bindings" tab
2. Click the edit icon (pencil) on any binding
3. In the Conditional Style Editor:
   - Click "Add Conditional Style Rule"
   - Select which data binding this style depends on (e.g., `state.environmentalData.easementsData[0].type`)
   - Add conditions with operators (equals, greater than, etc.)
   - For each condition, specify CSS properties to apply
   - Example: If `easements.status` equals "active", set `backgroundColor` to "green"

### 4. Export/Import Bindings

- **Export**: Click the download icon to save your bindings as JSON
- **Import**: Click the upload icon to load previously saved bindings

## Type Compatibility

The system automatically determines which DOM elements are compatible with each data type:

| Data Type | Compatible Elements |
|-----------|-------------------|
| `string` | text, textarea, input, span, p, div, h1-h6 |
| `number` | text, input, span, p, div |
| `boolean` | checkbox, switch, span, div |
| `array` | div, ul, ol, section |
| `object` | div, section |

## Data Structure

Each DOM binding is stored as:

```typescript
{
  id: string;                      // Unique identifier
  path: string;                    // CSS selector to DOM element
  dataBinding: string;             // Data path (e.g., "state.propertyInfo.yearBuilt.value")
  dataType: string;                // Type from schema
  isListContainer?: boolean;       // True for array bindings
  listItemPattern?: string;        // Path to child element for arrays
  conditionalStyles?: [            // Optional styling rules
    {
      dependsOn: string;           // Data path to watch
      conditions: [
        {
          value: any;              // Value to compare
          operator: string;        // Comparison operator
          cssProperties: {         // CSS to apply when true
            backgroundColor: "red"
          }
        }
      ]
    }
  ]
}
```

## Usage for PDF Generation

When generating PDFs, use the DOM bindings like this:

```typescript
// Import the bindings
const bindings: DomBindingMapping[] = [...];

// For each binding
bindings.forEach(binding => {
  const element = document.querySelector(binding.path);

  if (binding.isListContainer) {
    // Handle list rendering
    const containerElement = document.querySelector(binding.path);
    const itemTemplate = document.querySelector(binding.listItemPattern);
    // Repeat itemTemplate for each array item
  } else {
    // Replace element content with data
    const data = getValueFromPath(binding.dataBinding); // e.g., state.propertyInfo.yearBuilt.value
    element.textContent = data;
  }

  // Apply conditional styles
  binding.conditionalStyles?.forEach(styleRule => {
    const watchValue = getValueFromPath(styleRule.dependsOn);

    styleRule.conditions.forEach(condition => {
      if (evaluateCondition(watchValue, condition.operator, condition.value)) {
        Object.assign(element.style, condition.cssProperties);
      }
    });
  });
});
```

## Example Workflow

### Binding a Simple Field

1. Enable Edit Mode
2. Find `state.propertyInfo.yearBuilt.value` (type: number)
3. Click "Bind"
4. Select a `<span>` element in your PDF template
5. The span will now display the year built value

### Binding a List with Conditional Styling

1. Find `state.environmentalData.easementsData` (type: array)
2. Click "Bind"
3. Select a `<div class="easements-container">` as the container
4. Select a `<div class="easement-card">` as the child item template
5. Go to DOM Bindings tab, click edit on this binding
6. Add a conditional style:
   - Depends On: `state.environmentalData.easementsData[0].type`
   - Condition: equals "drainage"
   - CSS: `backgroundColor` = "#e3f2fd" (light blue)
7. Add another condition:
   - Condition: equals "utility"
   - CSS: `backgroundColor` = "#fff3e0" (light orange)

Now when rendering, each easement card will have a different background color based on its type!

## Visual Binding Indicators

Once you've created DOM bindings, you can enable **visual indicators** to see them highlighted on your page:

### Enabling Visual Indicators

1. In the Data Binding Reference panel header, you'll see an **Eye icon** button (appears when you have at least one binding)
2. Click the eye icon to toggle visual indicators on/off
3. When enabled:
   - All bound elements get a **green dashed border** (2px dashed #10b981)
   - Elements are outlined with 2px offset for visibility
   - **Hover** over any bound element to see a tooltip

### Visual Indicator Features

**The hover tooltip shows:**
- The data binding path (e.g., `state.coverPageData.addressCommonName`)
- The data type (e.g., `string`, `number`)
- Number of conditional styles applied (if any)

**Visual appearance:**
- Green border indicates the element has an active binding
- Tooltip appears above the element with green background
- Arrow points to the element for clarity

### Use Cases

Visual indicators are helpful for:
- **Verifying bindings** - quickly see which elements are bound
- **Debugging** - identify missing or incorrect bindings
- **Documentation** - show team members where data is being used
- **Quality assurance** - ensure all required fields are bound before production

**Note:** Visual indicators are for development/design time only. They don't affect the actual PDF rendering.

## Tips

- **Start Simple**: Begin with simple text bindings before tackling lists and conditional styles
- **Test Incrementally**: Add one binding at a time and test the PDF generation
- **Use Export**: Always export your bindings after making significant changes
- **Hover for Details**: Hover over bindings in the DOM Bindings tab to see the full CSS selector
- **Type Safety**: The system prevents you from binding incompatible types (e.g., an array to a text input)

## Troubleshooting

**Element not selectable**: Make sure the element type is compatible with the data type. Check the type compatibility table above.

**Conditional styles not working**: Verify that the "depends on" path exactly matches a valid data binding path.

**List rendering issues**: Ensure you selected both the container and a child element. The child element should be a direct or nested child of the container.

**Bindings lost after refresh**: Remember to export your bindings and save them to a file. The bindings are stored in component state and will be lost on page refresh unless persisted.
