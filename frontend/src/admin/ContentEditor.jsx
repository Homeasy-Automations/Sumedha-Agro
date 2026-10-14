import { useId, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { invalidateSiteContent } from "../hooks/useSiteContent";
import { useAdmin } from "./session";
import { fieldProps } from "./styles";
import useAdminData from "./useAdminData";
import { Button, Card, Empty, Field, Loading, Modal, Notice } from "./ui";

// Form + list for one kind of website content (videos, news, training schedule).
//   kind:       public content key, e.g. "news" (GET /api/content/news, admin /api/admin/news)
//   fields:     [{ name, label, type?, required?, hint?, placeholder?, maxLength?, wide? }]
//   editFields: fields editable after creation (defaults to `fields`)
//   initial:    () => default values for a new item
//   summary:    (item) => JSX describing an item in the list
//   renderAdd:  optional ({ onCreated }) => JSX replacing the default "Add" form

function ItemForm({ fields, values, errors, onChange, idPrefix }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((f) => {
        const id = `${idPrefix}-${f.name}`;
        const props = {
          ...fieldProps(id, errors[f.name], Boolean(f.hint)),
          value: values[f.name] ?? "",
          placeholder: f.placeholder,
          maxLength: f.maxLength,
          required: f.required,
          onChange: (e) => onChange(f.name, e.target.value),
        };
        return (
          <Field key={f.name} id={id} label={f.label} hint={f.hint} error={errors[f.name]} required={f.required} className={f.wide ? "md:col-span-2" : ""}>
            {f.type === "textarea" ? <textarea {...props} rows={5} /> : <input {...props} type={f.type ?? "text"} />}
          </Field>
        );
      })}
    </div>
  );
}

function EditDialog({ item, endpoint, kind, fields, onClose, onSaved }) {
  const { request } = useAdmin();
  const uid = useId();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? ""])));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await request(`${endpoint}/${item.id}`, { method: "PUT", body: values });
      invalidateSiteContent(kind);
      onSaved();
      onClose();
    } catch (err) {
      setErrors(err.errors ?? {});
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <Notice tone="error">{error}</Notice>
      <ItemForm fields={fields} values={values} errors={errors} idPrefix={uid} onChange={(name, v) => setValues((p) => ({ ...p, [name]: v }))} />
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" busy={busy}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export default function ContentEditor({ kind, endpoint, noun, fields, editFields = fields, initial, summary, emptyText, renderAdd }) {
  const { request } = useAdmin();
  const uid = useId();
  const { data, error: loadError, loading, reload } = useAdminData(`/api/content/${kind}`, { public: true });
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const items = data?.items ?? [];

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice({ tone: "success", text: "" });
    try {
      await request(endpoint, { method: "POST", body: values });
      invalidateSiteContent(kind);
      setValues(initial());
      setErrors({});
      setNotice({ tone: "success", text: `${noun} added. It is now live on the website.` });
      reload();
    } catch (err) {
      setErrors(err.errors ?? {});
      setNotice({ tone: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const onCreated = () => {
    invalidateSiteContent(kind);
    setNotice({ tone: "success", text: `${noun} added. It is now live on the website.` });
    reload();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${noun.toLowerCase()}?\n\n${item.title}`)) return;
    try {
      await request(`${endpoint}/${item.id}`, { method: "DELETE" });
      invalidateSiteContent(kind);
      setNotice({ tone: "success", text: `${noun} deleted.` });
      reload();
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    }
  };

  return (
    <>
      {renderAdd ? (
        renderAdd({ onCreated })
      ) : (
        <Card title={`Add ${noun.toLowerCase()}`} className="mb-6">
          <form onSubmit={create}>
            <ItemForm fields={fields} values={values} errors={errors} idPrefix={uid} onChange={(name, v) => setValues((p) => ({ ...p, [name]: v }))} />
            <Button type="submit" busy={busy} icon={Plus} className="mt-5">
              Add {noun.toLowerCase()}
            </Button>
          </form>
        </Card>
      )}

      <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
        {notice.text || loadError}
      </Notice>

      {loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>{emptyText}</Empty>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border-light bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">{summary(item)}</div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" icon={Pencil} onClick={() => setEditing(item)}>
                  Edit
                </Button>
                <Button variant="danger" icon={Trash2} onClick={() => remove(item)} aria-label={`Delete ${item.title}`} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={Boolean(editing)} title={`Edit ${noun.toLowerCase()}`} onClose={() => setEditing(null)} wide>
        {editing && (
          <EditDialog item={editing} endpoint={endpoint} kind={kind} fields={editFields} onClose={() => setEditing(null)} onSaved={reload} />
        )}
      </Modal>
    </>
  );
}
