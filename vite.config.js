import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    // Enable minification for production builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            'axios'
          ],
          ui: [
            '@emotion/react',
            '@emotion/styled',
            'framer-motion',
            'react-icons'
          ]
        }
      }
    },
    // Generate source maps for debugging
    sourcemap: false,
    // Reduce chunk size
    chunkSizeWarningLimit: 1000
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  // Improve dev server performance
  server: {
    hmr: true,
    host: true
  }
});
