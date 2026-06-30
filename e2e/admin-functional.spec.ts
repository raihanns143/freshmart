import { test, expect, Page } from '@playwright/test';

const ADMIN_EMAIL = 'qa-admin@freshmart-test.com';
const ADMIN_PASS = 'AdminTest123!';

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
}

test.describe('Admin Functional Basic', () => {
  test('Dashboard loads', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveTitle(/.+/);
  });
  
  test('Products page loads', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
  });

  test('Categories page loads', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
  });

  test('Coupons page loads', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/coupons');
    await page.waitForLoadState('networkidle');
  });
});
