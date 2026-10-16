import { useId, useRef, useState } from "react";
import { Link2 } from "lucide-react";
import RichText from "../components/RichText";
import { linkMarkup, normalizeLink } from "../lib/richText";
import { input } from "./styles";
import { Button } from "./ui";

const BAD_ADDRESS = "Enter a web address (https://…), a page of this site (/training), an e-mail address or a phone number.";
const TOO_LONG = "There is no room for this link: the text is at its maximum length.";

// Textarea with an "Add link" tool: select the words to link (or type them in the box), give
// the address, and it inserts [words](address), which the website shows as a link. A preview
// below shows the text as visitors will see it.
export default function LinkTextarea({ value, onValue, maxLength, rows = 6, ...props }) {
  const ref = useRef(null);
  const uid = useId();
  const [panel, setPanel] = useState(null); // { start, end, text, address, error }

  const open = () => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setPanel({ start, end, text: value.slice(start, end).trim(), address: "", error: "" });
  };

  const close = () => {
    setPanel(null);
    requestAnimationFrame(() => ref.current?.focus());
  };

  const insert = () => {
    const href = normalizeLink(panel.address);
    if (!href) return setPanel((p) => ({ ...p, error: BAD_ADDRESS }));
    const markup = linkMarkup(panel.text.trim() || panel.address.trim(), href);
    const next = value.slice(0, panel.start) + markup + value.slice(panel.end);
    if (maxLength && next.length > maxLength) return setPanel((p) => ({ ...p, error: TOO_LONG }));
    onValue(next);
    setPanel(null);
    const caret = panel.start + markup.length;
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(caret, caret);
    });
  };

  // Enter inserts and Escape cancels without submitting the form or closing the dialog.
  const onPanelKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insert();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Button
          variant="secondary"
          icon={Link2}
          onClick={panel ? close : open}
          aria-expanded={Boolean(panel)}
          aria-controls={`${uid}-panel`}
          className="px-3 py-1.5 text-xs"
        >
          Add link
        </Button>
      </div>
      {panel && (
        <div
          id={`${uid}-panel`}
          role="group"
          aria-label="Add link"
          className="mb-2 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            aria-label="Link text"
            placeholder="Words to show, e.g. Apply now"
            value={panel.text}
            onChange={(e) => setPanel((p) => ({ ...p, text: e.target.value, error: "" }))}
            onKeyDown={onPanelKey}
            className={input}
          />
          <input
            aria-label="Link address"
            aria-invalid={panel.error ? true : undefined}
            aria-describedby={panel.error ? `${uid}-error` : undefined}
            placeholder="https://… or /training"
            value={panel.address}
            onChange={(e) => setPanel((p) => ({ ...p, address: e.target.value, error: "" }))}
            onKeyDown={onPanelKey}
            className={input}
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={insert}>Insert</Button>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </div>
          {panel.error && (
            <p id={`${uid}-error`} role="alert" className="text-xs font-medium text-red-600 sm:col-span-3">
              {panel.error}
            </p>
          )}
        </div>
      )}
      <textarea ref={ref} {...props} value={value} maxLength={maxLength} rows={rows} onChange={(e) => onValue(e.target.value)} />
      {value.trim() && (
        <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5b735b]">Preview</p>
          <p className="mt-1 max-h-56 overflow-auto whitespace-pre-line text-left text-sm font-medium leading-relaxed text-[#3f5f3f]">
            <RichText text={value} newTab />
          </p>
        </div>
      )}
    </div>
  );
}
