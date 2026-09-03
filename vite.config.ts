import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/zod/')) return 'validation'
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: '/',
        name: 'Fragments de parcours - Willy Somkhit',
        short_name: 'Willy Somkhit',
        description: 'Portfolio professionnel bilingue en mode classique ou aventure 8-bit.',
        theme_color: '#0d2418',
        background_color: '#06130d',
        lang: 'fr',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['portfolio', 'business'],
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,pdf}'],
        globIgnores: ['**/phaser*.js', 'assets/adventure/**'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/assets\/phaser.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'adventure-engine',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\/assets\/adventure\/.*\.(?:png|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'adventure-art',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
})
