import { createContext, useContext } from "react";

// Admin session (token from POST /api/admin/login). Kept in this browser until "Sign out":
// sign-ins don't expire, and closing the tab or browser doesn't sign out. Changing
// ADMIN_PASSWORD on the server signs everyone out (the next request gets a 401).
const STORAGE_KEY = "sag-admin-session";

export function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return typeof session?.token === "string" && session.token ? session : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable: the session lasts until the page is reloaded
  }
}

export const AdminContext = createContext(null);

// { request(path, options), logout() } — `request` calls /api/admin<path> with the session token.
export function useAdmin() {
  return useContext(AdminContext);
}
