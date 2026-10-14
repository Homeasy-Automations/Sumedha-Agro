import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const digest = (value) => createHash("sha256").update(String(value)).digest();
const sameDigest = (a, b) => timingSafeEqual(digest(a), digest(b));

// Stateless admin sessions: a signed token issued after a correct ADMIN_PASSWORD.
// Tokens never expire: a sign-in lasts until "Sign out" in the admin panel. The signing key is
// derived from the password, so changing ADMIN_PASSWORD signs everyone out (and is the way to
// cut off a token that may have leaked). No database table is needed, which keeps the
// database layer swappable.
export function createAdminSessions({ password }) {
  if (!password) return null;
  const key = createHash("sha256").update(`sumedha-admin-session:${password}`).digest();
  const sign = (payload) => createHmac("sha256", key).update(payload).digest("base64url");

  return {
    checkPassword: (candidate) => typeof candidate === "string" && candidate.length > 0 && sameDigest(candidate, password),

    issue(now = Date.now()) {
      const payload = Buffer.from(JSON.stringify({ sub: "admin", iat: now })).toString("base64url");
      return { token: `${payload}.${sign(payload)}` };
    },

    // Any `exp` in tokens issued by earlier versions is ignored, so those stay signed in too.
    verify(token) {
      const [payload, signature, extra] = String(token ?? "").split(".");
      if (!payload || !signature || extra !== undefined) return false;
      if (!sameDigest(signature, sign(payload))) return false;
      try {
        return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).sub === "admin";
      } catch {
        return false;
      }
    },
  };
}

export { sameDigest };
