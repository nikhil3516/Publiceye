import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/Publiceye/' : '/',
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router') || id.includes('@remix-run') || id.includes('react') || id.includes('react-dom')) {
                return 'vendor-core';
              }
              if (id.includes('google-maps') || id.includes('@react-google-maps')) {
                return 'vendor-maps';
              }
              if (id.includes('framer-motion') || id.includes('motion')) {
                return 'vendor-animation';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-libs';
            }
          }
        }
      }
    }
  }
})
