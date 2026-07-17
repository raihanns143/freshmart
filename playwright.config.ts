import { defineConfig, devices } from '@playwright/test';

// Production URL is passed via environment variable PLAYWRIGHT_BASE_URL
// Falls back to localhost for local dev runs
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'QA/playwright-report', open: 'never' }],
    ['json', { outputFile: 'QA/playwright-results.json' }],
    ['junit', { outputFile: 'QA/junit-results.xml' }],
    ['list'],
  ],
  outputDir: 'QA/test-results',
  use: {
    baseURL: BASE_URL,
    // Always capture traces (not just on retry) for production runs
    trace: process.env.PLAYWRIGHT_BASE_URL ? 'on' : 'on-first-retry',
    // Always capture screenshots on production
    screenshot: process.env.PLAYWRIGHT_BASE_URL ? 'on' : 'only-on-failure',
    // Always record video on production
    video: process.env.PLAYWRIGHT_BASE_URL ? 'on' : 'retain-on-failure',
    // Generous timeouts for production (cold starts, CDN, etc.)
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    // Viewport
    viewport: { width: 1280, height: 720 },
  },
  // Only use webServer when running locally (not against external URL)
  ...(!process.env.PLAYWRIGHT_BASE_URL && {
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  }),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
