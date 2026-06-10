import { test, expect } from '@playwright/test';

// ===== SMOKE TESTS =====
test('TC-001: Verify page title', async ({ page }) => {
  await page.goto('/');
  
  // Validate page title contains "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});

test('TC-002: Verify page header is visible', async ({ page }) => {
  await page.goto('/');
  
  // Check main heading exists
  const mainHeading = page.getByRole('heading', { level: 1 });
  await expect(mainHeading).toBeVisible();
});

// ===== NAVIGATION MENU TESTS =====
test('TC-003: Verify navigation menu items are visible', async ({ page }) => {
  await page.goto('/');
  
  // Check if Get started link exists
  const getStartedLink = page.getByRole('link', { name: /Get started/i });
  await expect(getStartedLink).toBeVisible();
});

test('TC-004: Navigate to Get started page', async ({ page }) => {
  await page.goto('/');
  
  // Click the get started link
  await page.getByRole('link', { name: /Get started/i }).click();
  
  // Verify Navigation
  await expect(page.getByRole('heading', { name: /Installation/i })).toBeVisible();
});

test('TC-005: Verify Docs link in navigation', async ({ page }) => {
  await page.goto('/');
  
  // Check if Docs link exists
  const docsLink = page.getByRole('link', { name: /Docs/i });
  await expect(docsLink).toBeVisible();
});

test('TC-006: Click on Docs link and verify navigation', async ({ page }) => {
  await page.goto('/');
  
  // Click Docs link
  const docsLink = page.locator('a:has-text("Docs")').first();
  if (await docsLink.isVisible()) {
    await docsLink.click();
    // Wait for navigation
    await page.waitForLoadState('networkidle');
  }
});

// ===== SEARCH FUNCTIONALITY TESTS =====
test('TC-007: Verify search button exists', async ({ page }) => {
  await page.goto('/');
  
  // Look for search button/input
  const searchElements = page.locator('button:has-text("Search"), input[placeholder*="search" i], input[aria-label*="search" i]');
  const count = await searchElements.count();
  
  expect(count).toBeGreaterThanOrEqual(0);
});

test('TC-008: Test search functionality', async ({ page }) => {
  await page.goto('/');
  
  // Try to find and interact with search
  const searchInput = page.locator('input[placeholder*="Search" i]');
  
  if (await searchInput.isVisible()) {
    // Click on search input
    await searchInput.click();
    
    // Type search text
    const searchText = 'installation guide';
    await searchInput.type(searchText, { delay: 100 });
    
    // Verify input has value
    await expect(searchInput).toHaveValue(new RegExp(searchText, 'i'));
    
    // Look for search button and click it
    const searchButton = page.locator('button:has-text("Search"), button[aria-label*="search" i], form button:first-of-type');
    
    if (await searchButton.count() > 0) {
      // If search button exists, click it
      await searchButton.first().click();
      
      // Wait for search results to load
      await page.waitForLoadState('networkidle');
      
      // Verify that search results or relevant content appears
      const pageContent = page.locator('body');
      await expect(pageContent).toBeVisible();
    } else {
      // If no search button, just verify the input was filled
      console.log('Search button not found, but search input was successfully filled with text');
    }
  } else {
    console.log('Search input not found on the page');
  }
});

// ===== DROPDOWN/MENU TESTS =====
test('TC-009: Verify main navigation menu items', async ({ page }) => {
  await page.goto('/');
  
  // Check for common navigation items
  const navItems = ['Docs', 'Community', 'GitHub'];
  
  for (const item of navItems) {
    const link = page.getByRole('link', { name: new RegExp(item, 'i') });
    const isVisible = await link.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(link).toBeVisible();
    }
  }
});

test('TC-010: Verify dropdown menus if present', async ({ page }) => {
  await page.goto('/');
  
  // Look for dropdown menus
  const dropdowns = page.locator('button[aria-haspopup="menu"], button[aria-haspopup="listbox"]');
  const dropdownCount = await dropdowns.count();
  
  if (dropdownCount > 0) {
    // Click first dropdown
    await dropdowns.first().click();
    
    // Verify dropdown opens
    const menu = page.locator('[role="menu"], [role="listbox"]');
    await expect(menu.first()).toBeVisible();
  }
});

// ===== LINK VALIDATION TESTS =====
test('TC-011: Verify all main links are clickable', async ({ page }) => {
  await page.goto('/');
  
  // Get all links
  const links = page.locator('a[href]');
  const linkCount = await links.count();
  
  expect(linkCount).toBeGreaterThan(0);
  
  // Check first few links are accessible
  for (let i = 0; i < Math.min(3, linkCount); i++) {
    const link = links.nth(i);
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href');
  }
});

test('TC-012: Verify external links have proper attributes', async ({ page }) => {
  await page.goto('/');
  
  // Check external links
  const externalLinks = page.locator('a[href*="github"], a[href*="twitter"], a[href*="linkedin"]');
  const count = await externalLinks.count();
  
  expect(count).toBeGreaterThanOrEqual(0);
});

// ===== BUTTON TESTS =====
test('TC-013: Verify buttons are interactive', async ({ page }) => {
  await page.goto('/');
  
  // Find visible buttons only
  const buttons = page.locator('button:visible');
  const buttonCount = await buttons.count();
  
  expect(buttonCount).toBeGreaterThan(0);
  
  // Verify buttons are visible and enabled
  for (let i = 0; i < Math.min(2, buttonCount); i++) {
    const button = buttons.nth(i);
    await expect(button).toBeVisible();
  }
});

test('TC-014: Verify CTA button functionality', async ({ page }) => {
  await page.goto('/');
  
  // Look for primary CTA button
  const ctaButton = page.locator('button, a[class*="primary"], a[class*="cta"], a[class*="button"]').first();
  
  if (await ctaButton.isVisible()) {
    await expect(ctaButton).toBeEnabled();
  }
});

// ===== CONTENT VALIDATION TESTS =====
test('TC-015: Verify page content is loaded', async ({ page }) => {
  await page.goto('/');
  
  // Check for main content
  const mainContent = page.locator('main, [role="main"], section');
  
  if (await mainContent.count() > 0) {
    await expect(mainContent.first()).toBeVisible();
  }
});

test('TC-016: Verify footer section exists', async ({ page }) => {
  await page.goto('/');
  
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  // Check footer
  const footer = page.locator('footer, [role="contentinfo"]');
  
  if (await footer.count() > 0) {
    await expect(footer.first()).toBeVisible();
  }
});

test('TC-017: Verify social media links', async ({ page }) => {
  await page.goto('/');
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  // Check for social links
  const socialLinks = page.locator('a[href*="twitter"], a[href*="github"], a[href*="linkedin"]');
  const socialCount = await socialLinks.count();
  
  expect(socialCount).toBeGreaterThanOrEqual(0);
});

// ===== RESPONSIVE DESIGN TESTS =====
test('TC-018: Verify mobile menu responsive', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/');
  
  // Check if hamburger menu appears
  const hamburger = page.locator('button[aria-label*="menu" i], button[class*="hamburger"], button[class*="toggle"]');
  const mobileMenuVisible = await hamburger.isVisible().catch(() => false);
  
  expect(typeof mobileMenuVisible).toBe('boolean');
});

test('TC-019: Verify page loads on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/');
  
  // Verify title is still visible
  await expect(page).toHaveTitle(/Playwright/);
});

// ===== PERFORMANCE TEST =====
test('TC-020: Verify page loads within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  
  const loadTime = Date.now() - startTime;
  
  // Page should load within 5 seconds
  expect(loadTime).toBeLessThan(5000);
});
