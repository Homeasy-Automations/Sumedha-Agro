import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from './plugins/sitemap.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // sitemap.xml and robots.txt, built from the routes in src/App.jsx (see plugins/sitemap.js).
    sitemap({
      siteUrl: 'https://sumedhaagro.com',
      disallow: ['/admin'],
      params: {
        '/products/:slug': async (load) => (await load('src/data/product.js')).products.map((p) => p.slug),
      },
    }),
  ],
})
