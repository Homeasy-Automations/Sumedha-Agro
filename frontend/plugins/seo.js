// Search engine files, built from the router so a page added to src/App.jsx is covered on the
// next build (sitemap and robots.txt also straight away under `npm run dev`):
//  - sitemap.xml and robots.txt;
//  - one HTML file per page (about.html, products/mushroom-chips.html, …) whose <head> has that
//    page's title, description, canonical URL, social-sharing tags and structured data from
//    src/seo, so crawlers that don't run JavaScript see the right page. Vercel serves
//    about.html at /about ("cleanUrls" in vercel.json); the app itself is the same on every page.
//
// Pages: every <Route path="..." element={<Page />}> in the routes file, in file order, except
// redirects (<Navigate>), catch-all paths ("*") and anything in `disallow`/`exclude` (a listed
// path also covers everything under it). A path with a parameter (/products/:slug) is listed
// once per value its `params` entry returns; a new parameter path without one, or a page with
// no entry in src/seo, stops the build so nothing is silently missed.
// No <lastmod> in the sitemap: the pages share one content file, so a per-page date would be a guess.
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { runnerImport } from "vite";

const ROUTE = /<Route\s+path=["']([^"']+)["']\s+element=\{\s*<(\w+)/g;

const escapeXml = (text) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

const covers = (prefixes, path) => prefixes.some((p) => path === p || path.startsWith(`${p.replace(/\/$/, "")}/`));

// Fills ":name" segments: a plain value fills the path's only parameter, an object fills them by name.
const fill = (path, value) =>
  path.replace(/:(\w+)/g, (_, name) => encodeURIComponent(typeof value === "object" ? value[name] : value));

// One head tag from src/seo's headTags() as HTML.
function renderTag({ tag, attrs, text }) {
  const attributes = Object.entries(attrs)
    .map(([name, value]) => (value === "" ? ` ${name}` : ` ${name}="${escapeXml(String(value))}"`))
    .join("");
  return tag === "meta" || tag === "link" ? `<${tag}${attributes}>` : `<${tag}${attributes}>${text ?? ""}</${tag}>`;
}

// index.html with this page's <title>, its description replaced and the other tags added.
function pageHtml(template, title, tags) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(title)}</title>`)
    .replace(/\s*<meta\s+name="description"[^>]*>/i, "")
    .replace(/\s*<\/head>/, `\n${tags.map((t) => `    ${renderTag(t)}\n`).join("")}  </head>`);
}

/**
 * @param {object} options
 * @param {string} options.siteUrl  Public origin, e.g. "https://example.com".
 * @param {string} [options.routesFile]  File holding the <Route> elements, relative to the Vite root.
 * @param {string} [options.seoModule]  Module exporting seoFor(path, { asset, …seoData }) and headTags(seo).
 * @param {(load: (file: string) => Promise<object>) => Promise<object>} [options.seoData]
 *   Extra options for seoFor (e.g. the product list), loaded through Vite.
 * @param {string[]} [options.disallow]  Paths crawlers must not visit (robots.txt); also left out of the sitemap.
 * @param {string[]} [options.exclude]  Paths left out of the sitemap but still open to crawlers.
 * @param {Record<string, (load: (file: string) => Promise<object>) => Promise<Array<string|object>>|Array<string|object>>} [options.params]
 *   Values for each parameter path; `load` imports a source module (images and all) through Vite.
 */
export default function seo({
  siteUrl,
  routesFile = "src/App.jsx",
  seoModule = "src/seo/index.js",
  seoData,
  disallow = [],
  exclude = [],
  params = {},
}) {
  const origin = siteUrl.replace(/\/+$/, "");
  let root;
  let logger;

  const load = async (file) =>
    (await runnerImport(resolve(root, file), { configFile: false, logLevel: "silent", root })).module;

  async function pagePaths() {
    const source = await readFile(resolve(root, routesFile), "utf8");
    const routes = [...source.matchAll(ROUTE)];
    if (!routes.length) throw new Error(`[seo] No <Route path="..." element={...}> found in ${routesFile}.`);

    const paths = [];
    for (const [, path, element] of routes) {
      if (element === "Navigate" || path.includes("*") || covers([...disallow, ...exclude], path)) continue;
      if (!path.startsWith("/")) {
        logger.warn(`[seo] Skipped "${path}" in ${routesFile}: only absolute paths are listed.`);
        continue;
      }
      if (!path.includes(":")) {
        paths.push(path);
        continue;
      }
      const values = params[path];
      if (!values) {
        throw new Error(`[seo] "${path}" has a parameter: add params["${path}"] to the seo() options in vite.config.js, or exclude it.`);
      }
      for (const value of await values(load)) paths.push(fill(path, value));
    }
    return [...new Set(paths)];
  }

  async function sitemapXml(paths) {
    const urls = paths.map((path) => `  <url>\n    <loc>${escapeXml(origin + path)}</loc>\n  </url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  }

  function robotsTxt() {
    const blocked = disallow.map((path) => `Disallow: ${path}\n`).join("");
    return `User-agent: *\nAllow: /\n${blocked}\nSitemap: ${origin}/sitemap.xml\n`;
  }

  return {
    name: "seo",
    enforce: "post",

    configResolved(config) {
      root = config.root;
      logger = config.logger;
    },

    // Dev server: sitemap and robots built on every request, so changes show without a restart.
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/sitemap.xml" && path !== "/robots.txt") return next();
        try {
          const xml = path === "/sitemap.xml";
          res.setHeader("Content-Type", xml ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8");
          res.end(xml ? await sitemapXml(await pagePaths()) : robotsTxt());
        } catch (err) {
          next(err);
        }
      });
    },

    generateBundle: {
      order: "post",
      async handler(_, bundle) {
        const paths = await pagePaths();
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: await sitemapXml(paths) });
        this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });

        const index = bundle["index.html"];
        if (!index) throw new Error("[seo] index.html is missing from the build.");
        const template = String(index.source);
        const { seoFor, headTags } = await load(seoModule);
        const data = seoData ? await seoData(load) : {};

        // Imported images are "/src/…" paths when loaded through Vite; map them to the built files.
        const built = new Map();
        for (const file of Object.values(bundle)) {
          if (file.type !== "asset") continue;
          for (const name of file.originalFileNames ?? []) {
            built.set(relative(root, resolve(root, name)).replaceAll("\\", "/"), `/${file.fileName}`);
          }
        }
        const asset = (url) => built.get(url.replace(/^\//, "")) ?? url;

        const missing = [];
        for (const path of paths) {
          const page = seoFor(path, { ...data, asset });
          if (!page) {
            missing.push(path);
            continue;
          }
          const html = pageHtml(template, page.title, headTags(page));
          if (path === "/") index.source = html;
          else this.emitFile({ type: "asset", fileName: `${path.slice(1)}.html`, source: html });
        }
        if (missing.length) throw new Error(`[seo] No SEO entry for ${missing.join(", ")}: add it to PAGES in ${seoModule}.`);
        logger.info(`[seo] ${paths.length} pages: sitemap.xml and a page file each.`);
      },
    },
  };
}
