import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vendor', test: /node_modules\/(react|react-dom|react-router-dom|react-helmet-async)/ },
          ],
        },
      },
    },
  },
})
