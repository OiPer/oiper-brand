import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './src/playground',
  plugins: [react()],
  build: {
    outDir: '../../dist-playground',
    emptyOutDir: true,
  },
})
