// Generates sitemap.xml and robots.txt from the router, so a page added to src/App.jsx
// is listed on the next build (and straight away under `npm run dev`).
//
// - Every <Route path="..." element={<Page />}> in the routes file is listed in file order,
//   except redirects (<Navigate>), catch-all paths ("*") and anything in `disallow`/`exclude`
//   (a listed path also covers everything under it).
// - A path with a parameter (/products/:slug) is listed once per value its `params` entry
//   returns. A new parameter path without an entry stops the build, so it is never missed.
// - No <lastmod>: the pages share one content file, so a per-page date would be a guess.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runnerImport } from "vite";

const ROUTE = /<Route\s+path=["']([^"']+)["']\s+element=\{\s*<(\w+)/g;

const escapeXml = (text) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

const covers = (prefixes, path) => prefixes.some((p) => path === p || path.startsWith(`${p.replace(/\/$/, "")}/`));

// Fills ":name" segments: a plain value fills the path's only parameter, an object fills them by name.
const fill = (path, value) =>
  path.replace(/:(\w+)/g, (_, name) => encodeURIComponent(typeof value === "object" ? value[name] : value));

/**
 * @param {object} options
 * @param {string} options.siteUrl  Public origin, e.g. "https://example.com".
 * @param {string} [options.routesFile]  File holding the <Route> elements, relative to the Vite root.
 * @param {string[]} [options.disallow]  Paths crawlers must not visit (robots.txt); also left out of the sitemap.
 * @param {string[]} [options.exclude]  Paths left out of the sitemap but still open to crawlers.
 * @param {Record<string, (load: (file: string) => Promise<object>) => Promise<Array<string|object>>|Array<string|object>>} [options.params]
 *   Values for each parameter path; `load` imports a source module (images and all) through Vite.
 */
export default function sitemap({ siteUrl, routesFile = "src/App.jsx", disallow = [], exclude = [], params = {} }) {
  const origin = siteUrl.replace(/\/+$/, "");
  let root;
  let logger;

  const load = async (file) =>
    (await runnerImport(resolve(root, file), { configFile: false, logLevel: "silent", root })).module;

  async function pagePaths() {
    const source = await readFile(resolve(root, routesFile), "utf8");
    const routes = [...source.matchAll(ROUTE)];
    if (!routes.length) throw new Error(`[sitemap] No <Route path="..." element={...}> found in ${routesFile}.`);

    const paths = [];
    for (const [, path, element] of routes) {
      if (element === "Navigate" || path.includes("*") || covers([...disallow, ...exclude], path)) continue;
      if (!path.startsWith("/")) {
        logger.warn(`[sitemap] Skipped "${path}" in ${routesFile}: only absolute paths are listed.`);
        continue;
      }
      if (!path.includes(":")) {
        paths.push(path);
        continue;
      }
      const values = params[path];
      if (!values) {
        throw new Error(
          `[sitemap] "${path}" has a parameter: add params["${path}"] to the sitemap() options in vite.config.js, or exclude it.`
        );
      }
      for (const value of await values(load)) paths.push(fill(path, value));
    }
    return [...new Set(paths)];
  }

  async function sitemapXml() {
    const urls = (await pagePaths()).map((path) => `  <url>\n    <loc>${escapeXml(origin + path)}</loc>\n  </url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  }

  function robotsTxt() {
    const blocked = disallow.map((path) => `Disallow: ${path}\n`).join("");
    return `User-agent: *\nAllow: /\n${blocked}\nSitemap: ${origin}/sitemap.xml\n`;
  }

  return {
    name: "sitemap",

    configResolved(config) {
      root = config.root;
      logger = config.logger;
    },

    // Dev server: built on every request, so changes show up without a restart.
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/sitemap.xml" && path !== "/robots.txt") return next();
        try {
          const xml = path === "/sitemap.xml";
          res.setHeader("Content-Type", xml ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8");
          res.end(xml ? await sitemapXml() : robotsTxt());
        } catch (err) {
          next(err);
        }
      });
    },

    async generateBundle() {
      const xml = await sitemapXml();
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });
      logger.info(`[sitemap] sitemap.xml lists ${xml.split("<loc>").length - 1} pages.`);
    },
  };
}
