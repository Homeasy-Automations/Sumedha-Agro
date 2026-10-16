import content from "../data/content";

const { ui } = content;

const linkClass = "underline underline-offset-2 hover:text-text-side";

// Credits line required by CC BY stock photos: “title” (linked to the source) by author, licence.
// items: [{ name, credit }]; items without a credit are skipped, and nothing renders when none
// have one. With a single item the product name is left out.
export default function PhotoCredits({ items, className = "" }) {
  const credited = items.filter((item) => item.credit);
  if (!credited.length) return null;
  const single = credited.length === 1;

  return (
    <p className={`text-left text-xs leading-relaxed text-gray-500 ${className}`}>
      {ui.photoCredits}:{" "}
      {credited.map(({ name, credit }, i) => (
        <span key={name}>
          {i > 0 && "; "}
          {!single && `${name}: `}“
          <a href={credit.url} className={linkClass}>
            {credit.title}
          </a>
          ” by {credit.author},{" "}
          <a href={credit.licenseUrl} rel="license" className={linkClass}>
            {credit.license}
          </a>
        </span>
      ))}
      .
    </p>
  );
}
