import { Link } from "react-router-dom";
import { ClipboardList, Eye, GraduationCap, Images, Mail, Newspaper, ReceiptText, Users, Video } from "lucide-react";
import useAdminData from "../useAdminData";
import { Notice, PageTitle } from "../ui";

const SUBMISSIONS = [
  { key: "trainingApplications", label: "Training applications", to: "/admin/applications", icon: ClipboardList },
  { key: "contactMessages", label: "Contact messages", to: "/admin/messages", icon: Mail },
  { key: "quoteRequests", label: "Quote requests", to: "/admin/quotes", icon: ReceiptText },
  { key: "subscribers", label: "Subscribers", to: "/admin/subscribers", icon: Users },
];

const CONTENT = [
  { key: "galleryImages", label: "Gallery images", to: "/admin/gallery", icon: Images },
  { key: "videos", label: "Videos", to: "/admin/videos", icon: Video },
  { key: "newsItems", label: "News items", to: "/admin/news", icon: Newspaper },
  { key: "trainingPrograms", label: "Training schedule rows", to: "/admin/trainings", icon: GraduationCap },
];

function StatGrid({ title, items, totals }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-bold text-[#5b735b]">{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ key, label, to, icon: Icon }) => (
          <li key={key}>
            <Link
              to={to}
              className="flex items-center gap-4 rounded-2xl border border-border-light bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-text-side">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-2xl font-bold text-[#0d1b0d]">{totals ? totals[key] : "–"}</span>
                <span className="text-sm text-[#5b735b]">{label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Dashboard() {
  const { data, error } = useAdminData("/stats");
  const totals = data?.totals;

  return (
    <>
      <PageTitle title="Dashboard" description="Manage what appears on the website and review submissions." />
      <Notice tone="error">{error}</Notice>
      <div className="mb-8 inline-flex items-center gap-3 rounded-2xl bg-background-dark px-5 py-4 text-white">
        <Eye size={20} aria-hidden="true" className="text-primary" />
        <span>
          <span className="text-2xl font-bold">{totals ? totals.visitors : "–"}</span>{" "}
          <span className="text-sm text-gray-300">website visits</span>
        </span>
      </div>
      <StatGrid title="Submissions" items={SUBMISSIONS} totals={totals} />
      <StatGrid title="Website content" items={CONTENT} totals={totals} />
    </>
  );
}
