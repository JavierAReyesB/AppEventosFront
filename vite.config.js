import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    historyApiFallback: true // Asegura que Vite maneje rutas dinámicas
  }
})
