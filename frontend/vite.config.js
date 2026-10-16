import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import seo from './plugins/seo.js'

// <link rel="preconnect"> to the API (VITE_API_URL), so the connection is ready by the time the
// app asks for news, videos and the visitor count. The API is fetched without credentials,
// hence crossorigin (anonymous).
function preconnectApi(apiUrl) {
  let origin = null
  try {
    origin = apiUrl ? new URL(apiUrl).origin : null
  } catch {
    origin = null
  }
  return {
    name: 'preconnect-api',
    transformIndexHtml: () =>
      origin ? [{ tag: 'link', attrs: { rel: 'preconnect', href: origin, crossorigin: '' }, injectTo: 'head-prepend' }] : [],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return {
    plugins: [
      react(),
      tailwindcss(),
      preconnectApi(env.VITE_API_URL),
      // sitemap.xml, robots.txt and a page file per route with its search/social tags, built from
      // the routes in src/App.jsx and src/seo (see plugins/seo.js).
      seo({
        siteUrl: 'https://sumedhaagro.com',
        disallow: ['/admin'],
        params: {
          '/products/:slug': async (load) => (await load('src/data/product.js')).products.map((p) => p.slug),
        },
      }),
    ],
  }
})
