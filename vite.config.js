import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
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
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
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
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  server: {
    hmr: true,
    host: true
  }
});
