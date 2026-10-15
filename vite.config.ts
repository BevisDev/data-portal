import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const portalBeTarget = env.PORTAL_BE_API_TARGET ?? 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // The api-key is injected here so it never reaches the browser bundle.
        '/api': {
          target: portalBeTarget,
          changeOrigin: true,
          headers: env.PORTAL_BE_API_KEY ? { 'api-key': env.PORTAL_BE_API_KEY } : undefined,
        },
      },
    },
  }
})
