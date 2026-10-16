import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/visitors`;
const SESSION_KEY = "sag-visit-counted";

function alreadyCounted() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markCounted() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // storage unavailable (private mode): the visit may be counted again next load
  }
}

// Counts one visit per browser session and returns the total.
// Returns `fallback` until the API answers, or if it can't be reached.
export default function useVisitorCount(fallback) {
  const [count, setCount] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();
    const counted = alreadyCounted();

    // Low priority: the footer counter must not compete with the page's own files.
    fetch(counted ? API_URL : `${API_URL}/hit`, { method: counted ? "GET" : "POST", signal: controller.signal, priority: "low" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.count !== "number") return;
        if (!counted) markCounted();
        setCount(data.count);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return count;
}
