import { useState } from "react";
import { Download, Eye, FileSpreadsheet, Trash2 } from "lucide-react";
import { downloadCsv, fetchAll, toCsv, today } from "../csv";
import { downloadXlsx } from "../xlsx";
import { useAdmin } from "../session";
import { td, th } from "../styles";
import useAdminData from "../useAdminData";
import { Button, DateTime, Empty, Loading, Modal, Notice, PageTitle, Pager } from "../ui";

const LIMIT = 20;

// columns: shown in the table. fields: everything (details dialog and downloads).
const KINDS = {
  messages: {
    title: "Contact messages",
    description: "Messages from the Contact page form.",
    path: "/contact-messages",
    file: "contact-messages",
    columns: [
      ["name", "Name"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["interest", "Interest"],
    ],
    fields: [
      ["name", "Name"],
      ["email", "Email"],
      ["phone", "Phone"],
      ["company", "Company"],
      ["interest", "Interest"],
      ["message", "Message"],
      ["createdAt", "Received", "datetime"],
    ],
    label: (item) => `the message from ${item.name}`,
  },
  quotes: {
    title: "Quote requests",
    description: "Requests from the Get Quote form.",
    path: "/quote-requests",
    file: "quote-requests",
    columns: [
      ["referenceId", "Reference"],
      ["product", "Product"],
      ["volume", "Volume (KG)"],
      ["name", "Name"],
      ["email", "Email"],
    ],
    fields: [
      ["referenceId", "Reference"],
      ["product", "Product"],
      ["volume", "Monthly volume (KG)"],
      ["packaging", "Packaging"],
      ["frequency", "Frequency"],
      ["company", "Company"],
      ["gst", "GST"],
      ["name", "Name"],
      ["email", "Email"],
      ["notes", "Notes"],
      ["address", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
      ["shippingMethod", "Shipping method"],
      ["deliveryDate", "Delivery date"],
      ["createdAt", "Received", "datetime"],
    ],
    label: (item) => `quote ${item.referenceId}`,
  },
  subscribers: {
    title: "Subscribers",
    description: "Email addresses subscribed to updates.",
    path: "/subscribers",
    file: "subscribers",
    columns: [["email", "Email"]],
    fields: [
      ["email", "Email"],
      ["createdAt", "Subscribed", "datetime"],
    ],
    label: (item) => item.email,
  },
};

const value = (item, key) => (key === "createdAt" ? <DateTime value={item.createdAt} /> : item[key] || "—");

export default function SubmissionsAdmin({ kind }) {
  const config = KINDS[kind];
  const { request } = useAdmin();
  const [offset, setOffset] = useState(0);
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const [exporting, setExporting] = useState(""); // "" | "xlsx" | "csv"
  const { data, error, loading, reload } = useAdminData(`${config.path}?limit=${LIMIT}&offset=${offset}`);
  const items = data?.items ?? [];

  const remove = async (item) => {
    if (!window.confirm(`Delete ${config.label(item)}? This cannot be undone.`)) return;
    try {
      await request(`${config.path}/${item.id}`, { method: "DELETE" });
      setNotice({ tone: "success", text: "Deleted." });
      reload();
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    }
  };

  const exportAll = async (format) => {
    setExporting(format);
    try {
      const rows = await fetchAll(request, config.path);
      const file = `${config.file}-${today()}`;
      if (format === "xlsx") downloadXlsx(`${file}.xlsx`, rows, config.fields, { sheetName: config.title });
      else downloadCsv(`${file}.csv`, toCsv(rows, config.fields));
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setExporting("");
    }
  };

  return (
    <>
      <PageTitle
        title={config.title}
        description={config.description}
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
      <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
        {notice.text || error}
      </Notice>

      {loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>Nothing here yet.</Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-light bg-white shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-border-light bg-background-light">
              <tr>
                {[...config.columns.map(([, label]) => label), "Received", ""].map((h) => (
                  <th key={h} scope="col" className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {items.map((item) => (
                <tr key={item.id} className={loading ? "opacity-60" : ""}>
                  {config.columns.map(([key]) => (
                    <td key={key} className={`${td} ${key === "referenceId" ? "font-mono text-xs" : ""}`}>
                      {key === "email" ? (
                        <a href={`mailto:${item.email}`} className="hover:text-text-side">
                          {item.email}
                        </a>
                      ) : (
                        value(item, key)
                      )}
                    </td>
                  ))}
                  <td className={`${td} text-xs`}>
                    <DateTime value={item.createdAt} />
                  </td>
                  <td className={td}>
                    <div className="flex justify-end gap-2">
                      {config.fields.length > config.columns.length + 1 && (
                        <Button variant="secondary" icon={Eye} onClick={() => setViewing(item)} className="px-3">
                          View
                        </Button>
                      )}
                      <Button variant="danger" icon={Trash2} onClick={() => remove(item)} aria-label={`Delete ${config.label(item)}`} className="px-3" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager offset={offset} limit={LIMIT} total={data?.total ?? 0} onChange={setOffset} />

      <Modal open={Boolean(viewing)} title={config.title} onClose={() => setViewing(null)} wide>
        {viewing && (
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {config.fields.map(([key, label]) => (
              <div key={key} className={key === "message" || key === "notes" ? "sm:col-span-2" : ""}>
                <dt className="text-xs font-semibold text-[#5b735b]">{label}</dt>
                <dd className="whitespace-pre-line text-sm text-[#0d1b0d]">{value(viewing, key)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </>
  );
}
