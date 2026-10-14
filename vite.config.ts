import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: './src/playground/public',
  build: {
    outDir: './dist-playground',
  },
  plugins: [
    tanstackStart({
      srcDirectory: './src/playground',
      prerender: { enabled: true, crawlLinks: false },
    }),
    react(),
    tailwindcss(),
  ],
})
