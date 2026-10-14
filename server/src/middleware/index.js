import { StorageDisabledError } from "../storage/index.js";
import { sameDigest } from "../utils/adminSession.js";
import { ValidationError } from "../validation/validate.js";

// Every error response carries both `message` and `error`, which the existing
// frontend forms read (GetQuote/Contact use `message`, CTA uses `error`).
export const fail = (res, status, message, extra = {}) =>
  res.status(status).json({ ok: false, message, error: message, ...extra });

export function notFound(req, res) {
  fail(res, 404, "Not found.");
}

export function errorHandler(logger = console) {
  // Express recognises error handlers by their four arguments.
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    if (err instanceof ValidationError) return fail(res, 400, err.message, { errors: err.errors });
    if (err?.type === "entity.parse.failed") return fail(res, 400, "Request body must be valid JSON.");
    if (err?.type === "entity.too.large") return fail(res, 413, "Request body is too large.");
    if (err instanceof StorageDisabledError) return fail(res, 503, err.message);
    logger.error(`[api] ${req.method} ${req.originalUrl} failed:`, err);
    return fail(res, 500, "Something went wrong. Please try again later.");
  };
}

// Protects /api/admin. Accepts either
//   - a session token from POST /api/admin/login (admin panel): "Authorization: Bearer <token>", or
//   - ADMIN_API_KEY (scripts): "x-admin-key: <key>" or "Authorization: Bearer <key>".
// With neither configured the admin API doesn't exist (404).
export function adminAuth({ apiKey, sessions }) {
  return (req, res, next) => {
    if (!apiKey && !sessions) return notFound(req, res);
    const header = req.get("authorization") ?? "";
    const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
    const key = req.get("x-admin-key") ?? "";

    const byKey = Boolean(apiKey) && [key, bearer].some((v) => v && sameDigest(v, apiKey));
    const bySession = Boolean(sessions) && Boolean(bearer) && sessions.verify(bearer);
    if (!byKey && !bySession) return fail(res, 401, "Please sign in again.");
    return next();
  };
}
