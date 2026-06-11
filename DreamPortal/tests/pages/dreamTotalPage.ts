/**
 * Dream Total Page Object Model
 * 
 * This file contains the page object for the Dream Summary page (dreams-total.html).
 * It handles all interactions and validations for dream statistics.
 * 
 * Responsibilities:
 * - Verify the correct statistics: Good Dreams (6), Bad Dreams (4), Total Dreams (10)
 * - Validate Recurring Dreams count (2)
 * - Verify that "Flying over mountains" and "Lost in maze" are counted as recurring
 * - Extract and validate all statistics displayed on the page
 */

import { Page, Locator } from '@playwright/test';

export interface DreamStats {
  goodDreams: number;
  badDreams: number;
  totalDreams: number;
  recurringDreams: number;
  recurringDreamNames?: string[];
}

export class DreamTotalPage {
  readonly page: Page;
  readonly goodDreamsCount: Locator;
  readonly badDreamsCount: Locator;
  readonly totalDreamsCount: Locator;
  readonly recurringDreamsCount: Locator;
  readonly recurringDreamsList: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Define selectors for dream statistics elements
    // The page has a table with statistics where each row has Dream Type and Total Count columns
    // We locate the row containing the text, then get the cell value from the second column
    this.goodDreamsCount = page.locator('table tbody tr').filter({ hasText: /Good Dreams/i }).locator('td:nth-child(2)');
    this.badDreamsCount = page.locator('table tbody tr').filter({ hasText: /Bad Dreams/i }).locator('td:nth-child(2)');
    this.totalDreamsCount = page.locator('table tbody tr').filter({ hasText: /Total Dreams/i }).locator('td:nth-child(2)');
    this.recurringDreamsCount = page.locator('table tbody tr').filter({ hasText: /Recurring Dreams/i }).locator('td:nth-child(2)');
    this.recurringDreamsList = page.locator('[class*="recurring"] li, [id*="recurring"] li, [data-testid*="recurring"] li');
  }

  /**
   * Navigate to the dream total page
   * @param url - The URL of the dream total/summary page
   */
  async navigateToDreamTotal(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the number of good dreams displayed
   * @returns number - Count of good dreams
   */
  async getGoodDreamsCount(): Promise<number> {
    return await this.extractNumberFromText(this.goodDreamsCount);
  }

  /**
   * Get the number of bad dreams displayed
   * @returns number - Count of bad dreams
   */
  async getBadDreamsCount(): Promise<number> {
    return await this.extractNumberFromText(this.badDreamsCount);
  }

  /**
   * Get the total number of dreams displayed
   * @returns number - Total count of dreams
   */
  async getTotalDreamsCount(): Promise<number> {
    return await this.extractNumberFromText(this.totalDreamsCount);
  }

  /**
   * Get the number of recurring dreams displayed
   * @returns number - Count of recurring dreams
   */
  async getRecurringDreamsCount(): Promise<number> {
    return await this.extractNumberFromText(this.recurringDreamsCount);
  }

  /**
   * Helper method to extract numbers from text content
   * @param locator - The element locator containing the number
   * @returns number - The extracted number
   */
  private async extractNumberFromText(locator: Locator): Promise<number> {
    try {
      const text = await locator.textContent();
      if (!text) return 0;
      
      // Extract the first number found in the text
      const match = text.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    } catch (error) {
      console.warn('Error extracting number from text:', error);
      return 0;
    }
  }

  /**
   * Get all recurring dream names
   * @returns string[] - Array of recurring dream names
   */
  async getRecurringDreamNames(): Promise<string[]> {
    try {
      const count = await this.recurringDreamsList.count();
      const names: string[] = [];

      for (let i = 0; i < count; i++) {
        const name = await this.recurringDreamsList.nth(i).textContent();
        if (name) {
          names.push(name.trim());
        }
      }

      return names;
    } catch (error) {
      // If recurring dreams list is not found on the page, return empty array
      console.warn('Recurring dreams list not found on page:', error);
      return [];
    }
  }

  /**
   * Get all dream statistics at once
   * @returns DreamStats - Object containing all statistics
   */
  async getAllStats(): Promise<DreamStats> {
    return {
      goodDreams: await this.getGoodDreamsCount(),
      badDreams: await this.getBadDreamsCount(),
      totalDreams: await this.getTotalDreamsCount(),
      recurringDreams: await this.getRecurringDreamsCount(),
      recurringDreamNames: await this.getRecurringDreamNames()
    };
  }

  /**
   * Validate that a specific dream is in the recurring dreams list
   * Note: This method looks for the dream name on the page if it's displayed,
   * otherwise returns false (the dream might be recurring in data but not displayed on summary)
   * @param dreamName - The name of the dream to find
   * @returns boolean - True if the dream is in the recurring list displayed on page
   */
  async isRecurringDream(dreamName: string): Promise<boolean> {
    try {
      const recurringNames = await this.getRecurringDreamNames();
      if (recurringNames.length === 0) {
        // Recurring dreams list not displayed on page
        // Return false - the validation should be done through data comparison
        return false;
      }
      return recurringNames.some(name => 
        name.toLowerCase().includes(dreamName.toLowerCase())
      );
    } catch (error) {
      console.warn(`Error checking if "${dreamName}" is recurring:`, error);
      return false;
    }
  }

  /**
   * Validate that the expected recurring dreams are present
   * @returns boolean - True if both "Flying over mountains" and "Lost in maze" are recurring
   */
  async validateExpectedRecurringDreams(): Promise<boolean> {
    const isFlying = await this.isRecurringDream('Flying over mountains');
    const isLost = await this.isRecurringDream('Lost in maze');
    return isFlying && isLost;
  }

  /**
   * Calculate recurring dreams from dream entries
   * A dream is recurring if it appears more than once
   * @param dreams - Array of dream entries
   * @returns string[] - Array of unique recurring dream names
   */
  getRecurringDreamsFromData(dreams: any[]): string[] {
    const dreamCounts: { [key: string]: number } = {};
    
    // Count occurrences of each dream name
    dreams.forEach(dream => {
      dreamCounts[dream.name] = (dreamCounts[dream.name] || 0) + 1;
    });
    
    // Return dreams that appear more than once
    return Object.keys(dreamCounts).filter(name => dreamCounts[name] > 1);
  }

  /**
   * Verify that expected recurring dreams exist in the given dream data
   * @param dreams - Array of dream entries
   * @returns boolean - True if both expected recurring dreams are found
   */
  validateExpectedRecurringDreamsInData(dreams: any[]): boolean {
    const recurringDreams = this.getRecurringDreamsFromData(dreams);
    
    const hasFlying = recurringDreams.some(name =>
      name.toLowerCase().includes('flying') && name.toLowerCase().includes('mountain')
    );
    const hasLost = recurringDreams.some(name =>
      name.toLowerCase().includes('lost') && name.toLowerCase().includes('maze')
    );
    
    return hasFlying && hasLost;
  }
}
