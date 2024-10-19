// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true // Asegura que Vite maneje rutas dinámicas
  }
})
