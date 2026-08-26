import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  /*
   * Each branch deploys into its own subdirectory on GitHub Pages
   * (see .github/workflows/pages.yml), so the base path is supplied at build
   * time — `/geoh-ux-kit/main/`, `/geoh-ux-kit/feat/whatever/`, and so on.
   * Local dev and `yarn preview` serve from the root.
   */
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react()
  ]
})
