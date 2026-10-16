// Search engine and social-sharing data for each page: title, description, canonical URL,
// Open Graph / Twitter tags and schema.org JSON-LD. Used in two places:
//  - plugins/seo.js writes these tags into a separate HTML file per page at build time, so
//    crawlers that don't run JavaScript (WhatsApp, Facebook, LinkedIn…) see the right page;
//  - components/Seo.jsx updates them in the browser as visitors move between pages.
// A route added to src/App.jsx needs an entry in PAGES (the build stops until it has one).
// Product pages need the product list (src/data/product.js), passed in by the caller so it
// stays out of the code every page loads.
import content from "../data/content";

const { meta, site, contact } = content;

export const SITE_URL = "https://sumedhaagro.com";

// Shared preview image for links to the site (1200×630, in public/).
const SHARE_IMAGE = {
  path: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Sumedha Agro, Mushroom Seed (Spawn) Production Laboratory, Lucknow",
};

// Postal address and map position of contact.address, for structured data.
const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "982 Village Andpurdev, Banthra, Sarojni Nagar",
  addressLocality: "Lucknow",
  postalCode: "226401",
  addressRegion: "Uttar Pradesh",
  addressCountry: "IN",
};
const GEO = { "@type": "GeoCoordinates", latitude: 26.7120506, longitude: 80.8155327 };

// Path → meta entry (src/data/content.js) and the page above it in the breadcrumb trail.
const PAGES = {
  "/": { key: "home" },
  "/about": { key: "about" },
  "/training": { key: "training" },
  "/training/apply": { key: "trainingApply", parent: "/training" },
  "/spawn-booking": { key: "spawnBooking" },
  "/news": { key: "news" },
  "/contact": { key: "contact" },
  "/products": { key: "products" },
  "/shop": { key: "shop", parent: "/products" },
  "/get-quote": { key: "getQuote" },
  "/showcase": { key: "showcase", parent: "/products" },
  "/privacy": { key: "privacy" },
  "/termsofservices": { key: "termsofservices" },
};

const BRAND = site.name;
const fullTitle = (title) => (title.includes(BRAND) ? title : `${title} | ${BRAND}`);
const absolute = (path) => (/^https?:/i.test(path) ? path : `${SITE_URL}${path}`);
const tidy = (text) => text.replace(/\s+/g, " ").trim();

const organization = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  alternateName: site.fullName,
  description: meta.home.description,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/Logo.webp`,
  image: absolute(SHARE_IMAGE.path),
  telephone: contact.phones[0],
  email: contact.emails[0],
  address: ADDRESS,
  geo: GEO,
  areaServed: "IN",
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: BRAND,
  url: `${SITE_URL}/`,
  inLanguage: "en-IN",
  publisher: { "@id": organization["@id"] },
};

function breadcrumbs(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absolute(step.path === "/" ? "/" : step.path),
    })),
  };
}

// Home → (parent) → this page.
function trailTo(path, name) {
  const trail = [{ name: "Home", path: "/" }];
  const parent = PAGES[path]?.parent;
  if (parent) trail.push({ name: meta[PAGES[parent].key].crumb, path: parent });
  if (path !== "/") trail.push({ name, path });
  return trail;
}

const normalize = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname) || "/";

// A product page address (its SEO needs the product list).
export const isProductPath = (pathname) => /^\/products\/[^/]+$/.test(normalize(pathname));

/**
 * The page's SEO data, or null when the path is not a page of the site.
 * products: the product list, needed for product pages.
 * asset: turns an imported image URL into a public URL (the build maps source paths to the
 * hashed files; in the browser imported URLs are already public).
 */
export function seoFor(pathname, { products = [], asset = (url) => url } = {}) {
  const path = normalize(pathname);

  const page = PAGES[path];
  if (page) {
    const entry = meta[page.key];
    const jsonLd = path === "/" ? [organization, website] : [breadcrumbs(trailTo(path, entry.crumb))];
    if (path === "/about" || path === "/contact") jsonLd.push(organization);
    return { path, title: fullTitle(entry.title), description: entry.description, image: SHARE_IMAGE, jsonLd };
  }

  const slug = path.match(/^\/products\/([^/]+)$/)?.[1];
  const product = slug && products.find((p) => p.slug === slug);
  if (product) {
    const name = tidy(product.name);
    const description = `${tidy(product.description)}${meta.productSuffix}`;
    return {
      path,
      title: fullTitle(name),
      description,
      type: "product",
      image: SHARE_IMAGE,
      jsonLd: [
        breadcrumbs([...trailTo("/products", meta.products.crumb), { name, path }]),
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description: tidy(product.description),
          image: absolute(asset(product.image)),
          category: product.category,
          brand: { "@type": "Brand", name: BRAND },
          url: absolute(path),
        },
      ],
    };
  }

  return null;
}

// For addresses that are not pages of the site (shown by the "Page not found" page).
export function notFoundSeo(pathname) {
  return {
    path: normalize(pathname),
    title: fullTitle(meta.notFound.title),
    description: meta.notFound.description,
    image: SHARE_IMAGE,
    noindex: true,
    jsonLd: [],
  };
}

/**
 * The <head> tags for a page as [{ tag, attrs, text? }]. The <title> is set separately. Each
 * gets a data-seo attribute so the browser can swap them on navigation.
 */
export function headTags(seo) {
  const url = absolute(seo.path === "/" ? "/" : seo.path);
  const image = absolute(seo.image.path);
  const tags = [
    { tag: "meta", attrs: { name: "description", content: seo.description } },
    { tag: "meta", attrs: { name: "robots", content: seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large" } },
    ...(seo.noindex ? [] : [{ tag: "link", attrs: { rel: "canonical", href: url } }]),
    { tag: "meta", attrs: { property: "og:type", content: seo.type === "product" ? "product" : "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: BRAND } },
    { tag: "meta", attrs: { property: "og:locale", content: "en_IN" } },
    { tag: "meta", attrs: { property: "og:title", content: seo.title } },
    { tag: "meta", attrs: { property: "og:description", content: seo.description } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:width", content: String(seo.image.width) } },
    { tag: "meta", attrs: { property: "og:image:height", content: String(seo.image.height) } },
    { tag: "meta", attrs: { property: "og:image:alt", content: seo.image.alt } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: seo.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: seo.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    { tag: "meta", attrs: { name: "twitter:image:alt", content: seo.image.alt } },
    // "<" escaped so the JSON can never close the <script> element early.
    ...seo.jsonLd.map((data) => ({ tag: "script", attrs: { type: "application/ld+json" }, text: JSON.stringify(data).replace(/</g, "\\u003c") })),
  ];
  return tags.map((t) => ({ ...t, attrs: { ...t.attrs, "data-seo": "" } }));
}
