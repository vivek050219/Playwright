# Dream Portal - Automated Testing Suite

##  Project Overview

This is a comprehensive automated testing suite for the **Dream Portal** website (https://arjitnigam.github.io/myDreams/), a dream journaling application. The project automates functional testing across three main pages and includes bonus AI-based validation using OpenAI.

**Tech Stack**: Playwright (TypeScript), Page Object Model (POM) architecture, with optional OpenAI API integration for AI-based validations.

---

## 🎯 Objectives

### Part 1: Core UI Functional Test Automation 

Automate testing of three main pages:

1. **index.html** - Dream Portal Home
   - Verify loading animation appears and disappears
   - Verify main content becomes visible
   - Validate "My Dreams" button functionality

2. **dreams-diary.html** - Dream Log Table
   - Validate exactly 10 dream entries exist
   - Verify dream types are only "Good" or "Bad"
   - Ensure all columns are properly filled

3. **dreams-total.html** - Summary Statistics Page
   - Verify correct statistics: 6 Good, 4 Bad, 10 Total dreams
   - Validate recurring dreams count (2)
   - Confirm "Flying over mountains" and "Lost in maze" are recurring

### Part 2: Bonus AI-Based Validation 

- Use OpenAI API to classify dream names into "Good" or "Bad"
- Compare AI classification with table values
- Generate accuracy report

---

## 📁 Project Structure

```
DreamPortal/
├── tests/
│   ├── pages/                      # Page Object Model (POM) classes
│   │   ├── homePage.ts            # Home page object
│   │   ├── dreamDiaryPage.ts      # Dream diary table object
│   │   └── dreamTotalPage.ts      # Dream summary page object
│   │
│   ├── specs/                      # Test specification files
│   │   ├── homePageTests.spec.ts            # Home page tests
│   │   ├── dreamDiaryTests.spec.ts          # Dream diary tests
│   │   └── dreamTotalTests.spec.ts          # Dream summary tests
│   │
│   └── utils/                      # Utility functions
│       ├── helpers.ts             # Common test helpers & utilities
│       └── aiValidator.ts         # AI-based validation (OpenAI)
│
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- OpenAI API key (optional, for AI validation bonus feature)

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd DreamPortal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (if not already installed):
   ```bash
   npx playwright install
   ```

### Environment Setup

To enable AI-based validation (optional), set the OpenAI API key:

```bash
# On Windows (PowerShell)
$env:OPENAI_API_KEY = "your-openai-api-key-here"

# On Windows (Command Prompt)
set OPENAI_API_KEY=your-openai-api-key-here

# On macOS/Linux
export OPENAI_API_KEY="your-openai-api-key-here"
```

---

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
# Test home page
npx playwright test tests/specs/homePageTests.spec.ts

# Test dream diary page
npx playwright test tests/specs/dreamDiaryTests.spec.ts

# Test dream summary page
npx playwright test tests/specs/dreamTotalTests.spec.ts
```

### Run Tests in Headed Mode (with browser visible)

```bash
npx playwright test --headed
```

### Run Tests with Specific Browser

```bash
# Chrome
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# WebKit
npx playwright test --project=webkit
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Single Test

```bash
npx playwright test -g "Verify loading animation appears"
```

---

## 📊 Test Coverage

### Home Page Tests (6 tests)
- ✅ Loading animation appears on page load
- ✅ Loading animation disappears after ~3 seconds
- ✅ Main content becomes visible
- ✅ "My Dreams" button is visible and clickable
- ✅ Clicking "My Dreams" opens new tabs
- ✅ Page title and basic structure validation

### Dream Diary Page Tests (7 tests)
- ✅ Page loads successfully
- ✅ Exactly 10 dream entries exist
- ✅ All dream types are "Good" or "Bad"
- ✅ All rows have complete data
- ✅ Dream entries are extracted correctly
- ✅ Specific recurring dream candidates exist
- ✅ Dream type distribution matches expected values

### Dream Summary Page Tests (10 tests)
- ✅ Page loads successfully
- ✅ Good dreams count = 6
- ✅ Bad dreams count = 4
- ✅ Total dreams count = 10
- ✅ Recurring dreams count = 2
- ✅ All statistics verification
- ✅ "Flying over mountains" is recurring
- ✅ "Lost in maze" is recurring
- ✅ Expected recurring dreams validation
- ✅ [BONUS] AI-based classification validation
- ✅ Statistics consistency across pages

**Total: 23+ tests**

---

## 📝 Page Object Model (POM)

The project uses the **Page Object Model** pattern for better maintainability:

### HomePage Class
```typescript
- navigateToHome(url: string)
- isLoadingAnimationVisible()
- waitForLoadingAnimationToDisappear()
- isMainContentVisible()
- clickMyDreamsButton()
- waitForNewPageAndReturn()
```

### DreamDiaryPage Class
```typescript
- navigateToDreamDiary(url: string)
- getDreamCount()
- getAllDreamEntries()
- validateDreamTypes(dreams)
- validateAllColumnsAreFilled(dreams)
- getDreamNames()
- getDreamTypes()
```

### DreamTotalPage Class
```typescript
- navigateToDreamTotal(url: string)
- getGoodDreamsCount()
- getBadDreamsCount()
- getTotalDreamsCount()
- getRecurringDreamsCount()
- getRecurringDreamNames()
- getAllStats()
- isRecurringDream(dreamName)
- validateExpectedRecurringDreams()
```

---

## 🔧 Utility Functions

### helpers.ts
- `takeScreenshot()` - Capture screenshots for test reports
- `logTest()` - Structured test logging with timestamps
- `retryWithBackoff()` - Retry logic with exponential backoff
- `countOccurrences()` - Count elements in array
- `getFrequencyMap()` - Get frequency distribution
- `findDuplicates()` - Identify duplicate values
- `waitForCondition()` - Wait for custom conditions
- `formatTestResults()` - Format results for logging

### aiValidator.ts
- `classifyDream()` - Classify single dream using OpenAI
- `classifyDreams()` - Batch classify multiple dreams
- `validateDreamClassifications()` - Compare AI vs table values
- `getValidationSummary()` - Generate accuracy report

---

## 📊 Test Reports

### HTML Report

After running tests, view the interactive HTML report:

```bash
npx playwright show-report
```

Report location: `playwright-report/index.html`

### Screenshots

Screenshots are automatically captured during test execution:
- Location: `test-results/screenshots/`
- Named descriptively (e.g., `loading_animation_visible-2024-01-15T10-30-45.png`)

### Test Results

Test results are saved in: `test-results/` directory

---

## 🎯 Test Scenarios

### Scenario 1: Home Page Loading
1. User navigates to Dream Portal home
2. Loading animation appears (transient, may not always be visible)
3. After ~3 seconds, animation disappears
4. Main content becomes visible
5. "My Dreams" button is available

### Scenario 2: Dream Diary Validation
1. User opens the dreams diary page
2. Table contains exactly 10 dream entries
3. Each entry has Name, Days Ago, and Type (Good/Bad)
4. Distribution: 6 Good dreams, 4 Bad dreams

### Scenario 3: Summary Statistics
1. User opens the dreams summary page
2. Statistics display correctly:
   - Good: 6
   - Bad: 4
   - Total: 10
   - Recurring: 2
3. Recurring dreams list includes:
   - "Flying over mountains"
   - "Lost in maze"

### Scenario 4: AI Validation (Bonus)
1. Extract dream names from diary page
2. Send names to OpenAI for classification
3. Compare AI classification with table values
4. Generate accuracy report

---

## 🔐 Best Practices Implemented

✅ **Page Object Model** - Encapsulates page elements and interactions  
✅ **Separation of Concerns** - Page objects, tests, and utilities are separate  
✅ **Descriptive Test Names** - Clear, understandable test descriptions  
✅ **Comprehensive Comments** - Inline comments explaining test purposes  
✅ **Logging & Reporting** - Detailed logs and screenshots for debugging  
✅ **Error Handling** - Graceful handling of timeouts and failures  
✅ **Reusable Utilities** - Common functions for all tests  
✅ **Configuration Management** - Centralized configuration in playwright.config.ts  
✅ **Type Safety** - Full TypeScript typing for better IDE support  

---

## 🚨 Debugging Tips

### Enable Debug Mode
```bash
npx playwright test --debug
```

### View Browser Actions in Inspector
```bash
PWDEBUG=1 npx playwright test
```

### Check Test Logs
Logs are printed to console during test execution. Look for messages with timestamps:
```
[2024-01-15T10:30:45.123Z] Test: Verify loading animation appears
✓ Loading animation is visible
```

### Review Screenshots
After test failure, check the automatically captured screenshots in `test-results/screenshots/`

---

## 📈 Extending the Tests

### Add a New Test

1. Create a new test in the appropriate `.spec.ts` file:
```typescript
test('New test case', async ({ page }) => {
  logTest('Test: New test case');
  // Test implementation
  await takeScreenshot(page, 'test_name');
});
```

2. Use existing page objects for interaction

### Add a New Page Object

1. Create new file in `tests/pages/`
2. Define selectors and methods
3. Import and use in test files

### Add AI Validation

Use `AIValidator` class to classify dreams:
```typescript
const aiValidator = new AIValidator();
const validations = await aiValidator.validateDreamClassifications(
  dreamNames, 
  dreamTypes
);
```

---

## 🐛 Troubleshooting

### Tests Timeout
- Increase timeout in playwright.config.ts
- Check internet connection
- Verify website is accessible

### Screenshot Failures
- Ensure `test-results/` directory is writable
- Check disk space availability

### AI Validation Skipped
- Verify `OPENAI_API_KEY` environment variable is set
- Check OpenAI API quota and account status
- Review API response in logs

### Element Not Found
- Verify website structure hasn't changed
- Update selectors in page object
- Check element visibility/timing

---

## 📚 Project Metadata

- **Framework**: Playwright (JS/TS)
- **Language**: TypeScript
- **Architecture**: Page Object Model (POM)
- **Reporting**: HTML reports + Screenshots
- **AI Integration**: OpenAI API (optional)
- **Configuration**: playwright.config.ts
- **Node Version**: 16+

---

## 📄 Submission Details

### Repository
- **Type**: GitHub Private Repository
- **Access**: Shared with username: `qawingify`
- **Git Commits**: Clean and descriptive commit messages

### Deliverables Included
✅ Complete test automation suite  
✅ Page Object Model implementation  
✅ Well-documented code with comments  
✅ Comprehensive README.md  
✅ HTML test reports  
✅ Screenshot capture functionality  
✅ AI-based validation (bonus)  
✅ Helper utilities  
✅ TypeScript configuration  

---

