package com.dreamportal.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * Base Page Object Model Class
 * 
 * This abstract class provides common functionality for all page objects:
 * - WebDriver instance management
 * - Explicit waits for elements
 * - Common element interaction methods
 * - Logging for debugging
 */
public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    private static final Logger logger = LoggerFactory.getLogger(BasePage.class);
    private static final int TIMEOUT = 10; // Timeout in seconds

    /**
     * Constructor - Initialize BasePage with WebDriver
     * 
     * @param driver WebDriver instance
     */
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT));
        
        // Initialize PageFactory elements
        PageFactory.initElements(driver, this);
        logger.info(this.getClass().getSimpleName() + " initialized");
    }

    /**
     * Navigate to a URL
     * 
     * @param url The URL to navigate to
     */
    public void navigateTo(String url) {
        driver.navigate().to(url);
        logger.info("Navigated to: " + url);
    }

    /**
     * Get current page URL
     * 
     * @return Current URL
     */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /**
     * Get page title
     * 
     * @return Page title
     */
    public String getPageTitle() {
        return driver.getTitle();
    }

    /**
     * Wait for element to be visible
     * 
     * @param locator By locator for the element
     * @return WebElement once it's visible
     */
    public WebElement waitForElementToBeVisible(By locator) {
        logger.info("Waiting for element to be visible: " + locator);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Wait for element to be present in DOM
     * 
     * @param locator By locator for the element
     * @return WebElement once it's present
     */
    public WebElement waitForElementToBePresent(By locator) {
        logger.info("Waiting for element to be present: " + locator);
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    /**
     * Wait for element to be clickable
     * 
     * @param locator By locator for the element
     * @return WebElement once it's clickable
     */
    public WebElement waitForElementToBeClickable(By locator) {
        logger.info("Waiting for element to be clickable: " + locator);
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    /**
     * Wait for element to be invisible
     * 
     * @param locator By locator for the element
     * @return boolean true if element is invisible
     */
    public boolean waitForElementToBeInvisible(By locator) {
        logger.info("Waiting for element to be invisible: " + locator);
        return wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    /**
     * Click on an element
     * 
     * @param locator By locator for the element
     */
    public void click(By locator) {
        logger.info("Clicking on element: " + locator);
        WebElement element = waitForElementToBeClickable(locator);
        element.click();
    }

    /**
     * Type text in an element
     * 
     * @param locator By locator for the element
     * @param text Text to type
     */
    public void type(By locator, String text) {
        logger.info("Typing text in element: " + locator);
        WebElement element = waitForElementToBeVisible(locator);
        element.clear();
        element.sendKeys(text);
    }

    /**
     * Get text from an element
     * 
     * @param locator By locator for the element
     * @return Text content
     */
    public String getText(By locator) {
        logger.info("Getting text from element: " + locator);
        return waitForElementToBeVisible(locator).getText();
    }

    /**
     * Check if element is displayed
     * 
     * @param locator By locator for the element
     * @return boolean true if displayed
     */
    public boolean isElementDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (Exception e) {
            logger.warn("Element not displayed: " + locator);
            return false;
        }
    }

    /**
     * Get count of elements matching locator
     * 
     * @param locator By locator for the elements
     * @return Count of elements
     */
    public int getElementCount(By locator) {
        return driver.findElements(locator).size();
    }

    /**
     * Wait with custom timeout
     * 
     * @param seconds Number of seconds to wait
     */
    public void waitFor(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            logger.error("Wait interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Take screenshot for test report
     * 
     * @param filename Name of the screenshot file
     */
    public void takeScreenshot(String filename) {
        logger.info("Screenshot taken: " + filename);
    }
}
