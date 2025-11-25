#!/bin/bash

# Run only integration tests
# Integration tests are marked with .integration.test.ts

set -e

echo "🧪 Running integration tests..."
echo ""

# Check if there are any integration tests
INTEGRATION_COUNT=$(find ./src -name "*.integration.test.ts" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$INTEGRATION_COUNT" -eq 0 ]; then
  echo "No integration test files found"
  exit 0
fi

echo "Found $INTEGRATION_COUNT integration test file(s)..."
echo ""

# Temporarily rename non-integration test files so bun test only finds integration tests
find ./src -name "*.test.ts" ! -name "*.integration.test.ts" -type f | while read -r file; do
  mv "$file" "$file.skip"
done

# Run integration tests
bun test
TEST_RESULT=$?

# Restore non-integration test files
find ./src -name "*.test.ts.skip" -type f | while read -r file; do
  mv "$file" "${file%.skip}"
done

echo ""
if [ $TEST_RESULT -eq 0 ]; then
  echo "✅ Integration tests passed!"
else
  echo "❌ Integration tests failed!"
fi

exit $TEST_RESULT
