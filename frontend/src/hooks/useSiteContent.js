import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

// Content managed in the admin panel (gallery, videos, news, trainings), fetched once per
// page load and shared between components. Falls back to the static defaults in
// src/data when the API is unreachable or nothing has been added yet.

const TIMEOUT_MS = 15_000;
const cache = new Map(); // kind -> Promise<items> (lists) or Promise<item | null> (page text)

function fetchOnce(kind, pick) {
  if (!cache.has(kind)) {
    const promise = apiRequest(`/api/content/${kind}`, { timeoutMs: TIMEOUT_MS }).then(pick);
    promise.catch(() => cache.delete(kind)); // retry on the next page view
    cache.set(kind, promise);
  }
  return cache.get(kind);
}

const load = (kind) => fetchOnce(kind, (data) => data.items);

// Called by the admin panel after a change so the public pages show it straight away.
export function invalidateSiteContent(kind) {
  cache.delete(kind);
}

// Page text saved in the admin panel (e.g. "training-page"): the saved object, or null while
// loading, when nothing has been saved, or when the API is unreachable (callers then use
// their defaults).
export function useSitePage(name) {
  const [state, setState] = useState({ name: null, item: null });

  useEffect(() => {
    let active = true;
    fetchOnce(name, (data) => data.item ?? null)
      .then((item) => active && setState({ name, item }))
      .catch(() => active && setState({ name, item: null }));
    return () => {
      active = false;
    };
  }, [name]);

  return state.name === name ? state.item : null;
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
