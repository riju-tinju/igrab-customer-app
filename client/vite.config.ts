/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.PORT || '5173');

  return {
    plugins: [
      react(),
      legacy()
    ],
    optimizeDeps: {
      include: ['hoist-non-react-statics', 'react-router-dom', '@ionic/react', '@ionic/react-router', 'ionicons/icons', 'swiper/react', 'swiper/modules']
    },
    server: {
      port: port,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    }
  };
})
