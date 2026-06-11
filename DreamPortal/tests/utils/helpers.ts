/**
 * Test Helpers and Utilities
 * 
 * This file contains utility functions used across multiple test files.
 * It provides common functionality like:
 * - Screenshot capture for reporting
 * - Console logging helpers
 * - Data validation utilities
 * - Wait and retry logic
 */

import { Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Take a screenshot with a descriptive name for test reports
 * @param page - The Playwright page object
 * @param screenshotName - Descriptive name for the screenshot
 */
export async function takeScreenshot(page: Page, screenshotName: string): Promise<void> {
  try {
    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${screenshotName}-${timestamp}.png`;
    const filePath = path.join(screenshotDir, fileName);

    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved: ${filePath}`);
  } catch (error) {
    console.warn(`Failed to save screenshot: ${screenshotName}`, error);
  }
}

/**
 * Log test information with timestamp
 * @param message - The message to log
 * @param data - Optional data object to log
 */
export function logTest(message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * Retry a function with exponential backoff
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Initial delay in milliseconds
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed: ${lastError.message}`);

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Count occurrences of a value in an array
 * @param array - The array to search
 * @param value - The value to count
 * @returns number - The count of occurrences
 */
export function countOccurrences(array: string[], value: string): number {
  return array.filter(item => item === value).length;
}

/**
 * Get the frequency map of values in an array
 * @param array - The array to analyze
 * @returns Map<string, number> - Map of value to frequency
 */
export function getFrequencyMap(array: string[]): Map<string, number> {
  const frequencyMap = new Map<string, number>();

  array.forEach(item => {
    frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
  });

  return frequencyMap;
}

/**
 * Find duplicate elements in an array
 * @param array - The array to check for duplicates
 * @returns string[] - Array of duplicate values
 */
export function findDuplicates(array: string[]): string[] {
  const frequencyMap = getFrequencyMap(array);
  return Array.from(frequencyMap.entries())
    .filter(([_, count]) => count > 1)
    .map(([value, _]) => value);
}

/**
 * Wait for a condition to be true with timeout
 * @param condition - Function that returns boolean
 * @param timeoutMs - Timeout in milliseconds
 * @param checkIntervalMs - Interval to check condition
 */
export async function waitForCondition(
  condition: () => Promise<boolean> | boolean,
  timeoutMs: number = 5000,
  checkIntervalMs: number = 500
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const result = await Promise.resolve(condition());
    if (result) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
  }

  throw new Error(`Condition not met within ${timeoutMs}ms timeout`);
}

/**
 * Format test results object for logging
 * @param results - Object with test results
 * @returns string - Formatted result string
 */
export function formatTestResults(results: any): string {
  return JSON.stringify(results, null, 2);
}
