import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMailer } from "../src/mail/mailer.js";

const mail = { enabled: true, resendApiKey: "re_test_key", from: "Sumedha Agro <info@sumedhaagro.com>", companyEmail: "" };

describe("Resend mailer", () => {
  it("posts the message to the Resend API", async () => {
    const calls = [];
    const mailer = createMailer(mail, {
      fetchImpl: async (url, options) => {
        calls.push({ url, options });
        return new Response(JSON.stringify({ id: "email_123" }), { status: 200 });
      },
    });
    const result = await mailer.send({ to: "a@example.com", subject: "Hi", html: "<p>Hi</p>", text: "Hi", replyTo: "b@example.com" });

    assert.deepEqual(result, { id: "email_123" });
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(calls[0].options.headers.Authorization, "Bearer re_test_key");
    assert.deepEqual(JSON.parse(calls[0].options.body), {
      from: "Sumedha Agro <info@sumedhaagro.com>",
      to: ["a@example.com"],
      subject: "Hi",
      html: "<p>Hi</p>",
      text: "Hi",
      reply_to: "b@example.com",
    });
  });

  it("logs failures from background sends instead of throwing", async () => {
    const errors = [];
    const mailer = createMailer(mail, {
      logger: { error: (m) => errors.push(m) },
      fetchImpl: async () => new Response('{"message":"domain not verified"}', { status: 403 }),
    });
    mailer.sendInBackground([{ to: "a@example.com", subject: "Hello", html: "", text: "" }, null]);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(errors.length, 1);
    assert.match(errors[0], /Resend responded 403/);
  });

  it("does nothing when Resend is not configured", async () => {
    const mailer = createMailer({ enabled: false });
    assert.equal(mailer.enabled, false);
    await mailer.send({ to: "a@example.com" });
    mailer.sendInBackground([{ to: "a@example.com" }]);
  });
});
