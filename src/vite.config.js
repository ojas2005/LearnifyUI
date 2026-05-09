import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://learnify-gateway-ojas2005-dev.apps.rm2.thpm.p1.openshiftapps.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
