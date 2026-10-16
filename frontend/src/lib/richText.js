// Plain text with links, as used in announcement details. Admins write a link as
// [link text](address); bare web addresses (https://…, www.…) and e-mail addresses become
// links too. Only web, e-mail, phone and site-relative ("/training") addresses are linked:
// anything else stays plain text, so nothing unsafe can reach the page.

const MARKDOWN_LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
const TOKEN = /\[([^\]\n]+)\]\(([^)\s]+)\)|\b(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/gi;
const EMAIL = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;

// The href for an address written in the text, or null when it is not one we link.
export function toHref(address) {
  const value = address.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^www\./i.test(value)) return `https://${value}`;
  return null;
}

// What the admin typed in the "Add link" box, as an href: also accepts a bare domain
// (sumedhaagro.com/training), an e-mail address or a phone number. Null when unusable.
export function normalizeLink(input) {
  const value = input.trim();
  const phone = /^\+?\d[\d\s-]{6,}$/.test(value);
  if (!value || (/\s/.test(value) && !phone)) return null;
  if (EMAIL.test(value)) return `mailto:${value}`;
  if (phone) return `tel:${value.replace(/[\s-]/g, "")}`;
  const href = toHref(value) ?? (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(value) ? `https://${value}` : null);
  if (href && /^https?:/i.test(href)) {
    try {
      new URL(href);
    } catch {
      return null;
    }
  }
  return href;
}

// [text](href) for the textarea; brackets in the text and parentheses in the address would end
// the link early, so they are dropped / encoded.
export function linkMarkup(text, href) {
  return `[${text.replace(/[[\]]/g, "").trim()}](${href.replaceAll("(", "%28").replaceAll(")", "%29")})`;
}

// Splits text into [{ type: "text", text } | { type: "link", text, href }].
export function parseRichText(text) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, label, target, url, email] = match;
    let end = match.index + whole.length;
    let part;
    if (label) {
      const href = toHref(target);
      part = href ? { type: "link", text: label, href } : { type: "text", text: label };
    } else if (url) {
      // Punctuation right after an address ends the sentence, not the address.
      const address = url.replace(/[.,;:!?'"]+$/, "");
      end = match.index + address.length;
      part = { type: "link", text: address, href: toHref(address) };
    } else {
      part = { type: "link", text: email, href: `mailto:${email}` };
    }
    if (match.index > last) parts.push({ type: "text", text: text.slice(last, match.index) });
    parts.push(part);
    last = end;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts;
}

// The text with [text](href) links reduced to their text (for short previews).
export function plainText(text) {
  return text.replace(MARKDOWN_LINK, "$1");
}
