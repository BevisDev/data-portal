import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const notificationTarget = env.NOTIFICATION_API_TARGET ?? 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // The api-key is injected here so it never reaches the browser bundle.
        '/notification-api': {
          target: notificationTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/notification-api/, '/notification'),
          headers: env.NOTIFICATION_API_KEY ? { 'api-key': env.NOTIFICATION_API_KEY } : undefined,
        },
      },
    },
  }
})
