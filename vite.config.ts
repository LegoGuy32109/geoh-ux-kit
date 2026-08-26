import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Set to '/<repo-name>/' if this is served from a GitHub Pages project site.
  base: '/',
  plugins: [
    react()
  ]
})
