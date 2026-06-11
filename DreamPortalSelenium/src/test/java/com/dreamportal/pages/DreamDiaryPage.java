package com.dreamportal.pages;

import com.dreamportal.utils.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dream Diary Page Object Model
 * 
 * This page object represents the Dream Log Table page (dreams-diary.html).
 * It handles all interactions and validations for the dream diary table.
 * 
 * Responsibilities:
 * - Validate exactly 10 dream entries exist
 * - Verify dream types are only "Good" or "Bad"
 * - Ensure all columns are properly filled
 * - Extract dream data for further validation
 */
public class DreamDiaryPage extends BasePage {
    private static final Logger logger = LoggerFactory.getLogger(DreamDiaryPage.class);

    // Web Element Locators
    private final By dreamTable = By.cssSelector("table, [role='table']");
    private final By dreamTableRows = By.cssSelector("table tbody tr, table tr:not(:first-child)");
    private final By dreamNameCell = By.xpath(".//td[1]");
    private final By dreamDaysAgoCell = By.xpath(".//td[2]");
    private final By dreamTypeCell = By.xpath(".//td[3]");

    /**
     * Constructor
     * 
     * @param driver WebDriver instance
     */
    public DreamDiaryPage(WebDriver driver) {
        super(driver);
        logger.info("DreamDiaryPage initialized");
    }

    /**
     * Navigate to dream diary page
     * 
     * @param url URL of the dream diary page
     */
    public void navigateToDreamDiary(String url) {
        logger.info("Navigating to dream diary page: " + url);
        navigateTo(url);
        logger.info("Dream diary page loaded");
    }

    /**
     * Get total count of dream entries
     * 
     * @return Number of dream entries in the table
     */
    public int getDreamCount() {
        logger.info("Getting total dream count");
        int count = getElementCount(dreamTableRows);
        logger.info("Total dreams found: " + count);
        return count;
    }

    /**
     * Get all dream entries from the table
     * 
     * @return List of dream maps containing name, daysAgo, and type
     */
    public List<Map<String, String>> getAllDreamEntries() {
        logger.info("Extracting all dream entries from table");
        
        List<Map<String, String>> dreamEntries = new ArrayList<>();
        List<WebElement> rows = driver.findElements(dreamTableRows);
        
        for (WebElement row : rows) {
            try {
                String name = row.findElement(dreamNameCell).getText().trim();
                String daysAgo = row.findElement(dreamDaysAgoCell).getText().trim();
                String type = row.findElement(dreamTypeCell).getText().trim();
                
                Map<String, String> dreamEntry = new HashMap<>();
                dreamEntry.put("name", name);
                dreamEntry.put("daysAgo", daysAgo);
                dreamEntry.put("type", type);
                
                dreamEntries.add(dreamEntry);
                logger.info("Extracted dream: " + name + " | " + type);
            } catch (Exception e) {
                logger.warn("Failed to extract dream entry: " + e.getMessage());
            }
        }
        
        logger.info("Total dreams extracted: " + dreamEntries.size());
        return dreamEntries;
    }

    /**
     * Validate that all dream types are "Good" or "Bad"
     * 
     * @param dreamEntries List of dream entries
     * @return boolean true if all types are valid
     */
    public boolean validateDreamTypes(List<Map<String, String>> dreamEntries) {
        logger.info("Validating dream types");
        
        for (Map<String, String> dream : dreamEntries) {
            String type = dream.get("type");
            if (!type.equals("Good") && !type.equals("Bad")) {
                logger.error("Invalid dream type found: " + type);
                return false;
            }
        }
        
        logger.info("All dream types are valid (Good or Bad)");
        return true;
    }

    /**
     * Validate that all rows have all three columns filled
     * 
     * @param dreamEntries List of dream entries
     * @return boolean true if all rows have complete data
     */
    public boolean validateAllColumnsAreFilled(List<Map<String, String>> dreamEntries) {
        logger.info("Validating that all columns are filled");
        
        for (Map<String, String> dream : dreamEntries) {
            if (dream.get("name").isEmpty() || 
                dream.get("daysAgo").isEmpty() || 
                dream.get("type").isEmpty()) {
                logger.error("Found empty column in dream entry: " + dream);
                return false;
            }
        }
        
        logger.info("All rows have complete data");
        return true;
    }

    /**
     * Get all dream names from the table
     * 
     * @return List of dream names
     */
    public List<String> getDreamNames() {
        logger.info("Extracting all dream names");
        List<String> names = new ArrayList<>();
        
        for (Map<String, String> dream : getAllDreamEntries()) {
            names.add(dream.get("name"));
        }
        
        logger.info("Dream names extracted: " + names.size());
        return names;
    }

    /**
     * Get all dream types from the table
     * 
     * @return List of dream types
     */
    public List<String> getDreamTypes() {
        logger.info("Extracting all dream types");
        List<String> types = new ArrayList<>();
        
        for (Map<String, String> dream : getAllDreamEntries()) {
            types.add(dream.get("type"));
        }
        
        logger.info("Dream types extracted: " + types.size());
        return types;
    }

    /**
     * Count good dreams
     * 
     * @return Number of good dreams
     */
    public int countGoodDreams() {
        List<String> types = getDreamTypes();
        int count = (int) types.stream().filter(t -> t.equals("Good")).count();
        logger.info("Good dreams count: " + count);
        return count;
    }

    /**
     * Count bad dreams
     * 
     * @return Number of bad dreams
     */
    public int countBadDreams() {
        List<String> types = getDreamTypes();
        int count = (int) types.stream().filter(t -> t.equals("Bad")).count();
        logger.info("Bad dreams count: " + count);
        return count;
    }

    /**
     * Get page title
     * 
     * @return Page title
     */
    public String getPageTitle() {
        logger.info("Getting dream diary page title");
        return driver.getTitle();
    }

    /**
     * Verify page loaded successfully
     * 
     * @return boolean true if table is visible
     */
    public boolean isPageLoaded() {
        logger.info("Checking if dream diary page is loaded");
        return isElementDisplayed(dreamTable);
    }
}
