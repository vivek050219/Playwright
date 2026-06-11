/**
 * Dream Total (Summary) Page Tests
 * 
 * This test file contains all tests for the Dream Summary page (dreams-total.html).
 * 
 * Test Cases:
 * 1. Verify the page loads successfully
 * 2. Verify correct number of Good Dreams (6)
 * 3. Verify correct number of Bad Dreams (4)
 * 4. Verify correct Total Dreams count (10)
 * 5. Verify correct Recurring Dreams count (2)
 * 6. Verify specific dreams are marked as recurring
 * 7. Bonus: Validate dream classifications using AI
 * 
 * @module tests/specs/dreamTotalTests.spec.ts
 */

import { test, expect, skip } from '@playwright/test';
import { DreamTotalPage } from '../pages/dreamTotalPage';
import { DreamDiaryPage } from '../pages/dreamDiaryPage';
import { AIValidator } from '../utils/aiValidator';
import { takeScreenshot, logTest, formatTestResults } from '../utils/helpers';

// URL for the dreams total (summary) page
const DREAMS_TOTAL_URL = 'https://arjitnigam.github.io/myDreams/dreams-total.html';
const DREAMS_DIARY_URL = 'https://arjitnigam.github.io/myDreams/dreams-diary.html';

test.describe('Dream Total (Summary) Page Tests', () => {
  let dreamTotalPage: DreamTotalPage;

  test.beforeEach(async ({ page }) => {
    // Initialize the page object
    dreamTotalPage = new DreamTotalPage(page);
    logTest('Starting dream total page test');
  });

  test('Verify the dreams total page loads successfully', async ({ page }) => {
    // Test: Page should load without errors
    logTest('Test: Verify the dreams total page loads successfully');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    // Verify page loaded
    const title = await page.title();
    logTest(`✓ Page loaded. Title: ${title}`);

    await takeScreenshot(page, 'dream_total_page_loaded');
  });

  test('Verify correct number of Good Dreams (6)', async ({ page }) => {
    // Test: The page should show exactly 6 Good Dreams
    logTest('Test: Verify correct number of Good Dreams');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    const goodCount = await dreamTotalPage.getGoodDreamsCount();
    logTest(`Good dreams count: ${goodCount}`);
    logTest('Expected: 6');

    // Assert exactly 6 good dreams
    expect(goodCount).toBe(6);
    logTest('✓ Good dreams count verified (6)');

    await takeScreenshot(page, 'good_dreams_count_verified');
  });

  test('Verify correct number of Bad Dreams (4)', async ({ page }) => {
    // Test: The page should show exactly 4 Bad Dreams
    logTest('Test: Verify correct number of Bad Dreams');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    const badCount = await dreamTotalPage.getBadDreamsCount();
    logTest(`Bad dreams count: ${badCount}`);
    logTest('Expected: 4');

    // Assert exactly 4 bad dreams
    expect(badCount).toBe(4);
    logTest('✓ Bad dreams count verified (4)');

    await takeScreenshot(page, 'bad_dreams_count_verified');
  });

  test('Verify correct Total Dreams count (10)', async ({ page }) => {
    // Test: The page should show exactly 10 Total Dreams
    logTest('Test: Verify correct Total Dreams count');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    const totalCount = await dreamTotalPage.getTotalDreamsCount();
    logTest(`Total dreams count: ${totalCount}`);
    logTest('Expected: 10');

    // Assert exactly 10 total dreams
    expect(totalCount).toBe(10);
    logTest('✓ Total dreams count verified (10)');

    await takeScreenshot(page, 'total_dreams_count_verified');
  });

  test('Verify correct Recurring Dreams count (2)', async ({ page }) => {
    // Test: The page should show exactly 2 Recurring Dreams
    logTest('Test: Verify correct Recurring Dreams count');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    const recurringCount = await dreamTotalPage.getRecurringDreamsCount();
    logTest(`Recurring dreams count: ${recurringCount}`);
    logTest('Expected: 2');

    // Assert exactly 2 recurring dreams
    expect(recurringCount).toBe(2);
    logTest('✓ Recurring dreams count verified (2)');

    await takeScreenshot(page, 'recurring_dreams_count_verified');
  });

  test('Verify all dream statistics at once', async ({ page }) => {
    // Test: Verify all statistics in one test
    logTest('Test: Verify all dream statistics');

    await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);

    const stats = await dreamTotalPage.getAllStats();

    logTest('Dream Statistics:');
    logTest(formatTestResults({
      goodDreams: stats.goodDreams,
      badDreams: stats.badDreams,
      totalDreams: stats.totalDreams,
      recurringDreams: stats.recurringDreams,
    }));

    // Verify all expected values
    expect(stats.goodDreams).toBe(6);
    expect(stats.badDreams).toBe(4);
    expect(stats.totalDreams).toBe(10);
    expect(stats.recurringDreams).toBe(2);

    // Verify sum: good + bad = total
    expect(stats.goodDreams + stats.badDreams).toBe(stats.totalDreams);

    logTest('✓ All statistics verified successfully');

    await takeScreenshot(page, 'all_statistics_verified');
  });

  test('Verify "Flying over mountains" is marked as recurring', async ({ page }) => {
    // Test: The dream "Flying over mountains" should appear multiple times in dreams-diary
    logTest('Test: Verify "Flying over mountains" is marked as recurring');

    // Get dream data from diary page
    const dreamDiaryPage = new DreamDiaryPage(page);
    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    const flyingCount = dreams.filter(d => 
      d.name.toLowerCase().includes('flying') && d.name.toLowerCase().includes('mountain')
    ).length;

    logTest(`"Flying over mountains" appears ${flyingCount} time(s) in dreams diary`);

    // A dream is recurring if it appears more than once
    const isRecurring = flyingCount > 1;
    expect(isRecurring).toBe(true);
    logTest('✓ "Flying over mountains" verified as recurring');

    await takeScreenshot(page, 'flying_mountains_recurring');
  });

  test('Verify "Lost in maze" is marked as recurring', async ({ page }) => {
    // Test: The dream "Lost in maze" should appear multiple times in dreams-diary
    logTest('Test: Verify "Lost in maze" is marked as recurring');

    // Get dream data from diary page
    const dreamDiaryPage = new DreamDiaryPage(page);
    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    const lostCount = dreams.filter(d => 
      d.name.toLowerCase().includes('lost') && d.name.toLowerCase().includes('maze')
    ).length;

    logTest(`"Lost in maze" appears ${lostCount} time(s) in dreams diary`);

    // A dream is recurring if it appears more than once
    const isRecurring = lostCount > 1;
    expect(isRecurring).toBe(true);
    logTest('✓ "Lost in maze" verified as recurring');

    await takeScreenshot(page, 'lost_maze_recurring');
  });

  test('Verify expected recurring dreams are present', async ({ page }) => {
    // Test: Both expected recurring dreams should be present in the diary data
    logTest('Test: Verify expected recurring dreams are present');

    // Get dream data from diary page
    const dreamDiaryPage = new DreamDiaryPage(page);
    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    
    // Calculate recurring dreams from the data
    const recurringDreams = dreamTotalPage.getRecurringDreamsFromData(dreams);
    logTest(`Recurring dreams found: ${recurringDreams.length}`);
    logTest('Dream names:');
    recurringDreams.forEach(name => logTest(`  - ${name}`));

    // Verify expected dreams are in the recurring list
    const isValid = dreamTotalPage.validateExpectedRecurringDreamsInData(dreams);
    expect(isValid).toBe(true);
    logTest('✓ All expected recurring dreams verified');

    await takeScreenshot(page, 'expected_recurring_dreams_verified');
  });

  test('[BONUS] AI-Based Dream Classification Validation', async ({ page }) => {
    // BONUS TEST: Use AI to validate dream classifications
    logTest('Test: [BONUS] AI-Based Dream Classification Validation');

    // Initialize AI validator
    const aiValidator = new AIValidator();

    if (!aiValidator.isConfigured()) {
      logTest('⚠ OpenAI API not configured. Skipping AI validation test.');
      logTest('To enable: Set OPENAI_API_KEY environment variable');
      skip();
    }

    logTest('Extracting dream data from dreams-diary.html...');

    // Create a new page for the diary
    const diaryPage = await page.context().newPage();
    const dreamDiaryPage = new DreamDiaryPage(diaryPage);

    try {
      await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

      // Extract dream names and types from the table
      const dreams = await dreamDiaryPage.getAllDreamEntries();
      const dreamNames = dreams.map(d => d.name);
      const dreamTypes = dreams.map(d => d.type);

      logTest(`Found ${dreamNames.length} dream entries`);

      // Validate using AI
      logTest('Validating dream classifications using OpenAI...');
      const validations = await aiValidator.validateDreamClassifications(dreamNames, dreamTypes);

      // Get validation summary
      const summary = aiValidator.getValidationSummary(validations);

      logTest('AI Validation Summary:');
      logTest(formatTestResults({
        totalValidations: summary.totalValidations,
        matching: summary.matchingCount,
        mismatching: summary.mismatchCount,
        accuracyPercentage: summary.accuracyPercentage.toFixed(2) + '%',
        averageConfidence: summary.averageConfidence.toFixed(3),
      }));

      if (summary.mismatches.length > 0) {
        logTest('⚠ Mismatches detected:');
        summary.mismatches.forEach(mismatch => {
          logTest(`  - "${mismatch.dreamName}"`);
          logTest(`    Table: ${mismatch.tableValue}, AI: ${mismatch.aiValue}, Confidence: ${mismatch.confidence.toFixed(2)}`);
        });
      }

      logTest(`✓ AI Validation complete. Accuracy: ${summary.accuracyPercentage.toFixed(1)}%`);

      await takeScreenshot(diaryPage, 'ai_validation_complete');
    } finally {
      await diaryPage.close();
    }
  });

  test('Verify statistics consistency with diary page', async ({ browser }) => {
    // Test: Cross-verify statistics from both pages
    logTest('Test: Verify statistics consistency between pages');

    // Get stats from total page
    const context = await browser.newContext();
    const totalPage = await context.newPage();
    const diaryPage = await context.newPage();

    const dreamTotalPage = new DreamTotalPage(totalPage);
    const dreamDiaryPage = new DreamDiaryPage(diaryPage);

    try {
      // Load both pages
      await dreamTotalPage.navigateToDreamTotal(DREAMS_TOTAL_URL);
      await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

      // Get stats from total page
      const totalStats = await dreamTotalPage.getAllStats();

      // Get data from diary page
      const diaryDreams = await dreamDiaryPage.getAllDreamEntries();
      const diaryGood = diaryDreams.filter(d => d.type === 'Good').length;
      const diaryBad = diaryDreams.filter(d => d.type === 'Bad').length;

      logTest('Statistics Comparison:');
      logTest(`Total Page - Good: ${totalStats.goodDreams}, Bad: ${totalStats.badDreams}, Total: ${totalStats.totalDreams}`);
      logTest(`Diary Page - Good: ${diaryGood}, Bad: ${diaryBad}, Total: ${diaryDreams.length}`);

      // Verify consistency
      expect(totalStats.goodDreams).toBe(diaryGood);
      expect(totalStats.badDreams).toBe(diaryBad);
      expect(totalStats.totalDreams).toBe(diaryDreams.length);

      logTest('✓ Statistics are consistent across pages');

      await takeScreenshot(totalPage, 'statistics_consistency_verified');
    } finally {
      await context.close();
    }
  });
});
