import { defineConfig } from '@playwright/test';

// Téléphone posé sur la table : Chromium émulé en mobile 390 × 844 (plan technique §10, Q11).
export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4173',
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    // Le service worker mettrait les écrans en cache d'un test à l'autre ; seul le test hors ligne l'autorise.
    serviceWorkers: 'block'
  },
  webServer: {
    // Build de test : le module factice n'y est compilé qu'en mode e2e (MOD-01).
    command:
      'npx tsc && npx vite build --mode e2e && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI
  }
});
