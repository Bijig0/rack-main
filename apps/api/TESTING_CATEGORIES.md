# Test Categorization

This project uses test categorization to separate fast unit tests from slow integration tests.

## Test Categories

### 1. **Unit Tests** (Fast)
- **File naming**: `*.test.ts`
- **Purpose**: Fast, isolated tests that don't require external resources
- **Examples**:
  - Pure function tests
  - Schema validation tests
  - Utility function tests
  - Mock-based tests

### 2. **Integration Tests** (Slow)
- **File naming**: `*.integration.test.ts`
- **Purpose**: Tests that interact with external resources or are slow to execute
- **Examples**:
  - Browser automation tests (Playwright, Selenium)
  - Database integration tests
  - API integration tests
  - Tests that spawn actual processes
  - Tests with significant setup/teardown time

## Naming Convention

### Unit Tests
```
myFunction.test.ts
myComponent.test.ts
utils.test.ts
```

### Integration Tests
```
fillSearch.integration.test.ts
selenium-login.integration.test.ts
database-connection.integration.test.ts
```

## Test Commands

| Command | Description | Runs | Use Case |
|---------|-------------|------|----------|
| `npm test` | Run fast tests only | Unit tests | Default, frequent testing |
| `npm run test:fast` | Run fast tests only | Unit tests | Same as `npm test` |
| `npm run test:integration` | Run integration tests only | Integration tests | Testing slow/external integrations |
| `npm run test:all` | Run all tests | Unit + Integration | Complete test suite |
| `npm run test:watch` | Watch mode (all tests) | All tests | Development mode |

## Git Hooks

### Pre-Commit Hook
- **Runs**: Fast tests only (`npm run test:fast`)
- **Purpose**: Quick feedback loop, doesn't slow down commits
- **Fails**: If any unit tests fail

### Pre-Push Hook
- **Runs**: All tests (`npm run test:all`)
- **Purpose**: Comprehensive testing before pushing to remote
- **Fails**: If any tests (unit or integration) fail

## When to Use Each Category

### Use Unit Tests (*.test.ts) for:
- ✅ Testing pure functions
- ✅ Schema validation
- ✅ Data transformation logic
- ✅ Business logic
- ✅ Utility functions
- ✅ Tests that run in < 100ms

### Use Integration Tests (*.integration.test.ts) for:
- ✅ Browser automation (Playwright)
- ✅ Selenium tests
- ✅ Database queries
- ✅ External API calls
- ✅ File system operations
- ✅ Tests that take > 1 second
- ✅ Tests that require network access

## Migrating Existing Tests

To convert an existing test to an integration test:

1. **Rename the file**:
   ```bash
   mv myTest.test.ts myTest.integration.test.ts
   ```

2. **No code changes needed** - the test content stays the same

3. **The test will now**:
   - Be excluded from `npm test` (pre-commit)
   - Be included in `npm run test:all` (pre-push)
   - Be run via `npm run test:integration`

## Example: fillSearch Test Migration

**Before:**
```
fillSearch.test.ts  ← Slow Playwright tests ran on every commit
```

**After:**
```
fillSearch.integration.test.ts  ← Only runs on push or when explicitly requested
```

## Benefits

### Faster Development Cycle
- Unit tests run in seconds
- Quick feedback during development
- No waiting for browser automation on every commit

### Comprehensive Pre-Push Testing
- All tests (including slow ones) run before pushing
- Catches integration issues before they reach remote
- Maintains code quality

### Targeted Testing
- Run only integration tests when debugging browser issues
- Run only unit tests for quick iteration
- Run all tests before major changes

## Performance Comparison

### Before (All Tests on Commit)
```
git commit
→ Runs all tests including browser automation
→ Wait time: 30-60 seconds
→ Frustrating during rapid development
```

### After (Categorized Tests)
```
git commit
→ Runs only fast unit tests
→ Wait time: 2-5 seconds
→ Quick feedback

git push
→ Runs all tests
→ Wait time: 30-60 seconds
→ Comprehensive check before sharing code
```

## Best Practices

1. **Default to unit tests**: If a test can be fast, make it fast
2. **Use mocks**: Mock external dependencies in unit tests
3. **Integration tests for real scenarios**: Use integration tests for end-to-end flows
4. **Keep integration tests focused**: Don't test every edge case in integration tests
5. **Regular integration test runs**: Run `npm run test:integration` locally before pushing

## CI/CD Recommendations

For CI/CD pipelines, run tests in stages:

```yaml
# Stage 1: Fast tests (run on every commit)
- npm run test:fast

# Stage 2: Integration tests (run on pull requests)
- npm run test:integration

# Stage 3: Full test suite (run before merge)
- npm run test:all
```

## Troubleshooting

### Test not being categorized correctly

**Problem**: Integration test still runs on commit
**Solution**: Ensure filename ends with `.integration.test.ts`

### Can't find integration tests

**Problem**: `npm run test:integration` shows no tests
**Solution**: Check that files are in the `./src` directory and match `*.integration.test.ts`

### Tests running twice

**Problem**: Same test runs in both fast and integration
**Solution**: Make sure integration tests have `.integration.test.ts` extension, not `.test.ts`
