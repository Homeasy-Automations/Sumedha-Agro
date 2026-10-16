// Puts the app's stylesheet inside index.html as a <style> element instead of linking to it, so
// the first paint doesn't wait for a second request (Lighthouse: "render-blocking requests").
// The pages are drawn by JavaScript, so splitting out "critical" CSS would leave nothing to
// inline; the whole stylesheet is small (about 14 KiB compressed). The .css file is still
// emitted, unused, so nothing that might point at it breaks.
// Runs before plugins/seo.js (listed first in vite.config.js), which copies index.html per page.
export default function inlineCss() {
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        const index = bundle["index.html"];
        if (!index) return;
        index.source = String(index.source).replace(
          /<link rel="stylesheet"(?: crossorigin)? href="\/([^"]+\.css)">/g,
          (tag, fileName) => {
            const css = bundle[fileName];
            const text = css?.type === "asset" ? String(css.source) : null;
            return text && !text.includes("</style") ? `<style>${text}</style>` : tag;
          }
        );
      },
    },
  };
}
