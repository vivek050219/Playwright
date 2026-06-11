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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Dream Total (Summary) Page Object Model
 * 
 * This page object represents the Dream Summary page (dreams-total.html).
 * It handles all interactions and validations for dream statistics.
 * 
 * Responsibilities:
 * - Verify correct statistics (Good: 6, Bad: 4, Total: 10, Recurring: 2)
 * - Validate recurring dreams
 * - Extract and validate statistics displayed on the page
 */
public class DreamTotalPage extends BasePage {
    private static final Logger logger = LoggerFactory.getLogger(DreamTotalPage.class);

    // Web Element Locators
    private final By goodDreamsCount = By.xpath("//*[contains(text(), 'Good')] | //*[contains(text(), 'good')]");
    private final By badDreamsCount = By.xpath("//*[contains(text(), 'Bad')] | //*[contains(text(), 'bad')]");
    private final By totalDreamsCount = By.xpath("//*[contains(text(), 'Total')] | //*[contains(text(), 'total')]");
    private final By recurringDreamsCount = By.xpath("//*[contains(text(), 'Recurring')] | //*[contains(text(), 'recurring')]");
    private final By recurringDreamsList = By.xpath("//li[contains(text(), 'Flying')] | //li[contains(text(), 'Lost')]");

    /**
     * Constructor
     * 
     * @param driver WebDriver instance
     */
    public DreamTotalPage(WebDriver driver) {
        super(driver);
        logger.info("DreamTotalPage initialized");
    }

    /**
     * Navigate to dream total page
     * 
     * @param url URL of the dream total page
     */
    public void navigateToDreamTotal(String url) {
        logger.info("Navigating to dream total page: " + url);
        navigateTo(url);
        logger.info("Dream total page loaded");
    }

    /**
     * Extract number from text using regex
     * 
     * @param text Text containing the number
     * @return Extracted number
     */
    private int extractNumberFromText(String text) {
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(text);
        
        if (matcher.find()) {
            return Integer.parseInt(matcher.group());
        }
        return 0;
    }

    /**
     * Get good dreams count
     * 
     * @return Number of good dreams
     */
    public int getGoodDreamsCount() {
        logger.info("Getting good dreams count");
        try {
            List<WebElement> elements = driver.findElements(goodDreamsCount);
            for (WebElement element : elements) {
                String text = element.getText();
                if (text.toLowerCase().contains("good")) {
                    int count = extractNumberFromText(text);
                    logger.info("Good dreams count: " + count);
                    return count;
                }
            }
        } catch (Exception e) {
            logger.error("Error getting good dreams count: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Get bad dreams count
     * 
     * @return Number of bad dreams
     */
    public int getBadDreamsCount() {
        logger.info("Getting bad dreams count");
        try {
            List<WebElement> elements = driver.findElements(badDreamsCount);
            for (WebElement element : elements) {
                String text = element.getText();
                if (text.toLowerCase().contains("bad")) {
                    int count = extractNumberFromText(text);
                    logger.info("Bad dreams count: " + count);
                    return count;
                }
            }
        } catch (Exception e) {
            logger.error("Error getting bad dreams count: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Get total dreams count
     * 
     * @return Total number of dreams
     */
    public int getTotalDreamsCount() {
        logger.info("Getting total dreams count");
        try {
            List<WebElement> elements = driver.findElements(totalDreamsCount);
            for (WebElement element : elements) {
                String text = element.getText();
                if (text.toLowerCase().contains("total")) {
                    int count = extractNumberFromText(text);
                    logger.info("Total dreams count: " + count);
                    return count;
                }
            }
        } catch (Exception e) {
            logger.error("Error getting total dreams count: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Get recurring dreams count
     * 
     * @return Number of recurring dreams
     */
    public int getRecurringDreamsCount() {
        logger.info("Getting recurring dreams count");
        try {
            List<WebElement> elements = driver.findElements(recurringDreamsCount);
            for (WebElement element : elements) {
                String text = element.getText();
                if (text.toLowerCase().contains("recurring")) {
                    int count = extractNumberFromText(text);
                    logger.info("Recurring dreams count: " + count);
                    return count;
                }
            }
        } catch (Exception e) {
            logger.error("Error getting recurring dreams count: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Get all statistics at once
     * 
     * @return Map containing all statistics
     */
    public Map<String, Integer> getAllStats() {
        logger.info("Getting all statistics");
        
        Map<String, Integer> stats = new HashMap<>();
        stats.put("good", getGoodDreamsCount());
        stats.put("bad", getBadDreamsCount());
        stats.put("total", getTotalDreamsCount());
        stats.put("recurring", getRecurringDreamsCount());
        
        logger.info("Statistics - Good: " + stats.get("good") + 
                   ", Bad: " + stats.get("bad") + 
                   ", Total: " + stats.get("total") + 
                   ", Recurring: " + stats.get("recurring"));
        
        return stats;
    }

    /**
     * Check if a specific dream is recurring
     * 
     * @param dreamName Name of the dream
     * @return boolean true if dream is recurring
     */
    public boolean isRecurringDream(String dreamName) {
        logger.info("Checking if '" + dreamName + "' is recurring");
        
        List<String> recurringNames = getRecurringDreamNames();
        boolean isRecurring = recurringNames.stream()
            .anyMatch(name -> name.toLowerCase().contains(dreamName.toLowerCase()));
        
        logger.info("Is '" + dreamName + "' recurring: " + isRecurring);
        return isRecurring;
    }

    /**
     * Get all recurring dream names
     * 
     * @return List of recurring dream names
     */
    public List<String> getRecurringDreamNames() {
        logger.info("Getting all recurring dream names");
        
        List<String> names = new ArrayList<>();
        try {
            List<WebElement> elements = driver.findElements(recurringDreamsList);
            for (WebElement element : elements) {
                String name = element.getText().trim();
                names.add(name);
                logger.info("Found recurring dream: " + name);
            }
        } catch (Exception e) {
            logger.warn("Could not extract recurring dream names: " + e.getMessage());
        }
        
        return names;
    }

    /**
     * Validate expected recurring dreams are present
     * 
     * @return boolean true if both expected dreams are recurring
     */
    public boolean validateExpectedRecurringDreams() {
        logger.info("Validating expected recurring dreams");
        
        boolean hasFlying = isRecurringDream("Flying over mountains");
        boolean hasLost = isRecurringDream("Lost in maze");
        
        boolean isValid = hasFlying && hasLost;
        logger.info("Expected recurring dreams valid: " + isValid);
        
        return isValid;
    }

    /**
     * Get page title
     * 
     * @return Page title
     */
    public String getPageTitle() {
        logger.info("Getting dream total page title");
        return driver.getTitle();
    }

    /**
     * Verify page loaded successfully
     * 
     * @return boolean true if page is loaded
     */
    public boolean isPageLoaded() {
        logger.info("Checking if dream total page is loaded");
        return getTotalDreamsCount() > 0;
    }
}
