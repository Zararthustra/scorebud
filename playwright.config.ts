import { defineConfig } from '@playwright/test';

// Une seule adresse IPv4 des deux côtés : « localhost » pouvait viser ::1 alors que le serveur écoutait en IPv4 (ERR_CONNECTION_REFUSED intermittent).
const ADRESSE = 'http://127.0.0.1:4173';

// Téléphone posé sur la table : Chromium émulé en mobile 390 × 844 (plan technique §10, Q11).
export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: ADRESSE,
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
      'npx tsc && npx vite build --mode e2e && npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: ADRESSE,
    reuseExistingServer: !process.env.CI
  }
});
