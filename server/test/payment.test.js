// Training fee payment: applicants upload a screenshot of their payment with the application.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { signParams } from "../src/storage/cloudinary.js";
import { ADMIN_KEY, CLOUDINARY, startTestServer, validApplication } from "./support/testServer.js";

describe("payment screenshots", () => {
  let s;
  const key = { headers: { "x-admin-key": ADMIN_KEY } };
  const shot = `${CLOUDINARY.folder}/payment-screenshots/aaaaaaaaaaaaaaaaaaaaaaaa`;
  const url = `${CLOUDINARY.deliveryBaseUrl}/${CLOUDINARY.cloudName}/image/upload/f_auto,q_auto,c_limit,w_1600/${shot}`;

  before(async () => {
    s = await startTestServer();
  });
  after(() => s.close());

  it("signs one upload at a time into the screenshots folder", async () => {
    const a = (await s.api("POST", "/api/training/payment-upload")).body.upload;
    const b = (await s.api("POST", "/api/training/payment-upload")).body.upload;
    assert.equal(a.fields.folder, `${CLOUDINARY.folder}/payment-screenshots`);
    assert.equal(a.fields.allowed_formats, "jpg,jpeg,png,webp,gif,bmp,tif,tiff,heic,heif,avif,pdf");
    assert.equal(a.maxBytes, 10 * 1024 * 1024);
    assert.match(a.fields.public_id, /^[0-9a-f]{24}$/);
    assert.notEqual(a.fields.public_id, b.fields.public_id, "each signature is for its own file");
    const { api_key: apiKey, signature, ...signed } = a.fields;
    assert.equal(apiKey, CLOUDINARY.apiKey);
    assert.equal(signature, signParams(signed, CLOUDINARY.apiSecret));
  });

  it("requires a screenshot from this site's screenshot folder, reported with the other fields", async () => {
    const none = await s.api("POST", "/api/training/apply", { body: validApplication({ paymentScreenshotId: "" }) });
    assert.equal(none.status, 400);
    assert.deepEqual(none.body.errors, { paymentScreenshotId: "Upload a screenshot of your payment." });

    const withOthers = await s.api("POST", "/api/training/apply", { body: validApplication({ name: "", paymentScreenshotId: "" }) });
    assert.deepEqual(Object.keys(withOthers.body.errors).sort(), ["name", "paymentScreenshotId"]);

    const foreign = await s.api("POST", "/api/training/apply", {
      body: validApplication({ paymentScreenshotId: `${CLOUDINARY.folder}/gallery/photo` }),
    });
    assert.equal(foreign.body.errors.paymentScreenshotId, "Upload the payment screenshot again.");
  });

  it("saves the screenshot, links it in the company email and shows it to admins", async () => {
    s.mailer.sent.length = 0;
    const res = await s.api("POST", "/api/training/apply", { body: validApplication({ paymentScreenshotId: shot }) });
    assert.equal(res.status, 201, JSON.stringify(res.body));

    const [company, applicant] = s.mailer.sent;
    assert.ok(company.html.includes(`<a href="${url}"`), "the company email links to the screenshot");
    assert.ok(company.text.includes(`Payment screenshot: ${url}`));
    assert.ok(!applicant.html.includes(url), "the applicant's email doesn't include it");

    const { items } = (await s.api("GET", "/api/admin/training-applications", key)).body;
    const app = items.find((i) => i.referenceId === res.body.referenceId);
    assert.equal(app.paymentScreenshotId, shot);
    assert.equal(app.paymentScreenshotUrl, url);
    assert.equal((await s.api("GET", `/api/admin/training-applications/${app.id}`, key)).body.item.paymentScreenshotUrl, url);
  });

  it("accepts a PDF receipt: admins see its first page, the email links to the PDF", async () => {
    const pdf = `${CLOUDINARY.folder}/payment-screenshots/bbbbbbbbbbbbbbbbbbbbbbbb`;
    const base = `${CLOUDINARY.deliveryBaseUrl}/${CLOUDINARY.cloudName}/image/upload`;
    s.mailer.sent.length = 0;
    const res = await s.api("POST", "/api/training/apply", {
      body: validApplication({ paymentScreenshotId: pdf, paymentScreenshotFormat: "PDF" }),
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.ok(s.mailer.sent[0].html.includes(`<a href="${base}/${pdf}.pdf"`), "the company email links to the PDF");

    const { items } = (await s.api("GET", "/api/admin/training-applications", key)).body;
    const app = items.find((i) => i.referenceId === res.body.referenceId);
    assert.equal(app.paymentScreenshotFormat, "pdf");
    assert.equal(app.paymentScreenshotUrl, `${base}/pg_1,f_jpg,q_auto,c_limit,w_1600/${pdf}.jpg`);
    assert.equal(app.paymentScreenshotThumbUrl, `${base}/pg_1,f_jpg,q_auto,c_fill,g_north,w_200,h_200/${pdf}.jpg`);
    assert.equal(app.paymentScreenshotFileUrl, `${base}/${pdf}.pdf`);
  });

  it("deletes the screenshot with its application", async () => {
    const { items } = (await s.api("GET", "/api/admin/training-applications", key)).body;
    const app = items.find((i) => i.paymentScreenshotId === shot);
    assert.equal((await s.api("DELETE", `/api/admin/training-applications/${app.id}`, key)).status, 200);
    const call = s.storage.destroyed.at(-1);
    assert.equal(call.url, `${CLOUDINARY.apiBaseUrl}/v1_1/${CLOUDINARY.cloudName}/image/destroy`);
    assert.equal(call.params.public_id, shot);
  });

  it("limits how often one visitor can ask for uploads", async () => {
    const other = await startTestServer();
    try {
      const statuses = [];
      for (let i = 0; i < 21; i++) statuses.push((await other.api("POST", "/api/training/payment-upload")).status);
      assert.ok(statuses.slice(0, 20).every((status) => status === 200));
      assert.equal(statuses[20], 429);
    } finally {
      await other.close();
    }
  });

  it("doesn't ask for a screenshot when media storage isn't set up", async () => {
    const other = await startTestServer({}, { storage: "disabled" });
    try {
      assert.equal((await other.api("POST", "/api/training/payment-upload")).status, 503);
      const res = await other.api("POST", "/api/training/apply", { body: validApplication({ paymentScreenshotId: "" }) });
      assert.equal(res.status, 201, JSON.stringify(res.body));
    } finally {
      await other.close();
    }
  });
});
