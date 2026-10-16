// Email content. Every user-supplied value is HTML-escaped.

const SIGNATURE = {
  name: "Sumedha Agro",
  lines: [
    "982 Village Andpurdev, Banthra, Sarojni Nagar Lucknow 226401, Uttar Pradesh, India",
    "Mob. +91 9473896285, +91 9125591178",
    "info@sumedhaagro.com · www.sumedhaagro.com",
  ],
};

export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const nl2br = (value) => escapeHtml(value).replace(/\r?\n/g, "<br/>");

// rows: [label, value][]; paragraphs: plain-text strings.
function render({ title, paragraphs = [], rows = [] }) {
  const tableRows = rows
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b735b;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;color:#0d1b0d">${nl2br(value)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f6f8f6;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
<div style="background:#102210;color:#13ec13;padding:16px 24px;border-radius:12px 12px 0 0;font-weight:bold;font-size:18px">${SIGNATURE.name}</div>
<div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;color:#0d1b0d;font-size:14px;line-height:1.6">
<h2 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h2>
${paragraphs.map((p) => `<p style="margin:0 0 12px">${nl2br(p)}</p>`).join("")}
${tableRows ? `<table style="border-collapse:collapse;font-size:14px;margin-top:8px">${tableRows}</table>` : ""}
</div>
<p style="color:#5b735b;font-size:12px;line-height:1.5;margin:16px 8px 0">${SIGNATURE.lines.map(escapeHtml).join("<br/>")}</p>
</div></body></html>`;

  const text = [
    title,
    "",
    ...paragraphs,
    ...(rows.length ? [""] : []),
    ...rows.filter(([, v]) => v).map(([label, value]) => `${label}: ${value}`),
    "",
    "--",
    SIGNATURE.name,
    ...SIGNATURE.lines,
  ].join("\n");

  return { html, text };
}

const trainingRows = (a, maskedAadhar) => [
  ["Reference number", a.referenceId],
  ["Training applied for", a.trainingAppliedFor],
  ["Batch", a.trainingBatch],
  ["Date of training", a.trainingDate],
  ["Name", a.name],
  ["Gender", a.gender],
  ["Category", a.category],
  ["Complete postal address", a.postalAddress],
  ["State", a.state],
  ["Mobile No", a.mobile],
  ["Aadhar No", maskedAadhar],
  ["Email", a.email],
  ["Date of birth", a.dateOfBirth],
  ["Education/ qualification", a.education],
  ["Living place", a.livingPlace],
  ["Present employment/ designation", a.employment],
  ["Previous training on mushroom cultivation", a.previousTraining],
  ["Previous training details", a.previousTrainingDetails],
  ["Cultivated mushroom before", a.cultivatedBefore],
];

export function createTemplates({ companyEmail }) {
  const toCompany = (message) => (companyEmail ? { to: companyEmail, ...message } : null);

  return {
    trainingApplication(application, maskedAadhar) {
      return [
        toCompany({
          replyTo: application.email,
          subject: `New training application ${application.referenceId} - ${application.name}`,
          ...render({ title: "New training application", rows: trainingRows(application, maskedAadhar) }),
        }),
        {
          to: application.email,
          subject: `Training application received - ${application.referenceId}`,
          ...render({
            title: `Dear ${application.name},`,
            paragraphs: [
              `Thank you for applying for ${application.trainingAppliedFor}${application.trainingBatch ? ` (${application.trainingBatch})` : ""} at Sumedha Agro. We have received your application.`,
              `Your reference number is ${application.referenceId}. Please quote it in any correspondence about your application.`,
              "We will contact you with further details.",
            ],
          }),
        },
      ];
    },

    contactMessage(message) {
      return [
        toCompany({
          replyTo: message.email,
          subject: `New website enquiry - ${message.name}`,
          ...render({
            title: "New website enquiry",
            rows: [
              ["Name", message.name],
              ["Email", message.email],
              ["Phone", message.phone],
              ["Company", message.company],
              ["Interest", message.interest],
              ["Message", message.message],
            ],
          }),
        }),
        {
          to: message.email,
          subject: "Thank you for contacting Sumedha Agro",
          ...render({
            title: `Hello ${message.name},`,
            paragraphs: [
              "Thank you for reaching out to Sumedha Agro. We have received your message and will contact you shortly.",
            ],
          }),
        },
      ];
    },

    quoteRequest(quote) {
      return [
        toCompany({
          replyTo: quote.email,
          subject: `New quote request ${quote.referenceId} - ${quote.name}`,
          ...render({
            title: "New quote request",
            rows: [
              ["Reference number", quote.referenceId],
              ["Product", quote.product],
              ["Monthly volume (KG)", quote.volume],
              ["Packaging", quote.packaging],
              ["Frequency", quote.frequency],
              ["Company", quote.company],
              ["GST", quote.gst],
              ["Name", quote.name],
              ["Email", quote.email],
              ["Notes", quote.notes],
              ["Address", [quote.address, quote.city, quote.state].filter(Boolean).join(", ")],
              ["Postal code", quote.postalCode],
              ["Country", quote.country],
              ["Shipping method", quote.shippingMethod],
              ["Delivery date", quote.deliveryDate],
            ],
          }),
        }),
        {
          to: quote.email,
          subject: `Quote request received - ${quote.referenceId}`,
          ...render({
            title: `Hi ${quote.name},`,
            paragraphs: [
              "Thank you for requesting a quote from Sumedha Agro. Our team is reviewing your request and will contact you soon.",
              `Your reference number is ${quote.referenceId}.`,
            ],
            rows: [
              ["Product", quote.product],
              ["Monthly volume (KG)", quote.volume],
            ],
          }),
        },
      ];
    },

    subscriber(subscriber) {
      return [
        toCompany({
          subject: "New newsletter subscription",
          ...render({ title: "New subscriber", rows: [["Email", subscriber.email]] }),
        }),
        {
          to: subscriber.email,
          subject: "Thank you for subscribing to Sumedha Agro",
          ...render({
            title: "Thank you for subscribing",
            paragraphs: ["You will receive updates from Sumedha Agro at this address."],
          }),
        },
      ];
    },
  };
}
