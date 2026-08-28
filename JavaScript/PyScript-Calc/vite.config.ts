import { defineConfig } from 'vite';

/**
 * Vite config tuned for static hosting on Vercel.
 *
 * - base: './'  → relative asset paths (works on any domain / preview URL)
 * - publicDir   → copies public/python/* into dist so PyScript can fetch them
 * - outDir      → 'dist' (Vercel default for Vite)
 */
export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    // Ensure Python modules and other static files are not hashed away
    rollupOptions: {
      // No special input needed; index.html is the entry
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
