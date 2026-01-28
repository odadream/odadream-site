
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: 'esbuild', // Fast and efficient minification
    sourcemap: false,  // Disable sourcemaps for production to save space
    rollupOptions: {
      output: {
        // Manual chunk splitting to improve caching and load performance
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-utils': ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
  server: {
    host: true, // Expose to network for testing on mobile devices
  }
})
