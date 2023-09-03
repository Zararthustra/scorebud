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
        theme_color: '#FAFAFA',
        background_color: '#FAFAFA',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        short_name: 'MY_PROJECT',
        description: 'MY_PROJECT description',
        name: 'MY_PROJECT',
        icons: [
          // {
          //   src: '/logo-192.png',
          //   sizes: '192x192',
          //   type: 'image/png'
          // },
          // {
          //   src: '/logo-512.png',
          //   sizes: '512x512',
          //   type: 'image/png'
          // }
        ]
      }
    })
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
});
