import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.ODA_E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL: externalBaseURL ?? 'http://127.0.0.1:5177' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'node scripts/astro-cli.mjs dev --host 127.0.0.1 --port 5177',
        url: 'http://127.0.0.1:5177/en/',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
