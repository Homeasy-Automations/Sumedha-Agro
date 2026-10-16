import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createHash, createHmac } from "node:crypto";
import { createAdminSessions } from "../src/utils/adminSession.js";
import { signParams } from "../src/storage/cloudinary.js";
import { parseVideoUrl } from "../src/utils/media.js";
import { ADMIN_KEY, ADMIN_PASSWORD, CLOUDINARY, startTestServer } from "./support/testServer.js";

describe("admin sessions", () => {
  const sessions = createAdminSessions({ password: "secret-password" });

  it("issues tokens that never expire", () => {
    const issued = sessions.issue();
    assert.deepEqual(Object.keys(issued), ["token"]);
    assert.equal(sessions.verify(issued.token), true);

    // A token issued years ago still works.
    assert.equal(sessions.verify(sessions.issue(Date.UTC(2020, 0, 1)).token), true);

    // So does one from the earlier version, which carried an expiry time that has passed.
    const key = createHash("sha256").update("sumedha-admin-session:secret-password").digest();
    const legacy = Buffer.from(JSON.stringify({ sub: "admin", exp: Date.UTC(2020, 0, 1) })).toString("base64url");
    assert.equal(sessions.verify(`${legacy}.${createHmac("sha256", key).update(legacy).digest("base64url")}`), true);
  });

  it("rejects tampered tokens and tokens signed with another password", () => {
    const { token } = sessions.issue();
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "admin", exp: Date.now() + 1e9 })).toString("base64url");
    assert.equal(sessions.verify(`${forged}.${signature}`), false);
    assert.equal(sessions.verify(`${payload}.${signature}x`), false);
    assert.equal(sessions.verify("garbage"), false);
    const other = createAdminSessions({ password: "different" });
    assert.equal(other.verify(token), false);
  });
});

describe("Cloudinary signing", () => {
  it("matches Cloudinary's documented example", () => {
    // https://cloudinary.com/documentation/authentication_signatures
    const params = { eager: "w_400,h_300,c_pad|w_260,h_200,c_crop", public_id: "sample_image", timestamp: 1315060510 };
    assert.equal(signParams(params, "abcd"), "bfd09f95f331f558cbd1320e67aa8d488770583e");
  });
});

describe("video links", () => {
  it("parses YouTube and Vimeo links", () => {
    const yt = { provider: "youtube", videoId: "dQw4w9WgXcQ" };
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s",
      "https://youtu.be/dQw4w9WgXcQ?si=abc",
      "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/live/dQw4w9WgXcQ",
    ]) {
      assert.deepEqual(parseVideoUrl(url), yt, url);
    }
    assert.deepEqual(parseVideoUrl("https://vimeo.com/76979871"), { provider: "vimeo", videoId: "76979871" });
    assert.deepEqual(parseVideoUrl("https://player.vimeo.com/video/76979871"), { provider: "vimeo", videoId: "76979871" });
    assert.equal(parseVideoUrl("https://example.com/watch?v=dQw4w9WgXcQ"), null);
    assert.equal(parseVideoUrl("javascript:alert(1)"), null);
    assert.equal(parseVideoUrl("not a url"), null);
  });
});

describe("admin panel API", () => {
  let t;
  let auth;

  before(async () => {
    t = await startTestServer({ ADMIN_PASSWORD });
  });
  after(() => t.close());

  describe("login", () => {
    it("rejects a wrong password", async () => {
      const res = await t.api("POST", "/api/admin/login", { body: { password: "wrong" } });
      assert.equal(res.status, 401);
      assert.equal(res.body.message, "Incorrect password.");
    });

    it("returns a session token for the right password", async () => {
      const res = await t.api("POST", "/api/admin/login", { body: { password: ADMIN_PASSWORD } });
      assert.equal(res.status, 200);
      assert.equal(typeof res.body.token, "string");
      assert.equal(res.body.expiresAt, undefined); // sign-ins don't expire
      auth = { headers: { Authorization: `Bearer ${res.body.token}` } };
      assert.equal((await t.api("GET", "/api/admin/session", auth)).status, 200);
    });

    it("rejects missing or tampered tokens", async () => {
      assert.equal((await t.api("GET", "/api/admin/session")).status, 401);
      const bad = { headers: { Authorization: `${auth.headers.Authorization}x` } };
      assert.equal((await t.api("GET", "/api/admin/session", bad)).status, 401);
    });

    it("is unavailable when ADMIN_PASSWORD isn't set", async () => {
      const other = await startTestServer();
      try {
        const res = await other.api("POST", "/api/admin/login", { body: { password: "x" } });
        assert.equal(res.status, 404);
      } finally {
        await other.close();
      }
    });
  });

  describe("content changes need admin access", () => {
    it("rejects anonymous writes", async () => {
      assert.equal((await t.api("POST", "/api/admin/news", { body: { title: "x", date: "2026-01-01" } })).status, 401);
      assert.equal((await t.api("POST", "/api/admin/uploads", { body: { kind: "image" } })).status, 401);
      assert.equal((await t.api("DELETE", "/api/admin/videos/whatever")).status, 401);
      assert.equal((await t.api("POST", "/api/admin/trainings/import", { body: { items: [{ title: "x" }] } })).status, 401);
      assert.equal((await t.api("PUT", "/api/admin/training-page", { body: {} })).status, 401);
      assert.equal((await t.api("DELETE", "/api/admin/training-page")).status, 401);
    });
  });

  describe("gallery (Cloudinary)", () => {
    let item;
    const publicId = `${CLOUDINARY.folder}/gallery/oyster_abc123`;

    it("signs a direct browser upload into the site's gallery folder", async () => {
      const res = await t.api("POST", "/api/admin/uploads", { ...auth, body: { kind: "image" } });
      assert.equal(res.status, 200);
      const { uploadUrl, fields, maxBytes } = res.body.upload;
      assert.equal(uploadUrl, `${CLOUDINARY.apiBaseUrl}/v1_1/${CLOUDINARY.cloudName}/image/upload`);
      assert.equal(fields.folder, `${CLOUDINARY.folder}/gallery`);
      assert.equal(fields.api_key, CLOUDINARY.apiKey);
      assert.equal(fields.allowed_formats, "jpg,jpeg,png,webp,gif");
      const { signature, api_key: _key, ...signed } = fields;
      assert.equal(signature, signParams(signed, CLOUDINARY.apiSecret));
      assert.ok(maxBytes > 0);

      const bad = await t.api("POST", "/api/admin/uploads", { ...auth, body: { kind: "pdf" } });
      assert.equal(bad.status, 400);
    });

    it("saves the uploaded image and serves optimized Cloudinary URLs", async () => {
      const res = await t.api("POST", "/api/admin/gallery", {
        ...auth,
        body: { publicId, alt: "Oyster mushrooms in the lab", caption: "Batch 12", width: "1200", height: "800" },
      });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      item = res.body.item;
      const base = `${CLOUDINARY.deliveryBaseUrl}/${CLOUDINARY.cloudName}/image/upload`;
      assert.equal(item.src, `${base}/f_auto,q_auto,c_limit,w_1600/${publicId}`);
      assert.equal(item.thumbnailSrc, `${base}/f_auto,q_auto,c_fill,g_auto,w_600,h_600/${publicId}`);
      assert.equal(item.width, 1200);
      assert.equal(item.publicId, undefined);

      const list = await t.api("GET", "/api/content/gallery");
      assert.equal(list.body.items[0].id, item.id);
      assert.equal(list.headers.get("cache-control"), "no-cache");
    });

    it("rejects assets outside the site's folder", async () => {
      const foreign = await t.api("POST", "/api/admin/gallery", { ...auth, body: { publicId: "someone-else/cat", alt: "x" } });
      assert.equal(foreign.status, 400);
      assert.match(foreign.body.errors.publicId, /Upload the file again/);
      const traversal = await t.api("POST", "/api/admin/gallery", {
        ...auth,
        body: { publicId: `${CLOUDINARY.folder}/gallery/../videos/x`, alt: "x" },
      });
      assert.equal(traversal.status, 400);
    });

    it("accepts an image without alt text or caption (both optional)", async () => {
      const res = await t.api("POST", "/api/admin/gallery", { ...auth, body: { publicId: `${CLOUDINARY.folder}/gallery/plain` } });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      assert.equal(res.body.item.alt, "");
      assert.equal(res.body.item.caption, "");
      assert.equal((await t.api("DELETE", `/api/admin/gallery/${res.body.item.id}`, auth)).status, 200);
    });

    it("edits alt text and caption, and allows clearing them", async () => {
      const res = await t.api("PUT", `/api/admin/gallery/${item.id}`, { ...auth, body: { alt: "New alt", caption: "" } });
      assert.equal(res.body.item.alt, "New alt");
      assert.equal(res.body.item.caption, "");
      const cleared = await t.api("PUT", `/api/admin/gallery/${item.id}`, { ...auth, body: { alt: "", caption: "" } });
      assert.equal(cleared.status, 200, JSON.stringify(cleared.body));
      assert.equal(cleared.body.item.alt, "");
    });

    it("deletes the record and the Cloudinary asset", async () => {
      assert.equal((await t.api("DELETE", `/api/admin/gallery/${item.id}`, auth)).status, 200);
      assert.equal((await t.api("GET", "/api/content/gallery")).body.items.length, 0);
      const call = t.storage.destroyed.at(-1);
      assert.equal(call.url, `${CLOUDINARY.apiBaseUrl}/v1_1/${CLOUDINARY.cloudName}/image/destroy`);
      assert.equal(call.params.public_id, publicId);
      const { signature, api_key: _key, ...signed } = call.params;
      assert.equal(signature, signParams(signed, CLOUDINARY.apiSecret));
      assert.equal((await t.api("DELETE", `/api/admin/gallery/${item.id}`, auth)).status, 404);
    });
  });

  describe("videos", () => {
    it("adds a YouTube link with embed and thumbnail URLs", async () => {
      const res = await t.api("POST", "/api/admin/videos", {
        ...auth,
        body: { url: "https://youtu.be/dQw4w9WgXcQ", title: "Spawn preparation" },
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.item.embedUrl, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      assert.equal(res.body.item.thumbnailUrl, "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");

      const list = await t.api("GET", "/api/content/videos");
      assert.equal(list.body.items[0].title, "Spawn preparation");

      const renamed = await t.api("PUT", `/api/admin/videos/${res.body.item.id}`, { ...auth, body: { title: "Renamed" } });
      assert.equal(renamed.body.item.title, "Renamed");
      assert.equal((await t.api("DELETE", `/api/admin/videos/${res.body.item.id}`, auth)).status, 200);
    });

    it("adds an uploaded video file with a playable URL and poster, and deletes it from Cloudinary", async () => {
      const sig = await t.api("POST", "/api/admin/uploads", { ...auth, body: { kind: "video" } });
      assert.match(sig.body.upload.uploadUrl, /\/video\/upload$/);
      assert.equal(sig.body.upload.fields.folder, `${CLOUDINARY.folder}/videos`);

      const publicId = `${CLOUDINARY.folder}/videos/spawn_demo`;
      const res = await t.api("POST", "/api/admin/videos", { ...auth, body: { publicId, title: "Spawn demo" } });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      const base = `${CLOUDINARY.deliveryBaseUrl}/${CLOUDINARY.cloudName}/video/upload`;
      assert.equal(res.body.item.provider, "upload");
      assert.equal(res.body.item.videoUrl, `${base}/q_auto/${publicId}.mp4`);
      assert.equal(res.body.item.thumbnailUrl, `${base}/so_1,c_limit,w_960/${publicId}.jpg`);

      const wrongFolder = await t.api("POST", "/api/admin/videos", {
        ...auth,
        body: { publicId: `${CLOUDINARY.folder}/gallery/x`, title: "x" },
      });
      assert.equal(wrongFolder.status, 400);

      await t.api("DELETE", `/api/admin/videos/${res.body.item.id}`, auth);
      assert.match(t.storage.destroyed.at(-1).url, /\/video\/destroy$/);
    });

    it("rejects links that aren't YouTube or Vimeo videos", async () => {
      const res = await t.api("POST", "/api/admin/videos", {
        ...auth,
        body: { url: "https://example.com/video.mp4", title: "x" },
      });
      assert.equal(res.status, 400);
      assert.equal(res.body.errors.url, "Paste a YouTube or Vimeo video link.");
      const notUrl = await t.api("POST", "/api/admin/videos", { ...auth, body: { url: "hello", title: "x" } });
      assert.equal(notUrl.body.errors.url, "Enter a full link starting with https://");
    });
  });

  describe("news", () => {
    it("creates, lists by date (latest first), updates and deletes items", async () => {
      const older = await t.api("POST", "/api/admin/news", {
        ...auth,
        body: { title: "Older", date: "2026-01-10", body: "First batch" },
      });
      const newer = await t.api("POST", "/api/admin/news", {
        ...auth,
        body: { title: "Newer", date: "2026-03-05", link: "https://sumedhaagro.com" },
      });
      assert.equal(older.status, 201);
      const list = await t.api("GET", "/api/content/news");
      assert.deepEqual(list.body.items.map((n) => n.title), ["Newer", "Older"]);

      const updated = await t.api("PUT", `/api/admin/news/${older.body.item.id}`, {
        ...auth,
        body: { title: "Older (edited)", date: "2026-01-10" },
      });
      assert.equal(updated.body.item.title, "Older (edited)");
      assert.equal(updated.body.item.body, "");
      assert.equal((await t.api("DELETE", `/api/admin/news/${newer.body.item.id}`, auth)).status, 200);
      assert.equal((await t.api("GET", "/api/content/news")).body.items.length, 1);
    });

    it("validates title, date and link", async () => {
      const res = await t.api("POST", "/api/admin/news", { ...auth, body: { date: "31-01-2026", link: "ftp://x" } });
      assert.deepEqual(res.body.errors, {
        title: "This field is required.",
        date: "Enter a valid date.",
        link: "Enter a full link starting with https://",
      });
    });
  });

  describe("training schedule", () => {
    it("keeps rows in the order they were added", async () => {
      for (const title of ["Spawn Production Training", "Oyster Cultivation"]) {
        const res = await t.api("POST", "/api/admin/trainings", {
          ...auth,
          body: { title, dates: "1–5 Dec 2026", duration: "5 days", fees: "₹5,000", admissionStatus: "Open" },
        });
        assert.equal(res.status, 201);
      }
      const list = await t.api("GET", "/api/content/trainings");
      assert.deepEqual(list.body.items.map((r) => r.title), ["Spawn Production Training", "Oyster Cultivation"]);
      assert.equal(list.body.items[0].fees, "₹5,000");

      const res = await t.api("PUT", `/api/admin/trainings/${list.body.items[1].id}`, {
        ...auth,
        body: { title: "Oyster Cultivation", admissionStatus: "Closed" },
      });
      assert.equal(res.body.item.admissionStatus, "Closed");
      assert.equal(res.body.item.dates, "");
    });

    it("requires a title", async () => {
      const res = await t.api("POST", "/api/admin/trainings", { ...auth, body: { dates: "soon" } });
      assert.equal(res.status, 400);
      assert.equal(res.body.errors.title, "This field is required.");
    });

    it("saves every calendar field", async () => {
      const batch = {
        group: "cultivation",
        sNo: "3",
        title: "Training on mushroom cultivation technology for farmers",
        dates: "",
        startDate: "2026-11-13",
        endDate: "2026-11-18",
        registrationDates: "01-10 September 2026",
        registrationStart: "2026-09-01",
        registrationEnd: "2026-09-10",
        registrationLink: "https://forms.gle/example",
        fees: "3000/-",
        language: "Hindi/English",
        duration: "6 Days",
        coordinator: "Dr. Enespa, Dr. Prem Chandra",
        note: "",
        admissionStatus: "",
      };
      const res = await t.api("POST", "/api/admin/trainings", { ...auth, body: { ...batch, unexpected: "dropped" } });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      const { id, createdAt, ...saved } = res.body.item;
      assert.ok(id && createdAt);
      assert.deepEqual(saved, batch);
    });

    it("checks the calendar fields", async () => {
      const bad = await t.api("POST", "/api/admin/trainings", {
        ...auth,
        body: { title: "x", group: "other", sNo: "first", startDate: "2026-02-30", registrationLink: "forms.gle/x" },
      });
      assert.equal(bad.status, 400);
      assert.deepEqual(bad.body.errors, {
        group: "Select a valid option.",
        sNo: "Must be a whole number.",
        startDate: "Enter a valid date.",
        registrationLink: "Enter a full link starting with https://",
      });

      const ranges = await t.api("POST", "/api/admin/trainings", {
        ...auth,
        body: { title: "x", startDate: "2026-11-18", endDate: "2026-11-13", registrationStart: "2026-09-01" },
      });
      assert.equal(ranges.status, 400);
      assert.deepEqual(ranges.body.errors, {
        registrationEnd: "Enter both registration dates, or neither.",
        endDate: "Must be on or after the start date.",
      });

      const closesFirst = await t.api("POST", "/api/admin/trainings", {
        ...auth,
        body: { title: "x", registrationStart: "2026-09-10", registrationEnd: "2026-09-01" },
      });
      assert.equal(closesFirst.body.errors.registrationEnd, "Must be on or after the opening date.");
    });
  });

  describe("training calendar import and page text", () => {
    let s;
    const key = { headers: { "x-admin-key": ADMIN_KEY } };
    before(async () => {
      s = await startTestServer();
    });
    after(() => s.close());

    it("imports several batches only while the calendar is empty, validating all of them first", async () => {
      const bad = await s.api("POST", "/api/admin/trainings/import", {
        ...key,
        body: { items: [{ title: "Batch 1" }, { title: "", startDate: "soon" }] },
      });
      assert.equal(bad.status, 400);
      assert.deepEqual(bad.body.errors, { "items.1.title": "This field is required.", "items.1.startDate": "Enter a valid date." });
      assert.equal((await s.api("GET", "/api/content/trainings")).body.items.length, 0, "nothing is saved when a row is invalid");

      const items = [1, 2, 3].map((n) => ({ group: "spawn", sNo: String(n), title: "Spawn production", dates: `Batch ${n}` }));
      const res = await s.api("POST", "/api/admin/trainings/import", { ...key, body: { items } });
      assert.equal(res.status, 201, JSON.stringify(res.body));
      assert.equal(res.body.items.length, 3);
      const list = (await s.api("GET", "/api/content/trainings")).body.items;
      assert.deepEqual(list.map((r) => r.dates).sort(), ["Batch 1", "Batch 2", "Batch 3"]);

      const again = await s.api("POST", "/api/admin/trainings/import", { ...key, body: { items } });
      assert.equal(again.status, 400);
      assert.match(again.body.errors.items, /already has batches/);
    });

    it("has no saved page text until the admin saves some", async () => {
      const res = await s.api("GET", "/api/content/training-page");
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { ok: true, item: null, updatedAt: null });
    });

    it("saves the page text, keeping only known fields and dropping blank lines", async () => {
      const res = await s.api("PUT", "/api/admin/training-page", {
        ...key,
        body: {
          calendar: {
            notice: { label: " Important Instruction: ", text: "Only Indian Citizens with valid ID Proof can apply", color: "red" },
            notes: { specialNote: { items: [{ label: "Eligibility:", text: "Applied since August" }, { label: "", text: " " }] } },
            terms: { note: { items: ["Fee is non-refundable.", "", "  "] } },
          },
          details: {
            courseSections: [{ title: "(Entrepreneurs Training- Theory)", items: ["Mushrooms- An Agri-business", ""] }, { title: "", items: [] }],
          },
          extra: "dropped",
        },
      });
      assert.equal(res.status, 200, JSON.stringify(res.body));
      const expected = {
        calendar: {
          notice: { label: "Important Instruction:", text: "Only Indian Citizens with valid ID Proof can apply" },
          notes: { specialNote: { items: [{ label: "Eligibility:", text: "Applied since August" }] } },
          terms: { note: { items: ["Fee is non-refundable."] } },
        },
        details: { courseSections: [{ title: "(Entrepreneurs Training- Theory)", items: ["Mushrooms- An Agri-business"] }] },
      };
      assert.deepEqual(res.body.item, expected);

      const read = await s.api("GET", "/api/content/training-page");
      assert.deepEqual(read.body.item, expected);
      assert.ok(read.body.updatedAt);

      // Saving again replaces the saved text (one record, not a new one).
      await s.api("PUT", "/api/admin/training-page", { ...key, body: { details: { heading: "Training Details" } } });
      assert.deepEqual((await s.api("GET", "/api/content/training-page")).body.item, { details: { heading: "Training Details" } });
      assert.equal((await s.api("GET", "/api/admin/stats", key)).body.totals.siteSettings, 1);
    });

    it("rejects page text that is too long or has too many entries", async () => {
      const res = await s.api("PUT", "/api/admin/training-page", {
        ...key,
        body: { calendar: { notice: { text: "x".repeat(501) } }, details: { mushrooms: Array.from({ length: 31 }, (_, i) => `M${i}`) } },
      });
      assert.equal(res.status, 400);
      assert.deepEqual(res.body.errors, {
        "calendar.notice.text": "Must be at most 500 characters.",
        "details.mushrooms": "At most 30 entries.",
      });
    });

    it("resets the page text to the website's defaults", async () => {
      assert.equal((await s.api("DELETE", "/api/admin/training-page", key)).status, 200);
      assert.equal((await s.api("GET", "/api/content/training-page")).body.item, null);
      assert.equal((await s.api("DELETE", "/api/admin/training-page", key)).status, 200, "resetting twice is fine");
    });
  });

  describe("submissions", () => {
    it("lets admins delete a contact message", async () => {
      await t.api("POST", "/api/contact", { body: { name: "Spam bot", email: "spam@example.com" } });
      const { items } = (await t.api("GET", "/api/admin/contact-messages", auth)).body;
      const res = await t.api("DELETE", `/api/admin/contact-messages/${items[0].id}`, auth);
      assert.equal(res.status, 200);
      assert.equal((await t.api("GET", "/api/admin/contact-messages", auth)).body.total, 0);
    });

    it("reports totals for every collection", async () => {
      const { totals } = (await t.api("GET", "/api/admin/stats", auth)).body;
      for (const key of ["trainingApplications", "galleryImages", "videos", "newsItems", "trainingPrograms", "visitors"]) {
        assert.equal(typeof totals[key], "number", key);
      }
      assert.equal(totals.trainingPrograms, 3); // added by the "training schedule" tests above
    });
  });

  describe("without Cloudinary", () => {
    it("explains that uploads are not configured", async () => {
      const other = await startTestServer({ ADMIN_PASSWORD }, { storage: "disabled" });
      try {
        const login = await other.api("POST", "/api/admin/login", { body: { password: ADMIN_PASSWORD } });
        const res = await other.api("POST", "/api/admin/uploads", {
          headers: { Authorization: `Bearer ${login.body.token}` },
          body: { kind: "image" },
        });
        assert.equal(res.status, 503);
        assert.match(res.body.message, /CLOUDINARY_URL/);
      } finally {
        await other.close();
      }
    });
  });
});
