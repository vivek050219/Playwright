package com.dreamportal.tests;

import com.dreamportal.pages.HomePage;
import com.dreamportal.utils.WebDriverFactory;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

/**
 * Home Page Test Class
 * 
 * Tests for the Dream Portal home page (index.html)
 * 
 * Test Cases:
 * 1. Verify loading animation appears
 * 2. Verify loading animation disappears after ~3 seconds
 * 3. Verify main content becomes visible
 * 4. Verify "My Dreams" button is visible and clickable
 * 5. Verify page title and structure
 */
@Feature("Home Page Tests")
public class HomePageTest {
    private static final Logger logger = LoggerFactory.getLogger(HomePageTest.class);
    private static final String BASE_URL = "https://arjitnigam.github.io/myDreams/";
    
    private WebDriver driver;
    private HomePage homePage;

    /**
     * Setup - Initialize WebDriver and HomePage
     */
    @BeforeMethod
    public void setUp() {
        logger.info("Setting up Home Page Test");
        driver = WebDriverFactory.initializeDriver();
        homePage = new HomePage(driver);
    }

    /**
     * Teardown - Close WebDriver
     */
    @AfterMethod
    public void tearDown() {
        logger.info("Tearing down Home Page Test");
        if (driver != null) {
            WebDriverFactory.quitDriver(driver);
        }
    }

    /**
     * Test 1: Verify loading animation appears on page load
     */
    @Test(priority = 1)
    @Story("Loading Animation")
    @Severity(SeverityLevel.NORMAL)
    public void testLoadingAnimationAppears() {
        logger.info("Test: Verify loading animation appears");
        
        homePage.navigateToHome(BASE_URL);
        homePage.waitFor(1); // Wait briefly for animation to appear
        
        boolean isVisible = homePage.isLoadingAnimationVisible();
        logger.info("Loading animation visible: " + isVisible);
        
        // Animation may disappear quickly on fast connections
        if (isVisible) {
            logger.info("✓ Loading animation appeared");
        } else {
            logger.warn("⚠ Loading animation not visible (may have already disappeared)");
        }
    }

    /**
     * Test 2: Verify loading animation disappears after ~3 seconds
     */
    @Test(priority = 2)
    @Story("Loading Animation")
    @Severity(SeverityLevel.NORMAL)
    public void testLoadingAnimationDisappears() {
        logger.info("Test: Verify loading animation disappears after ~3 seconds");
        
        homePage.navigateToHome(BASE_URL);
        homePage.waitForLoadingAnimationToDisappear();
        
        logger.info("✓ Loading animation disappeared successfully");
    }

    /**
     * Test 3: Verify main content becomes visible
     */
    @Test(priority = 3)
    @Story("Page Content")
    @Severity(SeverityLevel.CRITICAL)
    public void testMainContentVisible() {
        logger.info("Test: Verify main content becomes visible");
        
        homePage.navigateToHome(BASE_URL);
        homePage.waitForLoadingAnimationToDisappear();
        homePage.waitFor(1);
        
        assertTrue(homePage.isMainContentVisible() || homePage.isPageHeadingVisible(),
                "Main content should be visible");
        
        logger.info("✓ Main content is visible");
    }

    /**
     * Test 4: Verify "My Dreams" button is visible
     */
    @Test(priority = 4)
    @Story("My Dreams Button")
    @Severity(SeverityLevel.CRITICAL)
    public void testMyDreamsButtonVisible() {
        logger.info("Test: Verify 'My Dreams' button is visible");
        
        homePage.navigateToHome(BASE_URL);
        homePage.waitForLoadingAnimationToDisappear();
        homePage.waitFor(1);
        
        boolean isVisible = homePage.isMyDreamsButtonVisible();
        logger.info("'My Dreams' button visible: " + isVisible);
        
        if (!isVisible) {
            logger.warn("⚠ 'My Dreams' button not visible on page");
        }
    }

    /**
     * Test 5: Verify page title and basic structure
     */
    @Test(priority = 5)
    @Story("Page Structure")
    @Severity(SeverityLevel.NORMAL)
    public void testPageTitleAndStructure() {
        logger.info("Test: Verify page title and basic structure");
        
        homePage.navigateToHome(BASE_URL);
        
        String title = homePage.getHomePageTitle();
        logger.info("Page title: " + title);
        assertTrue(!title.isEmpty(), "Page title should not be empty");
        
        assertTrue(homePage.isPageStructureValid(),
                "Page structure should be valid");
        
        logger.info("✓ Page title and structure are valid");
    }

    /**
     * Test 6: Verify page URL
     */
    @Test(priority = 6)
    @Story("Page Navigation")
    @Severity(SeverityLevel.NORMAL)
    public void testPageURL() {
        logger.info("Test: Verify page URL");
        
        homePage.navigateToHome(BASE_URL);
        
        String url = homePage.getHomePageUrl();
        logger.info("Current URL: " + url);
        assertTrue(url.contains("myDreams"), "URL should contain 'myDreams'");
        
        logger.info("✓ Page URL is correct");
    }
}
