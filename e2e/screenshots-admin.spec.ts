/**
 * E2E Test: Screenshots - All Admin Pages
 * Captures full-page desktop screenshots of all admin modules.
 */
import { test, expect, Page } from '@playwright/test';
import path from 'path';

const ADMIN_EMAIL = 'qa-admin@freshmart-test.com';
const ADMIN_PASS = 'AdminTest123!';
const SCREENSHOT_DIR = path.join('QA', 'screenshots', 'desktop');

// Helper: login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
}

test.describe('Admin Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  const adminPages = [
    { name: 'dashboard', path: '/admin/dashboard' },
    { name: 'products', path: '/admin/products' },
    { name: 'products-new', path: '/admin/products/new' },
    { name: 'categories', path: '/admin/categories' },
    { name: 'orders', path: '/admin/orders' },
    { name: 'customers', path: '/admin/customers' },
    { name: 'coupons', path: '/admin/coupons' },
    { name: 'inventory', path: '/admin/inventory' },
    { name: 'reviews', path: '/admin/reviews' },
    { name: 'analytics', path: '/admin/analytics' },
    { name: 'reports', path: '/admin/reports' },
    { name: 'media-library', path: '/admin/media' },
    { name: 'users', path: '/admin/users' },
    { name: 'settings', path: '/admin/settings' },
    { name: 'activity-logs', path: '/admin/logs' },
  ];

  for (const { name, path: pagePath } of adminPages) {
    test(`screenshot: ${name}`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/admin-${name}.png`,
        fullPage: true,
      });
      console.log(`📸 Captured: admin-${name}.png`);
    });
  }
});

test.describe('Admin Login Screenshot', () => {
  test('screenshot: admin-login', async ({ page }) => {
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/admin-login.png`,
      fullPage: true,
    });
  });
});
