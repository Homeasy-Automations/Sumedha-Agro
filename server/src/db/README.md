# Database layer

The API never talks to a database directly. Services use **repositories** returned by a
**driver**, and the driver is chosen with the `DB_DRIVER` environment variable.

| `DB_DRIVER` | Package | Use for |
|---|---|---|
| `mongodb` (default) | `mongodb` | Production: MongoDB Atlas or self-hosted MongoDB 5+ |
| `memory` | none | Local development without a database, and tests |

Images and video files are not stored in the database: they live in Cloudinary
(`src/storage/`), and records keep only the asset's `public_id`.

## Driver contract

`src/db/drivers/<name>/index.js` must export `createDriver(config)` returning:

```js
{
  name: "mysql",
  async connect() {},          // open connections, create tables/indexes
  async close() {},
  async ping() { return true },// used by GET /api/health
  repositories: {              // one per key in entities.js
    trainingApplications, contactMessages, quoteRequests, subscribers,
    galleryImages, videos, newsItems, trainingPrograms,
  },
  counters,                    // see below
}
```

Every repository implements:

| Method | Returns | Notes |
|---|---|---|
| `create(data)` | record | Adds `id` (string), `createdAt`, `updatedAt` (Date). Throws `DuplicateKeyError` from `errors.js` when a `unique` field in `entities.js` clashes. |
| `findById(id)` | record \| `null` | Unknown or malformed ids return `null`, never throw. |
| `findOne(where)` | record \| `null` | `where` is equality only: `{ field: value }`. Call `assertPlainWhere(where)`. |
| `list({ where, search, limit, offset })` | `{ items, total }` | Newest first (`createdAt` desc). Optional `search: { text, fields }` keeps records where any of the string `fields` contains `text`, ignoring case and matching it literally (no wildcards); combined with `where`. Call `normalizeSearch(search)`. |
| `update(id, patch)` | record \| `null` | Ignores `id`, `createdAt`, `updatedAt` in the patch; sets `updatedAt`. |
| `delete(id)` | `boolean` | `true` if a record was removed. |

`counters` implements `get(name)` (0 if missing) and `increment(name, by = 1)` (atomic, returns the new value).

Records are plain objects whose field values are strings, numbers, booleans or `null`
(`createdAt`/`updatedAt` are `Date`s). The MongoDB driver stores each entity in its own collection
and creates the collections and indexes on startup, so there are no migrations to run.

## Adding a database

1. Create `src/db/drivers/<name>/index.js` implementing the contract above.
2. Register it in `src/db/index.js`.
3. Add the driver to `drivers` in `test/repository.contract.test.js` and run `npm test`.
4. Set `DB_DRIVER=<name>` (plus that database's connection variables) and restart.

No service, route or frontend code changes.
