import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { headTags, isProductPath, notFoundSeo, seoFor } from "../seo";

function applyHead(seo) {
  document.title = seo.title;
  document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
  for (const { tag, attrs, text } of headTags(seo)) {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    if (text) el.textContent = text;
    document.head.appendChild(el);
  }
}

// Keeps <title>, the meta description, canonical URL, social-sharing tags and structured data
// in step with the current page (src/seo). The built HTML of each page already has them; this
// takes over when visitors move between pages without reloading. The product list is loaded
// only on product pages (the product page itself uses the same file).
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isProductPath(pathname)) {
      applyHead(seoFor(pathname) ?? notFoundSeo(pathname));
      return;
    }
    let current = true;
    import("../data/product")
      .then(({ products }) => current && applyHead(seoFor(pathname, { products }) ?? notFoundSeo(pathname)))
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [pathname]);

  return null;
}
