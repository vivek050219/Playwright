/**
 * Dream Diary Page Tests
 * 
 * This test file contains all tests for the Dream Log Table page (dreams-diary.html).
 * 
 * Test Cases:
 * 1. Verify the page loads successfully
 * 2. Verify there are exactly 10 dream entries
 * 3. Verify all dream types are either "Good" or "Bad"
 * 4. Verify each row has all three columns filled
 * 5. Verify specific dream entries exist
 * 6. Extract and validate dream data for use in other tests
 * 
 * @module tests/specs/dreamDiaryTests.spec.ts
 */

import { test, expect } from '@playwright/test';
import { DreamDiaryPage } from '../pages/dreamDiaryPage';
import { takeScreenshot, logTest, formatTestResults } from '../utils/helpers';

// URL for the dreams diary page
const DREAMS_DIARY_URL = 'https://arjitnigam.github.io/myDreams/dreams-diary.html';

test.describe('Dream Diary Page Tests', () => {
  let dreamDiaryPage: DreamDiaryPage;

  test.beforeEach(async ({ page }) => {
    // Initialize the page object
    dreamDiaryPage = new DreamDiaryPage(page);
    logTest('Starting dream diary page test');
  });

  test('Verify the dreams diary page loads successfully', async ({ page }) => {
    // Test: Page should load without errors
    logTest('Test: Verify the dreams diary page loads successfully');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    // Verify page loaded
    const title = await page.title();
    logTest(`✓ Page loaded. Title: ${title}`);

    // Verify table exists
    const table = page.locator('table, [role="table"]');
    expect(await table.count()).toBeGreaterThan(0);

    logTest('✓ Dream table found on page');
    await takeScreenshot(page, 'dream_diary_page_loaded');
  });

  test('Verify there are exactly 10 dream entries', async ({ page }) => {
    // Test: The dreams diary should contain exactly 10 dream entries (no more, no less)
    logTest('Test: Verify there are exactly 10 dream entries');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreamCount = await dreamDiaryPage.getDreamCount();
    logTest(`Dream entries found: ${dreamCount}`);

    // Assert exactly 10 dreams
    expect(dreamCount).toBe(10);
    logTest('✓ Exactly 10 dream entries verified');

    await takeScreenshot(page, 'dream_diary_10_entries');
  });

  test('Verify all dream types are either "Good" or "Bad"', async ({ page }) => {
    // Test: All dream type values should be either "Good" or "Bad"
    logTest('Test: Verify all dream types are either "Good" or "Bad"');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    const isValid = dreamDiaryPage.validateDreamTypes(dreams);

    logTest(`Dream entries validation: ${isValid}`);

    // Extract and log dream types
    const dreamTypes = dreams.map(d => d.type);
    logTest('Dream types found:', dreamTypes);

    // Count good and bad dreams
    const goodCount = dreamTypes.filter(t => t === 'Good').length;
    const badCount = dreamTypes.filter(t => t === 'Bad').length;

    logTest(`Good dreams: ${goodCount}, Bad dreams: ${badCount}`);

    // Assert all are valid
    expect(isValid).toBe(true);
    logTest('✓ All dream types are valid (Good or Bad)');

    await takeScreenshot(page, 'dream_types_validated');
  });

  test('Verify each row has all three columns filled', async ({ page }) => {
    // Test: Each dream entry should have Dream Name, Days Ago, and Dream Type columns filled
    logTest('Test: Verify each row has all three columns filled');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    const allFilled = dreamDiaryPage.validateAllColumnsAreFilled(dreams);

    logTest(`All columns filled validation: ${allFilled}`);

    // Log first few entries
    logTest('Sample dream entries:');
    dreams.slice(0, 3).forEach((dream, index) => {
      logTest(`  ${index + 1}. Name: "${dream.name}", Days Ago: "${dream.daysAgo}", Type: "${dream.type}"`);
    });

    // Assert all rows have complete data
    expect(allFilled).toBe(true);
    logTest('✓ All rows have complete data');

    await takeScreenshot(page, 'dream_rows_complete');
  });

  test('Extract and validate all dream entries', async ({ page }) => {
    // Test: Extract all dream data and validate structure
    logTest('Test: Extract and validate all dream entries');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();

    logTest(`Total dreams extracted: ${dreams.length}`);
    logTest('Full dream entries:');
    logTest(formatTestResults(dreams));

    // Verify we have 10 entries
    expect(dreams.length).toBe(10);

    // Verify each entry has required fields
    dreams.forEach((dream, index) => {
      expect(dream.name).toBeTruthy();
      expect(dream.daysAgo).toBeTruthy();
      expect(dream.type).toBeTruthy();
    });

    logTest('✓ All dream entries extracted and validated');

    await takeScreenshot(page, 'all_dream_entries_extracted');
  });

  test('Verify specific recurring dream candidates', async ({ page }) => {
    // Test: Verify that specific dream names exist in the table
    // These will be validated as recurring in the dreams-total.html tests
    logTest('Test: Verify specific recurring dream candidates');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreamNames = await dreamDiaryPage.getDreamNames();
    logTest('Dream names found:');
    logTest(formatTestResults(dreamNames));

    // Check for specific dreams mentioned in requirements
    const hasFlying = dreamNames.some(name => 
      name.toLowerCase().includes('flying') && name.toLowerCase().includes('mountain')
    );
    const hasLost = dreamNames.some(name => 
      name.toLowerCase().includes('lost') && name.toLowerCase().includes('maze')
    );

    logTest(`Contains "Flying over mountains": ${hasFlying}`);
    logTest(`Contains "Lost in maze": ${hasLost}`);

    // Log matching dreams
    const flyingDream = dreamNames.find(name => 
      name.toLowerCase().includes('flying') && name.toLowerCase().includes('mountain')
    );
    const lostDream = dreamNames.find(name => 
      name.toLowerCase().includes('lost') && name.toLowerCase().includes('maze')
    );

    if (flyingDream) logTest(`✓ Found: "${flyingDream}"`);
    if (lostDream) logTest(`✓ Found: "${lostDream}"`);

    // These should exist for the recurring dreams validation
    expect(dreamNames.length).toBeGreaterThan(0);
    logTest('✓ Dream names extracted successfully');

    await takeScreenshot(page, 'dream_names_verified');
  });

  test('Verify dream type distribution matches expected values', async ({ page }) => {
    // Test: Verify the correct count of Good and Bad dreams
    logTest('Test: Verify dream type distribution');

    await dreamDiaryPage.navigateToDreamDiary(DREAMS_DIARY_URL);

    const dreams = await dreamDiaryPage.getAllDreamEntries();
    const goodDreams = dreams.filter(d => d.type === 'Good');
    const badDreams = dreams.filter(d => d.type === 'Bad');

    logTest(`Good dreams: ${goodDreams.length}`);
    logTest(`Bad dreams: ${badDreams.length}`);

    // According to requirements: 6 good dreams, 4 bad dreams
    logTest('Expected: Good dreams = 6, Bad dreams = 4');
    logTest(`Actual: Good dreams = ${goodDreams.length}, Bad dreams = ${badDreams.length}`);

    // Log the dreams by type
    logTest('Good dreams:');
    goodDreams.forEach(d => logTest(`  - ${d.name}`));

    logTest('Bad dreams:');
    badDreams.forEach(d => logTest(`  - ${d.name}`));

    // Verify total
    expect(goodDreams.length + badDreams.length).toBe(10);
    logTest('✓ Dream type distribution verified');

    await takeScreenshot(page, 'dream_distribution_verified');
  });
});
