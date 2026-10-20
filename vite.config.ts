import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // ADR-007 : même chemin (/sw.js) et même scope (/) que l'ancienne PWA, pour la remplacer proprement.
    VitePWA({
      // Mise à jour forcée (Arthur, 2026-10-21) : le nouveau SW prend la main dès qu'il est trouvé et la page se recharge ; la partie est déjà enregistrée.
      registerType: 'autoUpdate',
      filename: 'sw.js',
      scope: '/',
      includeAssets: ['favicon.ico'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true
      },
      manifest: {
        name: 'ScoreBud',
        short_name: 'ScoreBud',
        description: 'L’assistant compteur de score pour les jeux de société.',
        lang: 'fr',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        theme_color: '#fbf0f4',
        background_color: '#fbf0f4',
        icons: [
          { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'tests/*.test.ts']
  }
});
