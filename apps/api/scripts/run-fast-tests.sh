#!/bin/bash

# Run all tests except integration and playwright tests
# Integration tests are marked with .integration.test.ts
# Playwright tests are marked with .playwright.test.ts and run separately

set -e

echo "🧪 Running fast tests..."
echo ""

# Count test files for reporting
INTEGRATION_COUNT=$(find ./src -name "*.integration.test.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
PLAYWRIGHT_COUNT=$(find ./src -name "*.playwright.test.ts" -type f 2>/dev/null | wc -l | tr -d ' ')

# Function to restore files on exit
cleanup() {
  # Restore integration test files
  if [ "$INTEGRATION_COUNT" -gt 0 ]; then
    find ./src -name "*.integration.test.ts.skip" -type f 2>/dev/null | while read -r file; do
      mv "$file" "${file%.skip}" 2>/dev/null || true
    done
  fi

  # Restore playwright test files
  if [ "$PLAYWRIGHT_COUNT" -gt 0 ]; then
    find ./src -name "*.playwright.test.ts.skip" -type f 2>/dev/null | while read -r file; do
      mv "$file" "${file%.skip}" 2>/dev/null || true
    done
  fi
}

# Register cleanup function to run on exit (success or failure)
trap cleanup EXIT

# Temporarily rename integration test files so bun test doesn't find them
if [ "$INTEGRATION_COUNT" -gt 0 ]; then
  echo "📋 Excluding $INTEGRATION_COUNT integration test file(s)"
  find ./src -name "*.integration.test.ts" -type f | while read -r file; do
    mv "$file" "$file.skip"
  done
fi

# Temporarily rename playwright test files so bun test doesn't find them
if [ "$PLAYWRIGHT_COUNT" -gt 0 ]; then
  echo "📋 Excluding $PLAYWRIGHT_COUNT playwright test file(s) from Bun tests"
  find ./src -name "*.playwright.test.ts" -type f | while read -r file; do
    mv "$file" "$file.skip"
  done
fi

# Run bun tests (with --no-watch to prevent watch mode)
echo ""
echo "Running Bun tests..."
~/.bun/bin/bun test --no-watch
BUN_TEST_RESULT=$?

# Restore files before running Playwright tests
cleanup

# Run playwright tests if any exist
PLAYWRIGHT_TEST_RESULT=0
if [ "$PLAYWRIGHT_COUNT" -gt 0 ]; then
  echo ""
  echo "🎭 Running Playwright tests..."
  npx playwright test
  PLAYWRIGHT_TEST_RESULT=$?
fi

# Check overall result
echo ""
if [ $BUN_TEST_RESULT -eq 0 ] && [ $PLAYWRIGHT_TEST_RESULT -eq 0 ]; then
  echo "✅ All fast tests passed!"
  exit 0
else
  if [ $BUN_TEST_RESULT -ne 0 ]; then
    echo "❌ Bun tests failed!"
  fi
  if [ $PLAYWRIGHT_TEST_RESULT -ne 0 ]; then
    echo "❌ Playwright tests failed!"
  fi
  exit 1
fi
