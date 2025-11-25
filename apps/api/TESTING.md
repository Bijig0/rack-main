# Testing Guide

This project uses [Bun](https://bun.sh) as the test runner. Tests are organized by module to allow focused testing of specific parts of the codebase.

## Test Scripts

### Run All Tests
```bash
npm test
# or
npm run test:all
```

Runs all tests across the entire codebase (both `report-generator` and `backend`).

**Example output:**
```
18 pass
0 fail
47 expect() calls
Ran 18 tests across 3 files. [21.09s]
```

### Run Report Generator Tests Only
```bash
npm run test:report-generator
```

Runs only the tests in the `src/report-generator` directory. This is useful when working on PDF generation, sections, or data conversion logic.

**Example output:**
```
9 pass
0 fail
38 expect() calls
Ran 9 tests across 1 files. [9.00ms]
```

**Tests included:**
- `convertSectionsToTemplateAndInputs.test.ts` - Tests for section-to-template conversion logic

### Run Backend Tests Only
```bash
npm run test:backend
```

Runs only the tests in the `src/backend` directory. This is useful when working on CoreLogic integration, web scraping, or data fetching logic.

**Example output:**
```
9 pass
0 fail
9 expect() calls
Ran 9 tests across 2 files. [21.09s]
```

**Tests included:**
- `fillSearch.test.ts` - Tests for CoreLogic search functionality
- `firstLogin.test.ts` - Tests for CoreLogic authentication

## Test Structure

### Report Generator Tests
Location: `src/report-generator/**/*.test.ts`

These tests cover:
- PDF section creation and assembly
- Data conversion and transformation
- Template and input merging
- Type validation

Example test file structure:
```typescript
import { describe, it, expect } from "bun:test";
import convertSectionsToTemplateAndInputs from "./convertSectionsToTemplateAndInputs";

describe("convertSectionsToTemplateAndInputs", () => {
  it("should convert a single section to template and inputs", () => {
    // Test implementation
  });
});
```

### Backend Tests
Location: `src/backend/**/*.test.ts`

These tests cover:
- CoreLogic API interactions
- Web automation with Playwright
- Data scraping and parsing
- Authentication flows

Example test file structure:
```typescript
import { describe, it, expect } from "bun:test";
import { fillSearchElements } from "./fillSearch";

describe("fillSearchElements", () => {
  it("should fill the input element with the provided address", async () => {
    // Test implementation
  });
});
```

## Writing New Tests

### 1. Create a Test File
Test files should be co-located with the code they test and use the `.test.ts` extension:
```
src/
  report-generator/
    myModule/
      myModule.ts
      myModule.test.ts  ← Test file
```

### 2. Import Test Utilities
```typescript
import { describe, it, expect } from "bun:test";
```

### 3. Write Tests
```typescript
describe("myModule", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

## Test Patterns

### Unit Tests
Test individual functions in isolation:
```typescript
it("should merge sections correctly", () => {
  const sections = [section1, section2];
  const result = convertSections(sections);
  expect(result.schemas).toHaveLength(2);
});
```

### Integration Tests
Test how multiple components work together:
```typescript
it("should generate a complete PDF", async () => {
  const data = samplePropertyReportData;
  const pdf = await createRentalAppraisalPDFInstance({ data });
  expect(pdf).toBeInstanceOf(Uint8Array);
});
```

### Async Tests
Use `async/await` for asynchronous tests:
```typescript
it("should fetch data from API", async () => {
  const result = await fetchPropertyData(address);
  expect(result).toBeDefined();
});
```

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipelines
- Before creating pull requests

## Coverage

To see which code is covered by tests, you can use Bun's built-in coverage tool:
```bash
bun test --coverage
```

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
   - ✅ Good: `should merge multiple sections into a single template`
   - ❌ Bad: `test1`

2. **Arrange-Act-Assert**: Structure tests with clear sections
   ```typescript
   it("should do something", () => {
     // Arrange - Set up test data
     const input = { ... };

     // Act - Execute the function
     const result = myFunction(input);

     // Assert - Verify the result
     expect(result).toBe(expected);
   });
   ```

3. **Test Independence**: Each test should be independent and not rely on others
4. **Clear Assertions**: Use specific assertions that clearly show what's expected
5. **Edge Cases**: Test boundary conditions, empty inputs, and error cases

## Common Assertions

```typescript
// Equality
expect(value).toBe(expected);
expect(object).toEqual(expectedObject);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objects
expect(object).toHaveProperty("key");
expect(object.key).toBeDefined();

// Errors
expect(() => throwError()).toThrow();
```

## Debugging Tests

To debug a specific test:
```bash
# Run a specific test file
bun test path/to/test.test.ts

# Run with verbose output
bun test --verbose

# Run in watch mode (re-runs on file changes)
bun test --watch
```

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [TypeScript Testing Best Practices](https://typescript-eslint.io/rules/)
