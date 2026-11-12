import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/** Packages grouped into long-lived vendor chunks (see build.rollupOptions.output.manualChunks). */
const VENDOR = new Set([
  'react',
  'react-dom',
  'scheduler',
  'react-router',
  'react-router-dom',
  '@remix-run/router',
]);
const ANIMATION = new Set(['framer-motion', 'motion-dom', 'motion-utils']);
const FORMS = new Set(['react-hook-form', 'zod', '@hookform/resolvers']);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // Form submissions go to the Node API (`npm run dev:server`, port 8787 by default).
    proxy: {
      '/api': { target: `http://localhost:${process.env.API_PORT || 8787}`, changeOrigin: false },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Contact form country flags stay separate files so only the ones shown are downloaded
    // (inlining all ~250 would add them to the Contact page's JavaScript). Everything else
    // keeps the default 4 KB inline limit.
    assetsInlineLimit: (file) => (file.includes('/country-flag-icons/') ? false : undefined),
    rollupOptions: {
      output: {
        // Matched by package path, so a package's sub-entries (react/jsx-runtime,
        // react-dom/client) land in its chunk. The object form only matched the package
        // entry points, which put React's JSX runtime in `animation` and made every route
        // download framer-motion.
        manualChunks(id) {
          const pkg = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//)?.[1];
          if (!pkg) return undefined;
          if (VENDOR.has(pkg)) return 'vendor';
          if (ANIMATION.has(pkg)) return 'animation';
          if (FORMS.has(pkg)) return 'forms';
          return undefined;
        },
      },
    },
  },
});
