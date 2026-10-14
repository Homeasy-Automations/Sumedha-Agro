import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { useAdmin } from "./session";

// Loads `path` (an /api/admin path, or a public /api path with { public: true }).
// Returns { data, error, loading, reload }. Previous data stays visible while reloading.
export default function useAdminData(path, { public: isPublic = false } = {}) {
  const { request } = useAdmin();
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: "" });
  const key = `${path}#${version}`;

  useEffect(() => {
    const controller = new AbortController();
    const load = isPublic ? apiRequest(path, { signal: controller.signal }) : request(path, { signal: controller.signal });
    load
      .then((data) => setResult({ key, data, error: "" }))
      .catch((err) => {
        if (!controller.signal.aborted) setResult((prev) => ({ key, data: prev.data, error: err.message }));
      });
    return () => controller.abort();
  }, [key, path, isPublic, request]);

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== key,
    reload: () => setVersion((v) => v + 1),
  };
}
