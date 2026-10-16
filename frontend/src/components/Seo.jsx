import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { headTags, notFoundSeo, seoFor } from "../seo";

// Keeps <title>, the meta description, canonical URL, social-sharing tags and structured data
// in step with the current page (src/seo). The built HTML of each page already has them; this
// takes over when visitors move between pages without reloading.
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoFor(pathname) ?? notFoundSeo(pathname);
    document.title = seo.title;
    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    for (const { tag, attrs, text } of headTags(seo)) {
      const el = document.createElement(tag);
      for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
      if (text) el.textContent = text;
      document.head.appendChild(el);
    }
  }, [pathname]);

  return null;
}
