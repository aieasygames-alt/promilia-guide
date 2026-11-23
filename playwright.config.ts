import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.PLAYWRIGHT_PORT || 4321);
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: `npm run preview -- --port ${port} --ignore-lock`, url: baseURL, reuseExistingServer: false },
});
