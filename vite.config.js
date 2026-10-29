import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      filename: 'service-worker.js',
      injectRegister: null,
      manifest: false,
      workbox: {
        cacheId: 'firebase-sensor',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,json}'],
        globIgnores: ['**/init.json']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/unit/setup.js',
    include: ['tests/unit/**/*.spec.js']
  }
})
