import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: resolve('./src/lib'),
      $apps: resolve('./src/apps'),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  css: {
    devSourcemap: true,
  },
  build: {
    target: 'es2020',
  },
})
