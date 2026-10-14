import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import logo from "../assets/Logo.webp";
import content from "../data/content";
import useVisitorCount from "../hooks/useVisitorCount";
import ContactBlock from "./ContactBlock";
import { container } from "./styles";

const { footer, site } = content;
const YEAR = new Date().getFullYear();

const linkClass = "text-sm text-gray-600 transition-colors hover:text-text-side";

function LinkColumn({ title, links }) {
  return (
    <div>
      <h2 className="mb-5 text-base font-bold text-[#0d1b0d]">{title}</h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Compact counter for the bottom bar, between the copyright line and the legal links.
function VisitorCount() {
  const { label, fallback } = footer.visitorCount;
  const value = useVisitorCount(fallback);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background-light px-3.5 py-1.5">
      <Eye size={15} aria-hidden="true" className="text-text-side" />
      <span>{label}</span>
      <span className="font-mono font-bold tracking-[0.15em] text-[#0d1b0d] tabular-nums">
        {String(value).padStart(6, "0")}
      </span>
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-white text-[#3f5f3f]">
      <div className={`${container} pb-6 pt-10`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1.5fr]">
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex w-fit items-center gap-3">
              <img
                src={logo}
                alt={site.logoAlt}
                className="h-11 w-auto object-contain"
                width="70"
                height="70"
              />
              <span className="text-xl font-bold tracking-tight text-[#0d1b0d]">{site.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600">{footer.tagline}</p>
          </div>

          <LinkColumn title={footer.quickLinksHeading} links={footer.quickLinks} />
          <LinkColumn title={footer.quickLinksHeading} links={footer.quickLinks2} />

          <div>
            <h2 className="mb-5 text-base font-bold text-[#0d1b0d]">{footer.contactHeading}</h2>
            <ContactBlock parts={["address", "phone", "email"]} />
          </div>
        </div>

        {/* Copyright left, visitor count centred, legal links right (stacked on small screens). */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border-light pt-6 text-sm text-gray-600 md:grid md:grid-cols-[1fr_auto_1fr]">
          <p className="md:justify-self-start">
            © {YEAR} {footer.copyright}
          </p>
          <VisitorCount />
          <ul className="flex gap-6 md:justify-self-end">
            {footer.legal.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-text-side">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
