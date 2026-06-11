/**
 * Playwright Configuration for Dream Portal Tests
 * 
 * This file configures Playwright test runner for the Dream Portal project.
 * It defines browser settings, timeouts, reporters, and test execution parameters.
 * 
 * Features:
 * - Multiple browser support (Chromium, Firefox, WebKit)
 * - HTML and screenshot reporting
 * - Automatic screenshot on failure
 * - Retry mechanism for flaky tests
 * - Parallel test execution
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables or use defaults
 */
const isCI = !!process.env.CI;

export default defineConfig({
  // Test directory where all test files are located
  testDir: './tests/specs',

  // Glob patterns to exclude from test discovery
  testIgnore: '**/utils/**',

  /**
   * Maximum time a test can run in milliseconds
   * Set to 60 seconds (60000 ms) to allow for AI operations
   */
  timeout: 60 * 1000,

  /**
   * Global setup/teardown timeout
   */
  globalSetup: undefined,
  globalTeardown: undefined,

  /**
   * Expect assertions timeout
   */
  expect: {
    /**
     * Maximum time an expect() assertion can take (milliseconds)
     */
    timeout: 5000,
  },

  /**
   * Test execution configuration
   */
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0, // Retry failed tests in CI environment
  workers: isCI ? 1 : undefined, // Single worker in CI, parallel locally

  /**
   * Output reporters
   * - html: Interactive HTML report
   * - list: Console output with test results
   * - junit: XML report for CI integration
   * - allure: Advanced Allure reporting
   */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
  ],

  /**
   * Shared browser settings for all projects
   */
  use: {
    /**
     * Base URL for navigation in tests
     * Tests can use page.goto('/path') which will prepend this URL
     */
    baseURL: 'https://arjitnigam.github.io/myDreams/',

    /**
     * Collect tracing for debugging failed tests
     * Generates trace.zip in test-results
     */
    trace: 'on-first-retry',

    /**
     * Screenshot on test failure
     * Saves screenshots in test-results/
     */
    screenshot: 'only-on-failure',

    /**
     * Video recording for failed tests
     */
    video: 'retain-on-failure',

    /**
     * Browser navigation timeout
     */
    navigationTimeout: 30000,

    /**
     * Action timeout (click, type, etc.)
     */
    actionTimeout: 10000,
  },

  /**
   * Configure test projects (browsers)
   * Currently configured to run ONLY on Chromium
   * Uncomment other browsers if you want to test on multiple browsers
   */
  projects: [
    // ✅ CHROMIUM - ACTIVE - All tests will run on Chromium (Chrome/Edge)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // ❌ DISABLED - Firefox browser tests (uncomment to enable)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // ❌ DISABLED - WebKit browser tests (uncomment to enable)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // ❌ DISABLED - Mobile browser testing (uncomment to enable)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // ❌ DISABLED - Mobile Safari testing (uncomment to enable)
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /**
   * Web server configuration (if needed)
   * Uncomment to auto-start a local server before tests
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
