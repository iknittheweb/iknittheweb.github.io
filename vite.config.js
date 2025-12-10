// =====================================================================
// Vite Config (Beginner-Friendly)
// =====================================================================
// Purpose: Configure Vite build for optimal output and external dependencies.
// Usage: Used automatically by Vite during build.
// Key Concepts:
//   - External dependencies (body-scroll-lock)
//   - Output file hashing for cache busting
//   - Build options for performance and maintainability
// =====================================================================

import { defineConfig } from 'vite';

export default defineConfig({
  // -------------------------------------------------------------
  // 1. Build options for output and optimization
  // -------------------------------------------------------------
  build: {
    // Treat 'body-scroll-lock' as an external global (not bundled)
    rollupOptions: {
      external: ['body-scroll-lock'],
      output: {
        globals: {
          'body-scroll-lock': 'bodyScrollLock',
        },
        // Filename hashing for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    minify: 'esbuild', // Fast JS/CSS minification
    sourcemap: false, // Disable source maps for smaller output
    assetsInlineLimit: 0, // Prevent inlining assets (always output files)
    manifest: true, // Generate manifest.json for asset mapping
    cssCodeSplit: true, // Split CSS for better caching
    outDir: 'dist', // Output directory
    emptyOutDir: true, // Clean output directory before build
    assetsDir: 'assets', // Subdirectory for assets
  },

  // -------------------------------------------------------------
  // 2. Set base path for deployment
  // -------------------------------------------------------------
  base: '/',
});
