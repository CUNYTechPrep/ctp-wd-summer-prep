import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // No plugins needed for vanilla JavaScript
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})