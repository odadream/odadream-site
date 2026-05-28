import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['iOS >= 13', 'Safari >= 13'],
      modernPolyfills: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Crucial for GitHub Pages (relative paths)
  publicDir: 'public', // Explicitly define public assets directory
  server: {
    host: '0.0.0.0', // REQUIRED for cloud IDEs (AI Studio, IDX, Codespaces) to expose the port
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2019', // iOS Safari 13+ compatibility
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Split heavy 3rd-party libs into their own chunks so the initial
        // index bundle drops well below the 500 KB warning threshold and
        // the first paint ships faster on mobile.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('react-markdown') || id.includes('remark-') || id.includes('mdast') || id.includes('micromark') || id.includes('unified')) return 'markdown';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react-dom') || id.includes('scheduler')) return 'react-dom';
          if (id.includes('node_modules/react/')) return 'react';
          return 'vendor';
        },
      },
    },
  }
})