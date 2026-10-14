import { Globe, Mail, MapPin, Phone } from "lucide-react";
import content from "../data/content";
import { mailHref, telHref } from "../lib/links";

const { contact } = content;

const tones = {
  light: {
    text: "text-[#3f5f3f]",
    icon: "bg-primary/15 text-text-side",
    link: "font-medium text-[#0d1b0d] hover:text-text-side hover:underline underline-offset-4",
  },
};

// Renders the client's contact details line by line, exactly as supplied,
// with phone numbers as tel: links and emails as mailto: links. A group's prefix
// ("Mob. ", "E-mailID-") sits in its own column so every number/address lines up under the first.
// parts: which groups to show; layout "stack" (one column) or "grid".
export default function ContactBlock({
  tone = "light",
  layout = "stack",
  parts = ["address", "phone", "email", "web"],
  className = "",
}) {
  const t = tones[tone];

  const groups = {
    address: {
      icon: MapPin,
      lines: [contact.address],
    },
    phone: {
      icon: Phone,
      prefix: contact.phonePrefix,
      lines: contact.phones.map((number) => (
        <a className={t.link} href={telHref(number)}>
          {number}
        </a>
      )),
    },
    email: {
      icon: Mail,
      prefix: contact.emailPrefix,
      lines: contact.emails.map((email) => (
        <a className={`${t.link} [overflow-wrap:anywhere]`} href={mailHref(email)}>
          {email}
        </a>
      )),
    },
    web: {
      icon: Globe,
      prefix: contact.webPrefix,
      lines: [
        <a className={t.link} href={contact.webUrl}>
          {contact.web}
        </a>,
      ],
    },
  };

  const layoutClass =
    layout === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.5fr_1fr]" : "flex flex-col gap-5";

  return (
    <address className={`not-italic ${layoutClass} ${className}`}>
      {parts.map((key) => {
        const { icon: Icon, prefix, lines } = groups[key];
        return (
          <div key={key} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.icon}`}>
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className={`flex min-w-0 text-sm leading-relaxed ${t.text}`}>
              {prefix && <span className="shrink-0 whitespace-pre">{prefix}</span>}
              <ul className="flex min-w-0 flex-col gap-1">
                {lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </address>
  );
}
