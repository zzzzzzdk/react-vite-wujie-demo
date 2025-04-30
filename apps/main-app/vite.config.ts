import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      jsxRuntime: 'automatic',
    })
  ],
  esbuild: {
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-dev-runtime']
  },
  server: {
    port: 5173,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/css/global.scss" as *;`
      }
    }
  },
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        assetFileNames: 'static/[name].[hash].[ext]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    }
  }
});
