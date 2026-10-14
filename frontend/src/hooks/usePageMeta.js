import { useEffect } from "react";
import content from "../data/content";

const SUFFIX = ` | ${content.site.name}`;

// Sets document.title and <meta name="description"> for the current page.
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title.includes(content.site.name) ? title : `${title}${SUFFIX}`;

    if (!description) return;
    let tag = document.head.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }, [title, description]);
}
