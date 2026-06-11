/**
 * HomePage Page Object Model
 * 
 * This file contains the page object for the Dream Portal home page (index.html).
 * It encapsulates all selectors and methods related to the home page interactions.
 * 
 * Responsibilities:
 * - Verify loading animation appears and disappears
 * - Verify main content visibility
 * - Handle "My Dreams" button click to open new tabs
 */

import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loadingAnimation: Locator;
  readonly mainContent: Locator;
  readonly myDreamsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Define selectors for the home page elements
    // The page has a loading animation at first, then main content appears
    this.loadingAnimation = page.locator('text=/Loading/i, [class*="loading"], [id*="loading"]').first();
    this.mainContent = page.locator('main').first();
    this.myDreamsButton = page.getByRole('button', { name: /my dreams/i });
  }

  /**
   * Navigate to the home page
   * @param url - The URL of the dream portal home page
   */
  async navigateToHome(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Check if the loading animation is visible
   * @returns boolean - True if loading animation is visible
   */
  async isLoadingAnimationVisible(): Promise<boolean> {
    return await this.loadingAnimation.isVisible().catch(() => false);
  }

  /**
   * Wait for loading animation to disappear
   * This is typically expected to happen after ~3 seconds
   */
  async waitForLoadingAnimationToDisappear(): Promise<void> {
    await this.loadingAnimation.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /**
   * Check if main content is visible
   * @returns boolean - True if main content is visible
   */
  async isMainContentVisible(): Promise<boolean> {
    try {
      // Check if the main element or heading is visible
      const mainVisible = await this.mainContent.isVisible().catch(() => false);
      const headingVisible = await this.page.locator('h1:has-text("Dream Portal")').first().isVisible().catch(() => false);
      return mainVisible || headingVisible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click on the "My Dreams" button
   * This button opens dreams-diary.html and dreams-total.html in new tabs/windows
   */
  async clickMyDreamsButton(): Promise<void> {
    await this.myDreamsButton.click();
  }

  /**
   * Wait for new page/tab to open and get page reference
   * @returns Page - The newly opened page
   */
  async waitForNewPageAndReturn(): Promise<Page> {
    const newPagePromise = this.page.context().waitForEvent('page');
    const newPage = await newPagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
