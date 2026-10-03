/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// BASE is set by the GitHub Pages workflow to /<repo>/
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Math 30-1 Lab',
        short_name: '30-1 Lab',
        description: 'Exam-aligned practice for Alberta Mathematics 30-1',
        theme_color: '#1f5fbf',
        background_color: '#0e131a',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2,ttf,json}'], maximumFileSizeToCacheInBytes: 8_000_000 },
    }),
  ],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
