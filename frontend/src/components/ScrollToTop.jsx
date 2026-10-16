import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MAX_WAIT_MS = 3000;
const POLL_MS = 50;

// Scrolls to the top on route change, or to the element matching the URL hash.
// Pages are lazy-loaded, so the hash target is polled for briefly until it mounts.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const firstPage = useRef(true);

  useEffect(() => {
    const isFirstPage = firstPage.current;
    firstPage.current = false;

    if (!hash) {
      // A page that has just loaded already starts at the top (or where the browser restores
      // it on reload); scrolling now would only force a layout of the freshly rendered page.
      if (!isFirstPage) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let waited = 0;
    let timer;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
      waited += POLL_MS;
      if (waited < MAX_WAIT_MS) timer = window.setTimeout(tryScroll, POLL_MS);
    };

    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
