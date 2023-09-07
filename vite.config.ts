import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      // add this to cache all the imports
      workbox: {
        globPatterns: ['**/*']
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ['**/*'],
      manifest: {
        theme_color: '#FFF',
        background_color: '#FFF',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        short_name: 'Scorebud',
        description:
          "L'assistant compteur de score pour tous les jeux de société.",
        name: 'Scorebud',
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
});
