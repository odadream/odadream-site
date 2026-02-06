import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          markdown: ['react-markdown', 'remark-gfm'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  }
})