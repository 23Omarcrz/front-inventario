import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {                          // cualquier ruta que empiece con /api
        target: 'http://192.168.3.69:3000',  // tu backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // elimina /api al mandar al backend
      },
    },
  }
})
