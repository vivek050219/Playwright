# Dream Portal - Test Execution Guide

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# View report
npm run report
```

---

## 📖 Detailed Test Execution Guide

### 1. Installation & Setup

#### Step 1: Install Node.js Dependencies
```bash
cd DreamPortal
npm install
```

**This installs:**
- `@playwright/test` - Playwright testing framework
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `dotenv` - Environment variable management

#### Step 2: Install Playwright Browsers
```bash
npm run install-browsers
# OR
npx playwright install
```

**Browsers installed:**
- Chromium
- Firefox
- WebKit
- (Optional) Mobile Chrome & Mobile Safari

#### Step 3: Set Environment Variables (For AI Validation - Optional)
```bash
# PowerShell (Windows)
$env:OPENAI_API_KEY = "sk-your-api-key-here"

# Command Prompt (Windows)
set OPENAI_API_KEY=sk-your-api-key-here

# Bash (macOS/Linux)
export OPENAI_API_KEY="sk-your-api-key-here"
```

---

## 🧪 Running Tests

### Basic Test Execution

#### Run All Tests (Parallel)
```bash
npm test
```
- Runs all test files in `tests/specs/`
- Executes tests in parallel across available CPU cores
- Generates HTML report in `playwright-report/`

#### Run Specific Test File
```bash
npx playwright test homePageTests.spec.ts
npx playwright test dreamDiaryTests.spec.ts
npx playwright test dreamTotalTests.spec.ts
```

#### Run Single Test Case
```bash
npx playwright test -g "Verify loading animation"
```

### Advanced Execution

#### Headed Mode (see browser)
```bash
npm run test:headed
# OR
npx playwright test --headed
```

#### Debug Mode (with Inspector)
```bash
npm run test:debug
# OR
npx playwright test --debug
```

#### UI Mode (Interactive)
```bash
npm run test:ui
# OR
npx playwright test --ui
```

#### Specific Browser Only
```bash
npm run test:chromium  # Chrome only
npm run test:firefox   # Firefox only
npm run test:webkit    # Safari only
```

#### Mobile Testing
```bash
npm run test:mobile
# OR
npx playwright test --project='Mobile Chrome'
```

#### Run with Traces
```bash
npx playwright test --trace on
```

---

## 📊 Understanding Test Output

### Console Output Example

```
✓ tests/specs/homePageTests.spec.ts:23 (6 tests)
  ✓ Verify loading animation appears on page load
  ✓ Verify loading animation disappears after ~3 seconds
  ✓ Verify main content becomes visible
  ✓ Verify "My Dreams" button is visible and clickable
  ✓ Verify clicking "My Dreams" opens new tabs
  ✓ Verify page title and basic structure

✓ tests/specs/dreamDiaryTests.spec.ts:19 (7 tests)
  ✓ Verify the dreams diary page loads successfully
  ✓ Verify there are exactly 10 dream entries
  ✓ Verify all dream types are either "Good" or "Bad"
  ✓ Verify each row has all three columns filled
  ...

23 passed (15s)
```

### HTML Report

View the interactive HTML report:

```bash
npm run report
```

**Report includes:**
- Test pass/fail status
- Execution time for each test
- Screenshots on failure
- Video recordings (if enabled)
- Full trace files

---

## 🔍 Test File Structure

### Test File Format

Each test file follows this structure:

```typescript
import { test, expect } from '@playwright/test';
import { PageObject } from '../pages/pageName';

test.describe('Test Suite Name', () => {
  let pageObject: PageObject;

  test.beforeEach(async ({ page }) => {
    // Setup: Initialize page objects
    pageObject = new PageObject(page);
  });

  test('Test Description', async ({ page }) => {
    // Arrange: Setup test data
    // Act: Perform actions
    // Assert: Verify results
  });
});
```

### Test Naming Convention

- **Descriptive**: `Verify there are exactly 10 dream entries`
- **Action-based**: `User navigates to home page`
- **Outcome-focused**: `"My Dreams" button opens new tabs`

---

## 📸 Screenshots & Artifacts

### Automatic Screenshot Capture

Screenshots are automatically captured:
- ✅ On test failure (always)
- ✅ During test execution (on demand via `takeScreenshot()`)

**Location**: `test-results/screenshots/`

**Example filename**: `loading_animation_visible-2024-01-15T10-30-45-123.png`

### View Screenshots

1. **In HTML Report**:
   ```bash
   npm run report
   ```

2. **In File System**:
   ```bash
   # Windows
   explorer test-results/screenshots

   # macOS
   open test-results/screenshots

   # Linux
   xdg-open test-results/screenshots
   ```

---

## 🧠 Test Categories

### Category 1: Home Page Tests (homePageTests.spec.ts)

| Test | Duration | Expected |
|------|----------|----------|
| Loading animation appears | ~1s | ✓ Pass |
| Animation disappears (3s) | ~4s | ✓ Pass |
| Main content visible | ~2s | ✓ Pass |
| Button visible & clickable | ~2s | ✓ Pass |
| Opens new tabs | ~3s | ✓ Pass |
| Page structure valid | ~1s | ✓ Pass |

**Total Time**: ~13 seconds

### Category 2: Dream Diary Tests (dreamDiaryTests.spec.ts)

| Test | Duration | Expected |
|------|----------|----------|
| Page loads | ~2s | ✓ Pass |
| Exactly 10 entries | ~1s | ✓ Pass |
| Types are Good/Bad | ~1s | ✓ Pass |
| All columns filled | ~1s | ✓ Pass |
| Extract entries | ~2s | ✓ Pass |
| Verify recurring candidates | ~1s | ✓ Pass |
| Type distribution | ~1s | ✓ Pass |

**Total Time**: ~9 seconds

### Category 3: Dream Total Tests (dreamTotalTests.spec.ts)

| Test | Duration | Expected |
|------|----------|----------|
| Page loads | ~2s | ✓ Pass |
| Good dreams = 6 | ~1s | ✓ Pass |
| Bad dreams = 4 | ~1s | ✓ Pass |
| Total dreams = 10 | ~1s | ✓ Pass |
| Recurring dreams = 2 | ~1s | ✓ Pass |
| All stats together | ~2s | ✓ Pass |
| Flying over mountains | ~1s | ✓ Pass |
| Lost in maze | ~1s | ✓ Pass |
| Expected recurring | ~1s | ✓ Pass |
| [BONUS] AI Validation | ~45s | ⚠️ Optional |
| Stats consistency | ~4s | ✓ Pass |

**Total Time**: ~20 seconds (without AI), ~65 seconds (with AI)

---

## 🔧 Troubleshooting

### Issue: Tests Timeout

**Solution**:
1. Increase timeout in `playwright.config.ts`:
   ```typescript
   timeout: 120 * 1000 // 120 seconds
   ```
2. Check internet connection
3. Verify website accessibility

### Issue: Element Not Found

**Solution**:
1. Check if website structure changed
2. Update selectors in page objects
3. Use `npx playwright test --debug` to inspect

### Issue: AI Validation Skipped

**Solution**:
1. Set `OPENAI_API_KEY` environment variable
2. Verify API key is valid
3. Check OpenAI account quota

### Issue: Screenshots Not Saved

**Solution**:
1. Ensure `test-results/` directory exists
2. Check write permissions
3. Verify disk space availability

---

## 🎯 Test Execution Workflow

### Step-by-Step Workflow

```
1. Install Dependencies
   └─> npm install

2. Install Browsers
   └─> npm run install-browsers

3. Set Environment (Optional)
   └─> export OPENAI_API_KEY=...

4. Run Tests
   ├─> npm test              (All tests)
   ├─> npm run test:headed   (Visible)
   └─> npm run test:debug    (Interactive)

5. Review Results
   ├─> Console output
   ├─> test-results/
   └─> npm run report        (HTML report)

6. Debug Failures (if any)
   └─> Check screenshots
   └─> Review logs
   └─> Run failing test in debug mode
```

---

## 📝 Interpreting Test Results

### Pass ✅
```
✓ tests/specs/homePageTests.spec.ts:6 Test Name (1s)
```

### Fail ❌
```
✖ tests/specs/homePageTests.spec.ts:6 Test Name (2s)

Error: expect(received).toBe(expected)
Expected: true
Received: false
```

### Skip ⊘
```
⊘ tests/specs/dreamTotalTests.spec.ts Test Name
  Skipped: OpenAI API key not configured
```

---

## 🚀 Best Practices

### Before Running Tests
- [ ] Verify internet connection
- [ ] Check website is accessible
- [ ] Update test data if website changed
- [ ] Set API keys for bonus features

### After Running Tests
- [ ] Review failed tests
- [ ] Check screenshots for issues
- [ ] Save reports for records
- [ ] Update tests if needed

### For CI/CD Integration
```bash
npm test -- --reporter=junit
# Generates JUnit XML for CI tools

npm test -- --reporter=github
# Outputs to GitHub Actions format
```

---

## 📊 Performance Metrics

### Expected Execution Times

| Scenario | Time |
|----------|------|
| All tests (parallel, no AI) | ~30 seconds |
| All tests (sequential) | ~40 seconds |
| All tests + AI validation | ~75 seconds |
| Single test suite | ~15 seconds |
| Single test case | ~2-3 seconds |

### Optimization Tips
- Use `--workers=4` for parallel execution
- Run tests in headed mode only for debugging
- Disable tracing for faster execution
- Use project filtering to run specific browsers

---

## 📚 Additional Resources

- [Playwright Docs](https://playwright.dev)
- [Test Configuration](./playwright.config.ts)
- [Page Objects](./tests/pages/)
- [Test Utilities](./tests/utils/)
- [Main README](./README.md)

---

**Version**: 1.0.0  
**Last Updated**: 2024

