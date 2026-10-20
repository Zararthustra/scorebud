import { defineConfig } from '@playwright/test';

// Téléphone posé sur la table : Chromium émulé en mobile 390 × 844 (plan technique §10, Q11).
export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4173',
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI
  }
});
