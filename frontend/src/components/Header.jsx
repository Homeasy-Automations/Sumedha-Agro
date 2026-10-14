import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Mail, Menu, Phone, ShoppingCart, X } from "lucide-react";
import logo from "../assets/Logo.webp";
import content from "../data/content";
import { mailHref, telHref } from "../lib/links";
import { container } from "./styles";

const { nav, ui, site, contact } = content;

const desktopLink = ({ isActive }) =>
  `relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary/15 font-semibold text-text-side"
      : "text-gray-600 hover:text-text-side"
  }`;

const mobileLink = ({ isActive }) =>
  `flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium ${
    isActive
      ? "bg-primary/15 font-semibold text-text-side"
      : "text-[#0d1b0d] hover:bg-primary/10"
  }`;

export default function Header() {
  const { pathname } = useLocation();
  // Menus remember the path they were opened on, so navigating closes them.
  const [mobileOpenAt, setMobileOpenAt] = useState(null);
  const [moreOpenAt, setMoreOpenAt] = useState(null);
  const mobileOpen = mobileOpenAt === pathname;
  const moreOpen = moreOpenAt === pathname;

  const moreRef = useRef(null);
  const moreButtonRef = useRef(null);
  const moreMenuId = useId();
  const mobileMenuId = useId();

  const moreActive = nav.more.some((item) => pathname.startsWith(item.to));

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e) => {
      if (!moreRef.current?.contains(e.target)) setMoreOpenAt(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen]);

  const closeMore = (returnFocus) => {
    setMoreOpenAt(null);
    if (returnFocus) moreButtonRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-[#0d1b0d] focus:shadow-lg"
      >
        {ui.skipToContent}
      </a>

      {/* Utility bar */}
      <div className="hidden border-b border-border-light bg-background-light text-xs text-text-side md:block">
        <div className={`${container} flex h-9 items-center justify-between gap-6`}>
          <p className="truncate">{site.subtitle}</p>
          <div className="flex shrink-0 items-center gap-5">
            <a href={telHref(contact.phones[0])} className="inline-flex items-center gap-1.5 hover:text-[#0d1b0d] hover:underline">
              <Phone size={13} aria-hidden="true" />
              {contact.phones[0]}
            </a>
            <a href={mailHref(contact.emails[0])} className="inline-flex items-center gap-1.5 hover:text-[#0d1b0d] hover:underline">
              <Mail size={13} aria-hidden="true" />
              {contact.emails[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border-light bg-white">
        <div className={`${container} flex h-16 items-center justify-between gap-4 md:h-20`}>
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src={logo} alt={site.logoAlt} className="h-10 w-auto object-contain md:h-12" width="70" height="70" />
            <span className="flex min-w-0 flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-[#0d1b0d]">
                {site.name}
              </span>
              <span className="truncate text-[11px] font-medium text-[#5b735b] md:hidden">
                {site.subtitle}
              </span>
            </span>
          </Link>

          <nav aria-label={ui.primaryNav} className="hidden items-center gap-0.5 xl:flex">
            {nav.primary.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={desktopLink}>
                {item.label}
              </NavLink>
            ))}

            {nav.more.length > 0 && (
              <div
                ref={moreRef}
                className="relative"
                onKeyDown={(e) => {
                  if (e.key === "Escape" && moreOpen) closeMore(true);
                }}
                onBlur={(e) => {
                  // Only close when focus moved to another element (keyboard Tab);
                  // outside clicks are handled by the pointerdown listener.
                  if (moreOpen && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) closeMore(false);
                }}
              >
                <button
                  ref={moreButtonRef}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls={moreMenuId}
                  onClick={() => setMoreOpenAt(moreOpen ? null : pathname)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    moreActive
                      ? "bg-primary/15 font-semibold text-text-side"
                      : "text-gray-600 hover:text-text-side"
                  }`}
                >
                  {ui.more}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <ul
                  id={moreMenuId}
                  hidden={!moreOpen}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border-light bg-white p-2 shadow-xl"
                >
                  {nav.more.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => closeMore(false)}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                            isActive
                              ? "bg-primary/15 text-text-side"
                              : "text-[#0d1b0d] hover:bg-primary/10"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={nav.cta.to}
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-[#0d1b0d] shadow-md shadow-primary/20 transition hover:scale-105 hover:bg-green-400 sm:inline-flex"
            >
              {nav.cta.label}
            </Link>
            <NavLink
              to={nav.cart.to}
              aria-label={nav.cart.label}
              title={nav.cart.label}
              className={({ isActive }) =>
                `inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-primary/15 text-text-side" : "text-[#0d1b0d] hover:bg-primary/10 hover:text-text-side"
                }`
              }
            >
              <ShoppingCart size={22} aria-hidden="true" />
            </NavLink>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#0d1b0d] hover:bg-primary/10 xl:hidden"
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileOpen ? ui.closeMenu : ui.openMenu}
              onClick={() => setMobileOpenAt(mobileOpen ? null : pathname)}
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet menu */}
        <div
          id={mobileMenuId}
          hidden={!mobileOpen}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border-light bg-white xl:hidden"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMobileOpenAt(null);
          }}
        >
          <nav aria-label={ui.primaryNav} className={`${container} grid gap-6 py-4 sm:grid-cols-2`}>
            <ul className="flex flex-col gap-1">
              {nav.primary.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={mobileLink}
                    onClick={() => setMobileOpenAt(null)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            {nav.more.length > 0 && (
              <div>
                <p className="px-3 pb-1 text-xs font-bold text-[#5b735b]">{ui.more}</p>
                <ul className="flex flex-col gap-1">
                  {nav.more.map((item) => (
                    <li key={item.to}>
                      <NavLink to={item.to} className={mobileLink} onClick={() => setMobileOpenAt(null)}>
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              to={nav.cta.to}
              onClick={() => setMobileOpenAt(null)}
              className="flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-bold text-[#0d1b0d] shadow-md sm:col-span-2"
            >
              {nav.cta.label}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
