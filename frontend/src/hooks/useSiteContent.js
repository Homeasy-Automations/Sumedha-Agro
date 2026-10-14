import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

// Content managed in the admin panel (gallery, videos, news, trainings), fetched once per
// page load and shared between components. Falls back to the static defaults in
// src/data when the API is unreachable or nothing has been added yet.

const TIMEOUT_MS = 15_000;
const cache = new Map(); // kind -> Promise<items>

function load(kind) {
  if (!cache.has(kind)) {
    const promise = apiRequest(`/api/content/${kind}`, { timeoutMs: TIMEOUT_MS }).then((data) => data.items);
    promise.catch(() => cache.delete(kind)); // retry on the next page view
    cache.set(kind, promise);
  }
  return cache.get(kind);
}

// Called by the admin panel after a change so the public pages show it straight away.
export function invalidateSiteContent(kind) {
  cache.delete(kind);
}

// `fallback` must be a stable (module-level) array.
export default function useSiteContent(kind, fallback) {
  const [state, setState] = useState({ kind: null, items: fallback, failed: false });

  useEffect(() => {
    let active = true;
    load(kind)
      .then((items) => active && setState({ kind, items: items.length > 0 ? items : fallback, failed: false }))
      .catch(() => active && setState({ kind, items: fallback, failed: true }));
    return () => {
      active = false;
    };
  }, [kind, fallback]);

  return { items: state.kind === kind ? state.items : fallback, loading: state.kind !== kind, failed: state.failed };
}
