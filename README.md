# Sumedha Agro

Website for **Sumedha Agro — Mushroom Seed (Spawn) Production Laboratory**, Lucknow.

| Part | What | Hosted on |
|---|---|---|
| [`frontend/`](frontend/) | React 19 + Vite 7 + Tailwind v4 site, plus the admin panel at `/admin` | Vercel |
| [`server/`](server/) | Node + Express 5 REST API | Render |
| Database | MongoDB | MongoDB Atlas (free M0) |
| Media | Gallery images and video files | Cloudinary |
| Email | Notifications and confirmations | Resend |

`frontend/` and `server/` are independent: each has its own `package.json`, `.env.example` and deploy settings.

## Run locally

Needs Node 20+.

```bash
# 1. API (terminal 1)
cd server
cp .env.example .env        # set MONGODB_URI, or DB_DRIVER=memory to skip the database
npm install
npm run dev                 # http://localhost:5000  (check: /api/health)

# 2. Website (terminal 2)
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173  (admin: /admin)
```

`DB_DRIVER=memory` runs the API with no database at all (data is lost on restart), which is handy for frontend work.
Without `CLOUDINARY_URL` everything works except uploading images and video files; without `RESEND_API_KEY` submissions are saved but no email is sent.

Checks: `npm run lint` and `npm run build` in `frontend/`; `npm run lint` and `npm test` in `server/`.

## Admin panel

Open `<website>/admin` and sign in with `ADMIN_PASSWORD`. Staff can:

- **Gallery images**: upload photos (resized to 1600 px in the browser, location data removed, stored on Cloudinary), edit descriptions and captions, delete.
- **Videos**: upload video files (MP4/MOV/WebM up to 100 MB, stored on Cloudinary) or add YouTube/Vimeo links.
- **News & announcements** and the **Training schedule** (which also fills the application form's "Training applied for" list).
- **Submissions**: training applications (search by name, mobile, email, reference number, training or batch; status; full details; delete), contact messages, quote requests, subscribers. Each list downloads as an Excel file (`.xlsx`) or CSV; the training applications download follows the current search and status filter.
- Applications made from a batch's **Apply** button on the Training Calendar record that batch (e.g. "S. No. 6 · 16-27 Nov 2026"), shown under the training in the list, in the details, in downloads and in the notification email.

Changes appear on the website immediately. Sign-ins never expire: you stay signed in (even after closing the browser) until you click **Sign out**, so sign out on shared computers. Changing `ADMIN_PASSWORD` signs everyone out everywhere.

## Deploy

### 1. Database: MongoDB Atlas

The API stores its data in MongoDB (`DB_DRIVER=mongodb`, also the default when unset).

1. At [cloud.mongodb.com](https://cloud.mongodb.com), create a free **M0** cluster in **AWS / Singapore (ap-southeast-1)**, next to the Render API (every request queries the database, so it should sit close to the API, not the visitors). Mumbai (ap-south-1) also works, with a little more latency.
2. **Database Access > Add New Database User**: password authentication with **Autogenerate Secure Password** (copy it), and under **Database User Privileges** choose **Specific Privileges** > `readWrite` on the database `sumedha_agro`.
3. **Network Access > Add IP Address > Allow Access from Anywhere** (`0.0.0.0/0`). Render's free plan has no fixed outbound IP address, so the cluster can't be limited to Render. The database user's password is then the only protection, which is why it must be a long generated one.
4. **Connect > Drivers**: copy the connection string, `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`, and put the user's password in it. This is `MONGODB_URI`.
5. On Render set `DB_DRIVER=mongodb`, `MONGODB_URI=<connection string>` and `MONGODB_DB=sumedha_agro`, then redeploy. `GET <render-url>/api/health` returns `{"ok":true,"db":{"driver":"mongodb","status":"up"}}`.

Collections and indexes (unique `referenceId` on training applications and quote requests, unique `email` on subscribers) are created on first start. **Browse Collections** in Atlas shows the data. Backups: `mongodump --uri "$MONGODB_URI" --db sumedha_agro --out backup-$(date +%F)` ([MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools)); restore with `mongorestore --uri "$MONGODB_URI" backup-<date>`.

Atlas pauses an M0 cluster after about 60 days with no connections (resume it from the Atlas UI). `/api/ping`, which the keep-awake workflow calls, doesn't touch the database by design. While the Render service is running, the MongoDB driver keeps its own connections to the cluster open, and real traffic or an occasional `GET /api/health` also counts, so the cluster normally stays active.

### 2. Media: Cloudinary

Create a free account at [cloudinary.com](https://cloudinary.com). In **Settings > API Keys**, copy the **API environment variable** (`cloudinary://…`). This is `CLOUDINARY_URL`. Uploads go to the `CLOUDINARY_FOLDER` folder (default `sumedha-agro`).

### 3. Email: Resend

At [resend.com](https://resend.com): **Domains > Add domain** `sumedhaagro.com` and add the DNS records it shows, then **API Keys > Create**. Set `RESEND_API_KEY`, `MAIL_FROM` (e.g. `Sumedha Agro <info@sumedhaagro.com>`) and `COMPANY_EMAIL`.

### 4. API: Render

Either **New > Blueprint** and pick this repo (uses [`render.yaml`](render.yaml)), or **New > Web Service** with Root Directory `server`, Build Command `npm ci --omit=dev`, Start Command `npm start`, Health Check Path `/api/ping` (not `/api/health`, which queries the database, so a brief Atlas hiccup would make Render restart the API).

| Variable | Required | Value |
|---|---|---|
| `NODE_ENV` | yes | `production` |
| `MONGODB_URI` | yes | Atlas connection string |
| `MONGODB_DB` | no | `sumedha_agro` (the default) |
| `CORS_ORIGIN` | yes | Comma-separated site URLs, e.g. `https://sumedhaagro.com,https://www.sumedhaagro.com,https://<project>.vercel.app` |
| `ADMIN_PASSWORD` | yes | Long passphrase for `/admin` |
| `CLOUDINARY_URL` | for uploads | `cloudinary://<key>:<secret>@<cloud>` |
| `RESEND_API_KEY`, `MAIL_FROM`, `COMPANY_EMAIL` | for email | see above |
| `ADMIN_API_KEY` | no | For scripts calling `/api/admin` |
| `DB_DRIVER` | no | `mongodb` (the default, as in `render.yaml`); `memory` only for local testing |

The API refuses to start without `MONGODB_URI`, and logs a warning for anything else that's missing.

**Keeping the free instance awake.** Render's free plan sleeps after 15 minutes without traffic (the next visitor waits 30–60 s). The GitHub Actions workflow [`keep-render-awake.yml`](.github/workflows/keep-render-awake.yml) pings `/api/ping` every 10 minutes. That endpoint never touches the database, so the pings add no load on Atlas. To turn it on: GitHub repo **Settings > Secrets and variables > Actions > Variables > New repository variable** `RENDER_API_URL` = your Render URL (no trailing slash), then **Actions > Keep Render API awake > Run workflow** once to check. Notes: one always-on free service uses about 730 of Render's 750 free hours a month, so keep other free services off it; GitHub pauses scheduled workflows after 60 days without repository activity (re-enable from the Actions tab).

### 5. Website: Vercel

In the Vercel project: **Settings > General > Root Directory = `frontend`** (Framework preset: Vite), and set `VITE_API_URL` to your Render URL (no trailing slash). Redeploy after changing it; Vite bakes the value in at build time. Then add the Vercel URL and custom domains to `CORS_ORIGIN` on Render.

## API

Base URL: `VITE_API_URL`. Bodies are JSON. Errors look like
`{ "ok": false, "message": "...", "error": "...", "errors"?: { "<field>": "<message>" } }`.

### Public

| Method & path | Body | Success |
|---|---|---|
| `GET /api/ping` | — | `200 { ok: true }`; never touches the database (keep-awake pings, Render health check) |
| `GET /api/health` | — | `200 { ok, db: { driver, status } }` (`503` if the database is down); wakes the database, so use it for manual checks |
| `POST /api/training/apply` | Training application (below) | `201 { ok: true, referenceId: "SAG-TR-XXXXX" }` |
| `POST /api/training/payment-upload` | — | `{ upload }`: signed parameters for uploading one payment screenshot straight to Cloudinary (`payment-screenshots` folder); 20 per hour per visitor |
| `POST /api/contact` | `name` (or `fullName`), `email`, optional `phone`, `company`, `interest`, `message` | `201 { ok: true, message }` |
| `POST /api/quote` | `product`, `name`, `email`, optional quote fields | `201 { ok: true, referenceId: "SAG-QT-XXXXX" }` |
| `POST /api/subscribe` | `email` | `201` new, `200` already subscribed |
| `GET /api/visitors`, `POST /api/visitors/hit` | — | `{ ok: true, count }` (the site counts once per browser session) |
| `GET /api/content/gallery` | — | `{ items: [{ id, src, thumbnailSrc, alt, caption, width, height }] }` |
| `GET /api/content/videos` | — | `{ items: [{ id, title, provider: "upload"\|"youtube"\|"vimeo", videoUrl? , embedUrl?, thumbnailUrl }] }` |
| `GET /api/content/news` | — | `{ items: [{ id, title, date, body, link }] }` (latest date first) |
| `GET /api/content/trainings` | — | `{ items: [{ id, group, sNo, title, dates, startDate, endDate, registrationDates, registrationStart, registrationEnd, registrationLink, fees, language, duration, coordinator, note, admissionStatus }] }` (Training Calendar batches; dates are `YYYY-MM-DD`, Indian dates) |
| `GET /api/content/training-page` | — | `{ item, updatedAt }`: the Training page text saved in the admin panel (calendar notes, Training Details, Course Contents), or `item: null` while the website's defaults apply |

### Training application

| Field | Rule |
|---|---|
| `trainingAppliedFor`, `name`, `postalAddress`, `education`, `livingPlace`, `employment` | required text |
| `trainingDate` | `YYYY-MM-DD`; the chosen batch's start date (the form fills it in). Required unless `trainingBatch` is sent |
| `dateOfBirth` | required, `YYYY-MM-DD`, in the past |
| `gender` | `Male` \| `Female` |
| `category` | `SC` \| `ST` \| `OBC` \| `General` |
| `state` | an Indian state or union territory |
| `mobile` | 10 digits (spaces and hyphens ignored) |
| `aadhar` | 12 digits (spaces and hyphens ignored); shown masked in lists, exports and emails |
| `email` | valid email |
| `previousTraining`, `cultivatedBefore` | `Yes` \| `No` |
| `previousTrainingDetails` | optional; cleared unless `previousTraining` is `Yes` |
| `clientReferenceId` | optional `SAG-TR-XXXXX` from the browser; used if free, otherwise a new one is issued |
| `trainingBatchId`, `trainingBatch` | optional (max 100 / 300 characters): the Training Calendar batch applied for and its label, e.g. `S. No. 6 · 16-27 Nov 2026`. The form offers only batches whose registration is open (the one linked with `?training=<id>` is pre-selected) |
| `paymentScreenshotId`, `paymentScreenshotFormat` | the uploaded payment screenshot's `public_id` (from `/api/training/payment-upload`) and the format Cloudinary reported; any image format or a PDF receipt (up to 10 MB), required while Cloudinary is configured. A PDF is shown to admins by its first page, which needs **Allow delivery of PDF and ZIP files** turned on in Cloudinary's Security settings. Admins see it with the application (`paymentScreenshotUrl`), the company email links to it, and deleting the application deletes it. The QR code shown on the form is `frontend/public/payment-qr.jpg` |

Unknown fields are ignored. On a `400`, `errors` maps each field to the same message the form shows inline.

### Admin

`POST /api/admin/login` with `{ "password": "<ADMIN_PASSWORD>" }` returns `{ token }` (it does not expire; changing `ADMIN_PASSWORD` invalidates every token). Send it as `Authorization: Bearer <token>` (scripts may use `x-admin-key: <ADMIN_API_KEY>` instead). Lists take `?limit=` (1–100) and `?offset=` and return `{ items, total }`.

| Method & path | Notes |
|---|---|
| `GET /api/admin/stats` | Totals per collection plus visitor count |
| `GET /api/admin/training-applications` | `?status=new\|reviewed\|accepted\|rejected`, `?q=` search text (reference number, name, email, mobile, training, batch, state; case-insensitive; spaces in numbers ignored); Aadhar masked |
| `GET` / `PATCH` / `DELETE /api/admin/training-applications/:id` | Full record / `{ "status": "accepted" }` / delete |
| `GET`, `DELETE /api/admin/contact-messages[/:id]`, `/quote-requests[/:id]`, `/subscribers[/:id]` | List / delete |
| `POST /api/admin/uploads` | `{ "kind": "image" \| "video" }` → signed parameters for uploading the file straight to Cloudinary |
| `POST /api/admin/gallery` | `{ publicId, alt?, caption?, width?, height? }` after the Cloudinary upload |
| `POST /api/admin/videos` | `{ publicId, title }` (uploaded file) or `{ url, title }` (YouTube/Vimeo) |
| `POST /api/admin/news`, `/trainings` | Item fields as listed above |
| `PUT` / `DELETE /api/admin/{gallery,videos,news,trainings}/:id` | Edit / delete (deleting media also removes it from Cloudinary) |
| `POST /api/admin/trainings/import` | `{ items: [batch, …] }` (up to 100): adds several batches in order, only while the calendar is empty; nothing is saved if any row is invalid (errors keyed `items.<n>.<field>`) |
| `PUT` / `DELETE /api/admin/training-page` | Save the Training page text (shape in [`server/src/validation/trainingPage.js`](server/src/validation/trainingPage.js); keys left out keep the defaults) / reset to the defaults |

## Switching databases

Services talk to a small repository interface, never to a database directly. `DB_DRIVER` picks the driver:

- `mongodb` (default): [`server/src/db/drivers/mongodb`](server/src/db/drivers/mongodb/index.js)
- `memory`: [`server/src/db/drivers/memory`](server/src/db/drivers/memory/index.js), for development and tests

To add another database, implement the contract in [`server/src/db/README.md`](server/src/db/README.md), register it in `server/src/db/index.js`, and run the shared contract tests in `server/test/repository.contract.test.js`. No route, service or frontend changes are needed. Media storage is swappable the same way ([`server/src/storage/`](server/src/storage/index.js)).

Run the test suite against a real database:
`TEST_DB_DRIVER=mongodb TEST_MONGODB_URI=<uri> npm test`.
Each test server uses its own `sumedha_test_*` database and drops it when it finishes. Against Atlas this needs a database user allowed to create those databases (e.g. **Read and write to any database**), so don't use the production user limited to `sumedha_agro`; a separate user, a separate cluster or a local MongoDB all work.

## Project layout

```
frontend/
  src/data/content.js        all site copy (client text, verbatim)
  src/data/trainingForm.js   training form labels, options, messages
  src/data/trainings.js      default training schedule (used until rows are added in /admin)
  src/pages, src/components  React pages and components
  src/admin/                 admin panel (lazy-loaded; not part of the public bundle)
server/
  src/index.js               entry point (config, database, HTTP server)
  src/app.js                 Express app
  src/config.js              environment variables
  src/routes/                public.js, content.js, admin.js
  src/services/              business logic (database-agnostic)
  src/validation/            request validation
  src/db/                    repository contract + drivers (mongodb, memory)
  src/storage/               media storage (Cloudinary)
  src/mail/                  Resend mailer and email templates
  test/                      node:test suites
.github/workflows/           keep-render-awake.yml
render.yaml                  Render Blueprint for the API
```
