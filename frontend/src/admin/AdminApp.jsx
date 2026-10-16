import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  Images,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Newspaper,
  ReceiptText,
  Users,
  Video,
} from "lucide-react";
import logo from "../assets/Logo.webp";
import { apiRequest, ApiError } from "../lib/api";
import { AdminContext, readSession, useAdmin, writeSession } from "./session";
import { fieldProps } from "./styles";
import { Button, Field, Notice } from "./ui";
import Dashboard from "./pages/Dashboard";
import GalleryAdmin from "./pages/GalleryAdmin";
import VideosAdmin from "./pages/VideosAdmin";
import NewsAdmin from "./pages/NewsAdmin";
import TrainingsAdmin from "./pages/TrainingsAdmin";
import TrainingPageAdmin from "./pages/TrainingPageAdmin";
import ApplicationsAdmin from "./pages/ApplicationsAdmin";
import SubmissionsAdmin from "./pages/SubmissionsAdmin";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { group: "Website content" },
  { to: "/admin/gallery", label: "Gallery images", icon: Images },
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/news", label: "News & announcements", icon: Newspaper },
  { to: "/admin/trainings", label: "Training calendar", icon: GraduationCap },
  { to: "/admin/training-page", label: "Training page text", icon: FileText },
  { group: "Submissions" },
  { to: "/admin/applications", label: "Training applications", icon: ClipboardList },
  { to: "/admin/messages", label: "Contact messages", icon: Mail },
  { to: "/admin/quotes", label: "Quote requests", icon: ReceiptText },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
];

function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await apiRequest("/api/admin/login", { method: "POST", body: { password } });
      onLogin({ token });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-dark px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <img src={logo} alt="" className="h-12 w-auto" width="70" height="70" />
          <div>
            <h1 className="text-xl font-bold text-[#0d1b0d]">Sumedha Agro</h1>
            <p className="text-sm text-[#5b735b]">Admin panel</p>
          </div>
        </div>
        <Notice tone="error">{error}</Notice>
        <Field id="admin-password" label="Password">
          <input
            {...fieldProps("admin-password", error)}
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" busy={busy} icon={LogIn} className="mt-6 w-full">
          Sign in
        </Button>
        <Link to="/" className="mt-6 block text-center text-sm text-[#5b735b] hover:text-text-side">
          ← Back to website
        </Link>
      </form>
    </main>
  );
}

function AdminLayout() {
  const { logout } = useAdmin();
  return (
    <div className="min-h-screen bg-background-light">
      <header className="bg-background-dark text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-auto rounded bg-white p-0.5" width="70" height="70" />
            <span className="font-bold">
              Sumedha Agro <span className="font-normal text-gray-400">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-primary sm:inline-flex"
            >
              View website <ExternalLink size={14} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-primary"
            >
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl gap-8 px-4 py-6 md:px-8 lg:grid lg:grid-cols-[230px_1fr] lg:py-8">
        <nav aria-label="Admin" className="-mx-4 mb-6 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-1 lg:sticky lg:top-6 lg:flex-col">
            {NAV.map((item) =>
              item.group ? (
                <li key={item.group} className="hidden px-3 pb-1 pt-4 text-xs font-bold text-[#5b735b] lg:block">
                  {item.group}
                </li>
              ) : (
                <li key={item.to} className="shrink-0">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive ? "bg-primary/20 font-semibold text-text-side" : "text-[#3f5f3f] hover:bg-white"
                      }`
                    }
                  >
                    <item.icon size={17} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
        <main id="main-content" className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(readSession);

  // Keep the admin panel out of search results. The public page's search/social tags (canonical,
  // robots "index", …) come with the HTML file, so they are removed; the public pages add theirs
  // back when visited (components/Seo.jsx).
  useEffect(() => {
    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    const previousTitle = document.title;
    document.title = "Admin | Sumedha Agro";
    return () => {
      tag.remove();
      document.title = previousTitle;
    };
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const token = session?.token;
  const request = useCallback(
    async (path, options = {}) => {
      try {
        return await apiRequest(`/api/admin${path}`, { ...options, token });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [token, logout],
  );

  const value = useMemo(() => ({ request, logout }), [request, logout]);

  if (!session) {
    return (
      <Login
        onLogin={(next) => {
          writeSession(next);
          setSession(next);
        }}
      />
    );
  }

  return (
    <AdminContext.Provider value={value}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="videos" element={<VideosAdmin />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="trainings" element={<TrainingsAdmin />} />
          <Route path="training-page" element={<TrainingPageAdmin />} />
          <Route path="applications" element={<ApplicationsAdmin />} />
          <Route path="messages" element={<SubmissionsAdmin key="messages" kind="messages" />} />
          <Route path="quotes" element={<SubmissionsAdmin key="quotes" kind="quotes" />} />
          <Route path="subscribers" element={<SubmissionsAdmin key="subscribers" kind="subscribers" />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminContext.Provider>
  );
}
