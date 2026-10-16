import { useEffect, useState } from "react";
import { Check, CircleAlert, Copy, Download, ImageUp, Info, QrCode, RefreshCw, Smartphone, X } from "lucide-react";
import { formText } from "../data/trainingForm";

const t = formText.payment;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

// Opens the phone's UPI apps with the payee filled in (the amount is typed in the app).
const UPI_LINK = `upi://pay?pa=${t.upiId}&pn=${encodeURIComponent(t.payeeName)}&cu=INR`;

const smallButton =
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-text-side/40";

// One numbered step of the payment panel.
function Step({ no, title, badge, invalid = false, children }) {
  return (
    <div className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm ${invalid ? "border-red-300" : "border-border-light"}`}>
      <div className="flex items-start gap-2.5">
        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background-dark text-xs font-bold text-primary">
          {no}
        </span>
        <div className="min-w-0 pt-0.5">
          <h4 className="text-base font-bold leading-snug text-[#0d1b0d]">{title}</h4>
          {badge && (
            <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
              {badge}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// Step 17 of the training application form: the fee, then (on "Show QR code") two steps side
// by side: 1. scan the QR code and pay, 2. upload the payment screenshot. Both are required;
// the form uploads the screenshot when it is submitted.
//   fee:                 the chosen batch's fee text, if known
//   file / onFileChange: the chosen screenshot (File or null)
//   error / errorId / onError: the step's error message
//   attempt:             counts submit attempts; an attempt (or a new error) with an error
//                        opens the panel, so the upload is in view
export default function TrainingPayment({ id, fee, file, onFileChange, error, errorId, onError, attempt }) {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const headingId = `${id}-heading`;
  const qrId = `${id}-qr`;
  const hintId = `${id}-hint`;

  const [seen, setSeen] = useState({ attempt, error: "" });
  if (attempt !== seen.attempt || (error && error !== seen.error)) {
    setSeen({ attempt, error });
    if (error) setShowQr(true);
  }

  // Free the preview URL when it changes or the step unmounts.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const choose = (selected) => {
    if (!selected) return;
    if (!ACCEPT.includes(selected.type)) {
      onError(t.notImage);
      return;
    }
    setPreview(URL.createObjectURL(selected));
    onFileChange(selected);
  };

  const remove = () => {
    setPreview("");
    onFileChange(null);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(t.upiId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the UPI ID is still shown to copy by hand.
    }
  };

  const errorMessage = error && (
    <p id={errorId} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600">
      <CircleAlert size={15} aria-hidden="true" className="shrink-0" />
      {error}
    </p>
  );

  return (
    <section aria-labelledby={headingId} className="mt-8 rounded-2xl border border-border-light bg-background-light/60 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={headingId} className="flex items-start gap-2.5 text-sm font-semibold leading-snug text-[#0d1b0d]">
          <span
            aria-hidden="true"
            className="mt-px flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 px-1 text-[11px] font-bold text-text-side"
          >
            {t.no}
          </span>
          {t.label}
        </h3>
        {fee && (
          <p className="rounded-full border border-primary/30 bg-white px-3.5 py-1 text-sm text-[#0d1b0d]">
            {t.fee}: <strong className="font-bold">{fee}</strong>
          </p>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#3f5f3f]">{t.intro}</p>

      <button
        type="button"
        onClick={() => setShowQr((v) => !v)}
        aria-expanded={showQr}
        aria-controls={qrId}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-background-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1b3a1b] focus:outline-none focus-visible:ring-2 focus-visible:ring-text-side/40"
      >
        <QrCode size={17} aria-hidden="true" />
        {showQr ? t.hideQr : t.showQr}
      </button>

      <div id={qrId} hidden={!showQr} className="mt-5">
        {showQr && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* 1. Scan & pay */}
            <Step no={1} title={t.payTitle}>
              <p className="mt-2 text-sm leading-relaxed text-[#3f5f3f]">{t.payText}</p>
              <div className="mx-auto mt-4 w-full max-w-[250px] rounded-2xl border border-border-light bg-white p-2 shadow-md">
                <img src={t.qrSrc} alt={t.qrAlt} width="800" height="1018" className="h-auto w-full rounded-xl" />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-border-light bg-background-light px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5b735b]">{t.upiIdLabel}</p>
                  <p className="whitespace-nowrap font-mono text-[13px] font-semibold text-[#0d1b0d]">{t.upiId}</p>
                </div>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className={`${smallButton} shrink-0 ${copied ? "border-primary bg-primary/15 text-text-side" : "border-slate-300 bg-white text-[#0d1b0d] hover:border-text-side hover:text-text-side"}`}
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <a
                  href={t.qrSrc}
                  download="Sumedha-Agro-payment-QR.jpg"
                  className={`${smallButton} border-slate-300 bg-white text-[#0d1b0d] hover:border-text-side hover:text-text-side`}
                >
                  <Download size={14} aria-hidden="true" />
                  {t.download}
                </a>
                <a href={UPI_LINK} className={`${smallButton} border-primary bg-primary text-[#0d1b0d] hover:bg-green-400 md:hidden`}>
                  <Smartphone size={14} aria-hidden="true" />
                  {t.openApp}
                </a>
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-[#5b735b] md:hidden">{t.phoneHint}</p>
            </Step>

            {/* 2. Upload the screenshot (required) */}
            <Step no={2} title={t.screenshot} badge={t.requiredBadge} invalid={Boolean(error)}>
              <p id={hintId} className="mt-2 text-sm leading-relaxed text-[#3f5f3f]">
                {t.screenshotHint}
              </p>

              <label
                htmlFor={id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  choose(e.dataTransfer.files?.[0]);
                }}
                className={`mt-4 flex min-h-64 flex-1 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed p-4 text-center transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-text-side/40 ${
                  dragging
                    ? "border-text-side bg-primary/10"
                    : error
                      ? "border-red-400 bg-red-50/50"
                      : preview
                        ? "border-primary/40 bg-background-light"
                        : "border-slate-300 bg-background-light/60 hover:border-text-side hover:bg-primary/5"
                }`}
              >
                {preview ? (
                  <img src={preview} alt="" className="max-h-72 w-auto rounded-lg object-contain shadow-sm" />
                ) : (
                  <>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-text-side">
                      <ImageUp size={26} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-[#0d1b0d]">{t.choose}</span>
                    <span className="hidden text-xs text-[#5b735b] md:inline">{t.dropHint}</span>
                    <span className="text-xs text-[#5b735b]">{t.formats}</span>
                  </>
                )}
                <input
                  id={id}
                  type="file"
                  accept={ACCEPT.join(",")}
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${errorId} ${hintId}` : hintId}
                  aria-label={t.screenshot}
                  className="sr-only"
                  onChange={(e) => {
                    choose(e.target.files?.[0]);
                    e.target.value = ""; // choosing the same file again still counts as a change
                  }}
                />
              </label>

              {file && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                  <p className="flex min-w-0 items-center gap-1.5 font-semibold text-text-side">
                    <Check size={15} aria-hidden="true" className="shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <label
                      htmlFor={id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-[#0d1b0d] hover:border-text-side hover:text-text-side"
                    >
                      <RefreshCw size={12} aria-hidden="true" />
                      {t.change}
                    </label>
                    <button
                      type="button"
                      onClick={remove}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      <X size={12} aria-hidden="true" />
                      {t.remove}
                    </button>
                  </div>
                </div>
              )}

              {errorMessage}
              <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-[#5b735b]">
                <Info size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                {t.notAccepted}
              </p>
            </Step>
          </div>
        )}
      </div>

      {/* With the panel closed, a missing screenshot is still reported here. */}
      {!showQr && errorMessage}
    </section>
  );
}
