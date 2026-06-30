/**
 * E2E Test: Mobile Screenshots at all required viewports
 */
import { test, Page } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = path.join('QA', 'screenshots', 'mobile');

const VIEWPORTS = [
  { name: '320px', width: 320, height: 812 },
  { name: '360px', width: 360, height: 780 },
  { name: '375px', width: 375, height: 812 },
  { name: '390px', width: 390, height: 844 },
  { name: '414px', width: 414, height: 896 },
  { name: '430px', width: 430, height: 932 },
];

const PAGES_TO_TEST = [
  { name: 'homepage', path: '/' },
  { name: 'shop', path: '/shop' },
  { name: 'cart', path: '/cart' },
  { name: 'login', path: '/login' },
];

for (const viewport of VIEWPORTS) {
  test.describe(`Mobile ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pg of PAGES_TO_TEST) {
      test(`${viewport.name} - ${pg.name}`, async ({ page }) => {
        await page.goto(pg.path);
        await page.waitForLoadState('networkidle');

        // Check for horizontal scroll
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth;
        });
        if (hasHorizontalOverflow) {
          console.warn(`⚠️ Horizontal overflow detected on ${pg.name} at ${viewport.name}`);
        }

        await page.screenshot({
          path: `${SCREENSHOT_DIR}/${viewport.name}-${pg.name}.png`,
          fullPage: true,
        });
        console.log(`📱 Captured: ${viewport.name}-${pg.name}.png (overflow: ${hasHorizontalOverflow})`);
      });
    }

    test(`${viewport.name} - admin-login`, async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${viewport.name}-admin-login.png`,
        fullPage: true,
      });
    });
  });
}
