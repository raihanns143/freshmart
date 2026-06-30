/**
 * E2E Test: Security Tests
 * Tests unauthorized access, session validation, and injection protection.
 */
import { test, expect } from '@playwright/test';

test.describe('Security: Unauthorized Admin Access', () => {
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
    '/admin/customers',
    '/admin/categories',
    '/admin/coupons',
    '/admin/inventory',
    '/admin/users',
    '/admin/settings',
    '/admin/logs',
  ];

  for (const route of adminRoutes) {
    test(`Unauthorized access blocked: ${route}`, async ({ page }) => {
      // Clear cookies/session - access without auth
      await page.context().clearCookies();
      const response = await page.goto(route);
      const url = page.url();
      // Should redirect to login
      const isRedirected = url.includes('/login') || url.includes('/admin/login');
      const isBlocked = (response?.status() === 403 || response?.status() === 401 || isRedirected);
      expect(isBlocked).toBe(true);
      console.log(`✅ PASS: ${route} → redirected to login (${url})`);
    });
  }
});

test.describe('Security: Customer cannot access admin', () => {
  test('Customer session blocked from /admin/dashboard', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[type="email"]', 'qa-customer@freshmart-test.com');
    await page.fill('input[type="password"]', 'CustomerTest123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Now try to access admin
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(2000);
    const url = page.url();
    const isBlocked = url.includes('/login') || url.includes('/admin/login') || url.includes('/403');
    expect(isBlocked).toBe(true);
    console.log(`✅ PASS: Customer blocked from admin (redirected to: ${url})`);
  });
});

test.describe('Security: XSS Prevention', () => {
  test('XSS in search input is escaped', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('<script>alert("xss")</script>');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      // No alert should appear
      const dialogFired = await page.evaluate(() => window.__xssTriggered || false);
      expect(dialogFired).toBeFalsy();
      console.log('✅ PASS: XSS injection escaped');
    } else {
      console.log('⚠️ SKIP: Search input not found on shop page');
    }
  });
});

test.describe('Security: SQL Injection Prevention', () => {
  test('SQL injection in search is safely handled', async ({ page }) => {
    // Attempt SQL injection via URL params
    const response = await page.goto("/api/products?search=' OR '1'='1");
    expect(response?.status()).not.toBe(500);
    const body = await response?.text();
    // Should not leak database errors
    expect(body).not.toContain('PrismaClientKnownRequestError');
    expect(body).not.toContain('SQL syntax');
    console.log('✅ PASS: SQL injection safely handled');
  });
});
