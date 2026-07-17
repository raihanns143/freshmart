import { test, expect } from "@playwright/test";

test.describe("View Deals Scroll Behavior", () => {
  test("Desktop Hero - smooth scrolls to Special Offers without page reload", async ({ page }) => {
    await page.goto("/");
    
    // Desktop Viewport
    await page.setViewportSize({ width: 1280, height: 900 });

    const viewDealsBtn = page.getByRole('button', { name: 'View Deals' }).first();
    await expect(viewDealsBtn).toBeVisible();
    
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    
    // Click View Deals
    await viewDealsBtn.click();
    
    // Wait for scroll animation
    await page.waitForTimeout(1000);
    
    // Verify it scrolled down
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
    
    // Verify the URL didn't change (no hash if same page)
    expect(page.url().endsWith("/")).toBeTruthy();
    
    // Verify the section is visible
    const specialOffersSection = page.locator('#special-offers');
    await expect(specialOffersSection).toBeInViewport();
  });

  test("Mobile Hero - smooth scrolls to Special Offers without page reload", async ({ page }) => {
    await page.goto("/");
    
    // Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const viewDealsBtn = page.getByRole('button', { name: 'View Deals' }).last();
    await expect(viewDealsBtn).toBeVisible();
    
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await viewDealsBtn.click();
    await page.waitForTimeout(1000);
    
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
    expect(page.url().endsWith("/")).toBeTruthy();
    
    const specialOffersSection = page.locator('#special-offers');
    await expect(specialOffersSection).toBeInViewport();
  });

  test("Cross-page navigation - navigates to Home then scrolls", async ({ page }) => {
    // Start on another page
    await page.goto("/shop");
    
    // Simulate clicking a View Deals button that might exist globally or just testing the hook
    // We can inject a mock button to test the hook behavior, or just test the URL manually
    await page.evaluate(() => {
      window.location.href = "/#special-offers";
    });
    
    // Wait for the page to navigate and the HomeSectionScroller to trigger
    await page.waitForURL("**/");
    await page.waitForTimeout(1500); // give time for hydration and scroll
    
    // Verify the section is visible
    const specialOffersSection = page.locator('#special-offers');
    await expect(specialOffersSection).toBeInViewport();
    
    // Verify the URL hash was cleaned up by replaceState
    expect(page.url().includes("#")).toBeFalsy();
  });
});
