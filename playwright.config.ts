import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { getActiveEnv, getEnvConfig } from './config/env.config';

dotenv.config();

const envConfig = getEnvConfig();
const activeEnv = getActiveEnv();
const isLocal = activeEnv === 'local';

/**
 * Playwright config — baseURL and timeouts come from config/<ENV>.env.json
 * Switch env: ENV=qa|staging|prod|local npm run test
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: envConfig.timeouts.test,
  expect: {
    timeout: envConfig.timeouts.expect,
  },
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit-report.xml' }],
        ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: false }],
        ['github'],
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }],
        ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: false }],
      ],
  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: envConfig.timeouts.action,
    navigationTimeout: envConfig.timeouts.navigation,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\/ui\/.*\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\/ui\/.*\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\/ui\/.*\.spec\.ts/,
    },
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
    },
    {
      name: 'utils',
      testMatch: /.*\/utils\/.*\.spec\.ts/,
    },
  ],
  outputDir: 'test-results',
  // Auto-start local dummy app when ENV=local
  webServer: isLocal
    ? {
        command: 'node dummy-app/server.js',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 150000,
      }
    : undefined,
});
