// Small fetch wrapper for the API (server/). Throws ApiError with the server's message
// and per-field `errors` so forms can show them inline.

export const API_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(path, { method = "GET", body, token, signal, timeoutMs } = {}) {
  const headers = { Accept: "application/json" };
  let payload = body;
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const signals = [signal, timeoutMs ? AbortSignal.timeout(timeoutMs) : null].filter(Boolean);
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal: signals.length > 1 ? AbortSignal.any(signals) : signals[0],
    });
  } catch (err) {
    if (err.name === "AbortError" && signal?.aborted) throw err;
    throw new ApiError("Could not reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.ok === false) {
    throw new ApiError(data?.message || `Request failed (${res.status}).`, { status: res.status, errors: data?.errors });
  }
  return data;
}
