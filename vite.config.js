import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    // Let Vite handle chunking to preserve correct load order in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Copy service worker to dist
    copyPublicDir: true,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk sizes
    chunkSizeWarningLimit: 600,
    // Reduce asset inline limit to force separate files
    assetsInlineLimit: 4096
  },
  publicDir: 'public'
});
