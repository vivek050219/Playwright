package com.dreamportal.pages;

import com.dreamportal.utils.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Home Page Object Model
 * 
 * This page object represents the Dream Portal home page (index.html).
 * It encapsulates all selectors and methods for home page interactions.
 * 
 * Responsibilities:
 * - Verify loading animation appears and disappears
 * - Verify main content becomes visible
 * - Handle "My Dreams" button click
 * - Manage navigation to other pages
 */
public class HomePage extends BasePage {
    private static final Logger logger = LoggerFactory.getLogger(HomePage.class);

    // Web Element Locators
    private final By loadingAnimation = By.cssSelector("[class*='loader'], [class*='loading'], .spinner");
    private final By mainContent = By.cssSelector("main, [class*='content'], .container");
    private final By myDreamsButton = By.xpath("//button[contains(text(), 'My Dreams')] | //a[contains(text(), 'My Dreams')]");
    private final By pageHeading = By.xpath("//h1 | //h2[contains(text(), 'Dream')]");

    /**
     * Constructor
     * 
     * @param driver WebDriver instance
     */
    public HomePage(WebDriver driver) {
        super(driver);
        logger.info("HomePage initialized");
    }

    /**
     * Navigate to home page
     * 
     * @param url Base URL of the application
     */
    public void navigateToHome(String url) {
        logger.info("Navigating to home page: " + url);
        navigateTo(url);
        logger.info("Home page loaded");
    }

    /**
     * Check if loading animation is visible
     * 
     * @return boolean true if loading animation is visible
     */
    public boolean isLoadingAnimationVisible() {
        logger.info("Checking if loading animation is visible");
        return isElementDisplayed(loadingAnimation);
    }

    /**
     * Wait for loading animation to disappear
     * Expected timeout: ~3 seconds
     */
    public void waitForLoadingAnimationToDisappear() {
        logger.info("Waiting for loading animation to disappear");
        try {
            waitForElementToBeInvisible(loadingAnimation);
            logger.info("Loading animation disappeared");
        } catch (Exception e) {
            logger.warn("Loading animation not found or already disappeared: " + e.getMessage());
        }
    }

    /**
     * Check if main content is visible
     * 
     * @return boolean true if main content is visible
     */
    public boolean isMainContentVisible() {
        logger.info("Checking if main content is visible");
        return isElementDisplayed(mainContent);
    }

    /**
     * Check if page heading is visible (alternative check)
     * 
     * @return boolean true if heading is visible
     */
    public boolean isPageHeadingVisible() {
        logger.info("Checking if page heading is visible");
        return isElementDisplayed(pageHeading);
    }

    /**
     * Check if "My Dreams" button is visible
     * 
     * @return boolean true if button is visible
     */
    public boolean isMyDreamsButtonVisible() {
        logger.info("Checking if 'My Dreams' button is visible");
        return isElementDisplayed(myDreamsButton);
    }

    /**
     * Click on "My Dreams" button
     * This will open new tabs/windows for dreams-diary.html and dreams-total.html
     */
    public void clickMyDreamsButton() {
        logger.info("Clicking on 'My Dreams' button");
        click(myDreamsButton);
        logger.info("'My Dreams' button clicked");
    }

    /**
     * Get page title
     * 
     * @return Page title
     */
    public String getHomePageTitle() {
        logger.info("Getting home page title");
        return getPageTitle();
    }

    /**
     * Verify page structure (basic validation)
     * 
     * @return boolean true if page structure is valid
     */
    public boolean isPageStructureValid() {
        logger.info("Verifying page structure");
        int elementCount = getElementCount(By.tagName("body"));
        return elementCount > 0;
    }

    /**
     * Get current URL
     * 
     * @return Current page URL
     */
    public String getHomePageUrl() {
        logger.info("Getting home page URL");
        return getCurrentUrl();
    }
}
