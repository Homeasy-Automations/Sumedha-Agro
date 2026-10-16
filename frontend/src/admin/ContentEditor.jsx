import { useId, useRef, useState } from "react";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { invalidateSiteContent } from "../hooks/useSiteContent";
import { useAdmin } from "./session";
import LinkTextarea from "./LinkTextarea";
import { fieldProps } from "./styles";
import useAdminData from "./useAdminData";
import { Button, Card, Empty, Field, Loading, Modal, Notice } from "./ui";

// Form + list for one kind of website content (videos, news, training calendar).
//   kind:       public content key, e.g. "news" (GET /api/content/news, admin /api/admin/news)
//   fields:     [{ name, label, type?, options?, required?, hint?, placeholder?, maxLength?, wide?, links? }]
//               type: "text" (default), "textarea", "select" (with options: [{ value, label }]),
//               or any <input> type ("date", "url", ...). placeholder may be a function of the
//               form's values. links: a textarea gets an "Add link" tool and a preview
//               (LinkTextarea). { section: "Title" } entries are headings between fields.
//   editFields: fields editable after creation (defaults to `fields`)
//   initial:    () => default values for a new item
//   summary:    (item) => JSX describing an item in the list
//   renderAdd:  optional ({ onCreated }) => JSX replacing the default "Add" form
//   groupItems: optional (items) => [{ label, items }] to show the list in titled groups
//   duplicate:  optional (item, items) => values; adds a "Duplicate" button that copies a row into the Add form
//   renderEmpty: optional ({ reload }) => JSX shown above the Add form while there are no items
//   describe:   optional (item) => text naming an item in confirmations and button labels (default: title)

const valueFields = (fields) => fields.filter((f) => f.name);

function ItemForm({ fields, values, errors, onChange, idPrefix }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((f, i) => {
        if (f.section) {
          return (
            <h3 key={`section-${i}`} className="border-b border-border-light pb-1.5 pt-2 text-xs font-bold uppercase tracking-wider text-[#5b735b] md:col-span-2">
              {f.section}
            </h3>
          );
        }
        const id = `${idPrefix}-${f.name}`;
        const props = {
          ...fieldProps(id, errors[f.name], Boolean(f.hint)),
          value: values[f.name] ?? "",
          placeholder: typeof f.placeholder === "function" ? f.placeholder(values) : f.placeholder,
          maxLength: f.maxLength,
          inputMode: f.inputMode,
          required: f.required,
          onChange: (e) => onChange(f.name, e.target.value),
        };
        let control;
        if (f.type === "textarea") {
          control = f.links ? <LinkTextarea {...props} onValue={(v) => onChange(f.name, v)} /> : <textarea {...props} rows={5} />;
        }
        else if (f.type === "select") {
          // A saved value that is no longer one of the options (e.g. older free text) stays selectable.
          const current = props.value;
          const options = current && !f.options.some((o) => o.value === current) ? [...f.options, { value: current, label: current }] : f.options;
          control = (
            <select {...props}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          );
        } else control = <input {...props} type={f.type ?? "text"} />;
        return (
          <Field key={f.name} id={id} label={f.label} hint={f.hint} error={errors[f.name]} required={f.required} className={f.wide ? "md:col-span-2" : ""}>
            {control}
          </Field>
        );
      })}
    </div>
  );
}

function EditDialog({ item, endpoint, kind, fields, onClose, onSaved }) {
  const { request } = useAdmin();
  const uid = useId();
  const [values, setValues] = useState(() => Object.fromEntries(valueFields(fields).map((f) => [f.name, item[f.name] ?? ""])));
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

function ItemRow({ item, name, summary, onEdit, onDuplicate, onRemove, noun }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border-light bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">{summary(item)}</div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" icon={Pencil} onClick={onEdit}>
          Edit
        </Button>
        {onDuplicate && (
          <Button variant="secondary" icon={Copy} onClick={onDuplicate} aria-label={`Duplicate ${name}`} title={`Copy into the Add ${noun.toLowerCase()} form`} />
        )}
        <Button variant="danger" icon={Trash2} onClick={onRemove} aria-label={`Delete ${name}`} />
      </div>
    </li>
  );
}

export default function ContentEditor({
  kind,
  endpoint,
  noun,
  fields,
  editFields = fields,
  initial,
  summary,
  emptyText,
  renderAdd,
  groupItems,
  duplicate,
  renderEmpty,
  describe = (item) => item.title,
}) {
  const { request } = useAdmin();
  const uid = useId();
  const addFormRef = useRef(null);
  const { data, error: loadError, loading, reload } = useAdminData(`/api/content/${kind}`, { public: true });
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);
  const items = data?.items ?? [];
  const groups = groupItems ? groupItems(items) : [{ label: "", items }];

  const copyIntoForm = (item) => {
    setValues({ ...initial(), ...duplicate(item, items) });
    setErrors({});
    setNotice({ tone: "success", text: `Copied into the form above. Change what's different, then click “Add ${noun.toLowerCase()}”.` });
    addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    addFormRef.current?.querySelector("input, select, textarea")?.focus({ preventScroll: true });
  };

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
    if (!window.confirm(`Delete this ${noun.toLowerCase()}?\n\n${describe(item)}`)) return;
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
      {data && items.length === 0 && renderEmpty?.({ reload })}

      {renderAdd ? (
        renderAdd({ onCreated })
      ) : (
        <div ref={addFormRef} className="scroll-mt-6">
          <Card title={`Add ${noun.toLowerCase()}`} className="mb-6">
            <form onSubmit={create}>
              <ItemForm fields={fields} values={values} errors={errors} idPrefix={uid} onChange={(name, v) => setValues((p) => ({ ...p, [name]: v }))} />
              <Button type="submit" busy={busy} icon={Plus} className="mt-5">
                Add {noun.toLowerCase()}
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
        {notice.text || loadError}
      </Notice>

      {loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>{emptyText}</Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {groups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <section key={group.label || "all"} aria-label={group.label || undefined}>
                {group.label && (
                  <h2 className="mb-3 text-sm font-bold text-[#0d1b0d]">
                    {group.label} <span className="font-medium text-[#5b735b]">({group.items.length})</span>
                  </h2>
                )}
                <ul className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      name={describe(item)}
                      noun={noun}
                      summary={summary}
                      onEdit={() => setEditing(item)}
                      onDuplicate={duplicate && !renderAdd ? () => copyIntoForm(item) : undefined}
                      onRemove={() => remove(item)}
                    />
                  ))}
                </ul>
              </section>
            ))}
        </div>
      )}

      <Modal open={Boolean(editing)} title={`Edit ${noun.toLowerCase()}`} onClose={() => setEditing(null)} wide>
        {editing && (
          <EditDialog item={editing} endpoint={endpoint} kind={kind} fields={editFields} onClose={() => setEditing(null)} onSaved={reload} />
        )}
      </Modal>
    </>
  );
}
