// Sends email through Resend (https://resend.com) over its HTTP API.
// When Resend isn't configured every send is a no-op, so submissions are still saved.
// Mail is sent in the background: a slow or failing mail service never delays or
// fails the API response.

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 15_000;

export function createMailer(mail, { logger = console, fetchImpl = fetch } = {}) {
  if (!mail.enabled) {
    return { enabled: false, async send() {}, sendInBackground() {} };
  }

  async function send({ to, subject, html, text, replyTo }) {
    const res = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${mail.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: mail.from,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
    }
    return res.json();
  }

  return {
    enabled: true,
    send,
    sendInBackground(messages) {
      for (const message of messages.filter(Boolean)) {
        send(message).catch((err) => logger.error(`[mail] could not send "${message.subject}": ${err.message}`));
      }
    },
  };
}
