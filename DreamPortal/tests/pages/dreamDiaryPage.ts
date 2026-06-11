/**
 * Dream Diary Page Object Model
 * 
 * This file contains the page object for the Dream Log Table page (dreams-diary.html).
 * It handles all interactions and validations for the dream diary table.
 * 
 * Responsibilities:
 * - Validate the number of dream entries (should be exactly 10)
 * - Verify dream types are only "Good" or "Bad"
 * - Ensure each row has all three columns filled: Dream Name, Days Ago, Dream Type
 * - Extract dream data for further validation
 */

import { Page, Locator } from '@playwright/test';

export interface DreamEntry {
  name: string;
  daysAgo: string;
  type: string;
}

export class DreamDiaryPage {
  readonly page: Page;
  readonly dreamTable: Locator;
  readonly dreamRows: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Define selectors for dream diary table elements
    this.dreamTable = page.locator('table, [role="table"]');
    this.dreamRows = page.locator('table tbody tr, [role="table"] [role="row"]');
  }

  /**
   * Navigate to the dream diary page
   * @param url - The URL of the dream diary page
   */
  async navigateToDreamDiary(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the total number of dream entries
   * @returns number - The count of dream entries
   */
  async getDreamCount(): Promise<number> {
    return await this.dreamRows.count();
  }

  /**
   * Get all dream entries from the table
   * @returns DreamEntry[] - Array of dream entries with name, daysAgo, and type
   */
  async getAllDreamEntries(): Promise<DreamEntry[]> {
    const count = await this.getDreamCount();
    const dreams: DreamEntry[] = [];

    for (let i = 0; i < count; i++) {
      const row = this.dreamRows.nth(i);
      
      // Get all cells in the row
      const cells = row.locator('td, [role="gridcell"]');
      
      if (await cells.count() >= 3) {
        const name = await cells.nth(0).textContent().then(t => t?.trim() || '');
        const daysAgo = await cells.nth(1).textContent().then(t => t?.trim() || '');
        const type = await cells.nth(2).textContent().then(t => t?.trim() || '');

        dreams.push({ name, daysAgo, type });
      }
    }

    return dreams;
  }

  /**
   * Validate that all dream types are either "Good" or "Bad"
   * @param dreams - Array of dream entries to validate
   * @returns boolean - True if all dream types are valid
   */
  validateDreamTypes(dreams: DreamEntry[]): boolean {
    return dreams.every(dream => 
      dream.type === 'Good' || dream.type === 'Bad'
    );
  }

  /**
   * Validate that all rows have all three columns filled
   * @param dreams - Array of dream entries to validate
   * @returns boolean - True if all rows have complete data
   */
  validateAllColumnsAreFilled(dreams: DreamEntry[]): boolean {
    return dreams.every(dream =>
      dream.name.length > 0 && 
      dream.daysAgo.length > 0 && 
      dream.type.length > 0
    );
  }

  /**
   * Get all dream names from the table
   * @returns string[] - Array of dream names
   */
  async getDreamNames(): Promise<string[]> {
    const dreams = await this.getAllDreamEntries();
    return dreams.map(d => d.name);
  }

  /**
   * Get all dream types from the table
   * @returns string[] - Array of dream types
   */
  async getDreamTypes(): Promise<string[]> {
    const dreams = await this.getAllDreamEntries();
    return dreams.map(d => d.type);
  }
}
