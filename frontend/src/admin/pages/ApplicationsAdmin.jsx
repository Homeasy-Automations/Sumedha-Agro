import { useEffect, useState } from "react";
import { Download, Eye, FileSpreadsheet, Search, Trash2 } from "lucide-react";
import { downloadCsv, fetchAll, toCsv, today } from "../csv";
import { downloadXlsx } from "../xlsx";
import { useAdmin } from "../session";
import { input, td, th } from "../styles";
import useAdminData from "../useAdminData";
import { Button, DateTime, Empty, Loading, Modal, Notice, PageTitle, Pager } from "../ui";

const LIMIT = 20;
const SEARCH_DELAY_MS = 300;
const STATUSES = ["new", "reviewed", "accepted", "rejected"];
const statusStyle = {
  new: "bg-blue-50 text-blue-800",
  reviewed: "bg-amber-50 text-amber-900",
  accepted: "bg-primary/15 text-text-side",
  rejected: "bg-red-50 text-red-700",
};

// Same order and labels as the application form.
const FIELDS = [
  ["referenceId", "Reference number"],
  ["trainingAppliedFor", "Training applied for"],
  ["trainingBatch", "Batch"],
  ["trainingDate", "Date of training"],
  ["name", "Name"],
  ["gender", "Gender"],
  ["category", "Category"],
  ["postalAddress", "Complete postal address"],
  ["state", "State"],
  ["mobile", "Mobile No"],
  ["aadhar", "Aadhar No"],
  ["email", "Email"],
  ["dateOfBirth", "Date of birth"],
  ["education", "Education/ qualification"],
  ["livingPlace", "Living place"],
  ["employment", "Present employment/ designation"],
  ["previousTraining", "Previous training"],
  ["previousTrainingDetails", "Previous training details"],
  ["cultivatedBefore", "Cultivated mushroom before"],
  ["status", "Status"],
  ["createdAt", "Submitted", "datetime"],
];

// No longer asked for by the form; still shown for older applications that have it.
const LEGACY_FIELDS = [["trainingModuleNo", "Training Module No"]];

function Detail({ id }) {
  const { data, error } = useAdminData(`/training-applications/${id}`);
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!data) return <Loading />;
  const item = data.item;
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {[...FIELDS, ...LEGACY_FIELDS.filter(([key]) => item[key])].map(([key, label]) => (
        <div key={key} className={key === "postalAddress" || key === "previousTrainingDetails" ? "sm:col-span-2" : ""}>
          <dt className="text-xs font-semibold text-[#5b735b]">{label}</dt>
          <dd className="whitespace-pre-line text-sm text-[#0d1b0d]">
            {key === "createdAt" ? <DateTime value={item.createdAt} /> : item[key] || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function ApplicationsAdmin() {
  const { request } = useAdmin();
  const [status, setStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const [exporting, setExporting] = useState(""); // "" | "xlsx" | "csv"
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Search once typing pauses, starting again from the first page.
  useEffect(() => {
    const next = searchInput.trim();
    if (next === search) return undefined;
    const timer = window.setTimeout(() => {
      setSearch(next);
      setOffset(0);
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput, search]);

  const filters = new URLSearchParams();
  if (status) filters.set("status", status);
  if (search) filters.set("q", search);
  const filterQuery = filters.toString();
  const { data, error, loading, reload } = useAdminData(
    `/training-applications?limit=${LIMIT}&offset=${offset}${filterQuery ? `&${filterQuery}` : ""}`,
  );
  const items = data?.items ?? [];

  const changeStatus = async (item, next) => {
    try {
      await request(`/training-applications/${item.id}`, { method: "PATCH", body: { status: next } });
      setNotice({ tone: "success", text: `${item.referenceId} marked as ${next}.` });
      reload();
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete application ${item.referenceId} from ${item.name}? This cannot be undone.`)) return;
    try {
      await request(`/training-applications/${item.id}`, { method: "DELETE" });
      setNotice({ tone: "success", text: `${item.referenceId} deleted.` });
      reload();
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    }
  };

  // Downloads every application matching the current status filter and search.
  const exportAll = async (format) => {
    setExporting(format);
    try {
      const rows = await fetchAll(request, `/training-applications${filterQuery ? `?${filterQuery}` : ""}`);
      const file = `training-applications-${today()}`;
      if (format === "xlsx") downloadXlsx(`${file}.xlsx`, rows, FIELDS, { sheetName: "Training applications" });
      else downloadCsv(`${file}.csv`, toCsv(rows, FIELDS));
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setExporting("");
    }
  };

  return (
    <>
      <PageTitle
        title="Training applications"
        description="Applications from the “Apply for Training” form. Aadhar numbers are masked here and in downloads; open an application to see the full number."
        actions={
          <>
            <Button
              icon={FileSpreadsheet}
              busy={exporting === "xlsx"}
              onClick={() => exportAll("xlsx")}
              disabled={!data?.total || Boolean(exporting)}
            >
              Download Excel
            </Button>
            <Button
              variant="secondary"
              icon={Download}
              busy={exporting === "csv"}
              onClick={() => exportAll("csv")}
              disabled={!data?.total || Boolean(exporting)}
            >
              CSV
            </Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-96">
          <label htmlFor="application-search" className="sr-only">
            Search applications
          </label>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="application-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, mobile, email, reference, training or batch"
            className={`${input} pl-9`}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-semibold text-[#0d1b0d]">
            Status
          </label>
          <div className="w-40">
            <select
              id="status-filter"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setOffset(0);
              }}
              className={input}
            >
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
        {notice.text || error}
      </Notice>
      {search && data && (
        <p role="status" className="mb-3 text-sm text-[#5b735b]">
          {data.total} {data.total === 1 ? "application matches" : "applications match"} “{search}”
          {status ? ` with status “${status}”` : ""}.
        </p>
      )}

      {loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>
          {search
            ? `No applications match “${search}”${status ? ` with status “${status}”` : ""}.`
            : `No applications${status ? ` with status “${status}”` : ""} yet.`}
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-light bg-white shadow-sm">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-border-light bg-background-light">
              <tr>
                {["Reference", "Name", "Training / batch", "Date of training", "Mobile", "Submitted", "Status", ""].map((h) => (
                  <th key={h} scope="col" className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {items.map((item) => (
                <tr key={item.id} className={loading ? "opacity-60" : ""}>
                  <td className={`${td} font-mono text-xs`}>{item.referenceId}</td>
                  <td className={td}>
                    <span className="font-semibold">{item.name}</span>
                    <span className="block text-xs text-[#5b735b]">{item.email}</span>
                  </td>
                  <td className={td}>
                    {item.trainingAppliedFor}
                    {item.trainingBatch && (
                      <span className="mt-1 block text-xs font-semibold text-text-side">{item.trainingBatch}</span>
                    )}
                  </td>
                  <td className={`${td} whitespace-nowrap`}>{item.trainingDate}</td>
                  <td className={td}>
                    <a href={`tel:${item.mobile}`} className="hover:text-text-side">
                      {item.mobile}
                    </a>
                  </td>
                  <td className={`${td} text-xs`}>
                    <DateTime value={item.createdAt} />
                  </td>
                  <td className={td}>
                    <label className="sr-only" htmlFor={`status-${item.id}`}>
                      Status of {item.referenceId}
                    </label>
                    <select
                      id={`status-${item.id}`}
                      value={item.status}
                      onChange={(e) => changeStatus(item, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${statusStyle[item.status] ?? ""}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={td}>
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" icon={Eye} onClick={() => setViewing(item)} className="px-3">
                        View
                      </Button>
                      <Button variant="danger" icon={Trash2} onClick={() => remove(item)} aria-label={`Delete ${item.referenceId}`} className="px-3" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager offset={offset} limit={LIMIT} total={data?.total ?? 0} onChange={setOffset} />

      <Modal open={Boolean(viewing)} title={viewing ? `Application ${viewing.referenceId}` : ""} onClose={() => setViewing(null)} wide>
        {viewing && <Detail id={viewing.id} />}
      </Modal>
    </>
  );
}
