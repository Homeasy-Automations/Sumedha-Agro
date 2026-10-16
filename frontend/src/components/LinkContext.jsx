import content from "../data/content";

const { ui } = content;

// Screen-reader text completing a short link label with what it leads to ("Read more" →
// "Read more about Spawn Production Training"), so the link is descriptive for screen readers
// and search engines while the visible label stays short.
export default function LinkContext({ children }) {
  return <span className="sr-only"> {ui.linkAbout} {children}</span>;
}
