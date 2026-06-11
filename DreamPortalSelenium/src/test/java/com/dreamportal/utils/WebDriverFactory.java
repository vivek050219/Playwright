package com.dreamportal.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * WebDriver Factory - Manages WebDriver initialization
 * 
 * This utility class is responsible for:
 * - Setting up WebDriver for Chrome browser
 * - Managing ChromeDriver options
 * - Creating and destroying WebDriver instances
 */
public class WebDriverFactory {
    private static final Logger logger = LoggerFactory.getLogger(WebDriverFactory.class);

    /**
     * Initialize Chrome WebDriver
     * 
     * @return WebDriver instance configured for Chrome
     */
    public static WebDriver initializeDriver() {
        logger.info("Initializing Chrome WebDriver...");
        
        // Setup WebDriverManager to manage ChromeDriver automatically
        WebDriverManager.chromedriver().setup();
        
        // Configure Chrome options
        ChromeOptions options = new ChromeOptions();
        
        // Optional: Run in headless mode (uncomment to disable GUI)
        // options.addArguments("--headless");
        
        // Disable notifications
        options.addArguments("--disable-notifications");
        
        // Disable popups
        options.addArguments("--disable-popup-blocking");
        
        // Disable infobars
        options.addArguments("--disable-infobars");
        
        // Accept insecure certificates
        options.setAcceptInsecureCerts(true);
        
        // Initialize ChromeDriver
        WebDriver driver = new ChromeDriver(options);
        
        logger.info("Chrome WebDriver initialized successfully");
        
        // Maximize window
        driver.manage().window().maximize();
        logger.info("Browser window maximized");
        
        return driver;
    }

    /**
     * Quit WebDriver and close browser
     * 
     * @param driver WebDriver instance to quit
     */
    public static void quitDriver(WebDriver driver) {
        if (driver != null) {
            driver.quit();
            logger.info("WebDriver quit successfully");
        }
    }
}
