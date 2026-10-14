import { useEffect, useId, useRef, useState } from "react";
import { Pencil, Trash2, Upload } from "lucide-react";
import { invalidateSiteContent } from "../../hooks/useSiteContent";
import { prepareImage } from "../prepareImage";
import ProgressBar from "../ProgressBar";
import { useAdmin } from "../session";
import { fieldProps } from "../styles";
import { uploadMedia } from "../uploadMedia";
import useAdminData from "../useAdminData";
import { Button, Card, Empty, Field, Loading, Modal, Notice, PageTitle } from "../ui";

function UploadForm({ onUploaded }) {
  const { request } = useAdmin();
  const uid = useId();
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ tone: "success", text: "" });
  const [progress, setProgress] = useState(null);

  // Free the preview URL when it changes or the form unmounts.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const choose = (selected) => {
    setFile(selected ?? null);
    setPreview(selected ? URL.createObjectURL(selected) : "");
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = { image: file ? "" : "Choose an image.", alt: alt.trim() ? "" : "Describe the image." };
    setErrors(nextErrors);
    if (nextErrors.image || nextErrors.alt) return;

    setProgress(0);
    setMessage({ tone: "success", text: "" });
    try {
      const prepared = await prepareImage(file);
      const uploaded = await uploadMedia(request, "image", prepared.blob, {
        filename: prepared.filename,
        onProgress: setProgress,
      });
      await request("/gallery", {
        method: "POST",
        body: {
          publicId: uploaded.public_id,
          alt: alt.trim(),
          caption: caption.trim(),
          width: String(uploaded.width ?? prepared.width),
          height: String(uploaded.height ?? prepared.height),
        },
      });

      invalidateSiteContent("gallery");
      setMessage({ tone: "success", text: "Image added to the gallery." });
      choose(null);
      setAlt("");
      setCaption("");
      if (fileInput.current) fileInput.current.value = "";
      onUploaded();
    } catch (err) {
      setErrors(err.errors ?? {});
      setMessage({ tone: "error", text: err.message });
    } finally {
      setProgress(null);
    }
  };

  const busy = progress !== null;

  return (
    <Card title="Add an image" className="mb-6">
      <Notice tone={message.tone} onDismiss={() => setMessage({ tone: "success", text: "" })}>
        {message.text}
      </Notice>
      <form onSubmit={submit} className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <label
            htmlFor={`${uid}-file`}
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed text-center text-sm text-[#5b735b] hover:border-text-side ${
              errors.image ? "border-red-400" : "border-slate-300"
            }`}
          >
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <>
                <Upload size={24} aria-hidden="true" />
                <span>Choose a photo</span>
                <span className="text-xs">JPEG, PNG, WebP or GIF</span>
              </>
            )}
          </label>
          <input
            ref={fileInput}
            id={`${uid}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            aria-describedby={errors.image ? `${uid}-file-error` : undefined}
            onChange={(e) => choose(e.target.files?.[0])}
          />
          {errors.image && (
            <p id={`${uid}-file-error`} className="mt-1 text-xs font-medium text-red-600">
              {errors.image}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Field
            id={`${uid}-alt`}
            label="Description (alt text)"
            required
            hint="Describe what the photo shows, for visitors who use screen readers. E.g. “Oyster mushrooms growing on paddy straw bags”."
            error={errors.alt}
          >
            <input {...fieldProps(`${uid}-alt`, errors.alt, true)} value={alt} maxLength={200} onChange={(e) => setAlt(e.target.value)} />
          </Field>
          <Field id={`${uid}-caption`} label="Caption" hint="Optional. Shown under the photo when it is opened.">
            <input {...fieldProps(`${uid}-caption`, errors.caption, true)} value={caption} maxLength={300} onChange={(e) => setCaption(e.target.value)} />
          </Field>
          <p className="text-xs text-[#5b735b]">
            Photos are resized to 1600 px and location data is removed, then stored on Cloudinary.
          </p>
          <ProgressBar value={progress} label="Upload progress" />
          <div>
            <Button type="submit" busy={busy} icon={Upload}>
              {busy ? "Uploading…" : "Upload image"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

function EditImage({ image, onClose, onSaved }) {
  const { request } = useAdmin();
  const [alt, setAlt] = useState(image.alt);
  const [caption, setCaption] = useState(image.caption ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await request(`/gallery/${image.id}`, { method: "PUT", body: { alt, caption } });
      invalidateSiteContent("gallery");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.errors?.alt ?? err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <img src={image.thumbnailSrc ?? image.src} alt="" className="max-h-64 w-full rounded-xl object-contain" />
      <Field id="edit-alt" label="Description (alt text)" required error={error}>
        <input {...fieldProps("edit-alt", error)} value={alt} maxLength={200} onChange={(e) => setAlt(e.target.value)} />
      </Field>
      <Field id="edit-caption" label="Caption">
        <input {...fieldProps("edit-caption")} value={caption} maxLength={300} onChange={(e) => setCaption(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" busy={busy}>
          Save
        </Button>
      </div>
    </form>
  );
}

export default function GalleryAdmin() {
  const { request } = useAdmin();
  const { data, error, loading, reload } = useAdminData("/api/content/gallery", { public: true });
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState({ tone: "success", text: "" });
  const items = data?.items ?? [];

  const remove = async (image) => {
    if (!window.confirm(`Delete this image from the gallery and Cloudinary?\n\n${image.alt}`)) return;
    try {
      await request(`/gallery/${image.id}`, { method: "DELETE" });
      invalidateSiteContent("gallery");
      setNotice({ tone: "success", text: "Image deleted." });
      reload();
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    }
  };

  return (
    <>
      <PageTitle title="Gallery images" description="Photos shown in the Gallery on the Media page and on the home page (newest first)." />
      <UploadForm onUploaded={reload} />
      <Notice tone={notice.tone} onDismiss={() => setNotice({ tone: "success", text: "" })}>
        {notice.text || error}
      </Notice>
      {loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty>No images yet. The website shows “To be announced” until you add some.</Empty>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((image) => (
            <li key={image.id} className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
              <img src={image.thumbnailSrc ?? image.src} alt={image.alt} loading="lazy" className="aspect-square w-full object-cover" />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-[#0d1b0d]">{image.alt}</p>
                {image.caption && <p className="mt-1 line-clamp-1 text-xs text-[#5b735b]">{image.caption}</p>}
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" icon={Pencil} onClick={() => setEditing(image)} className="flex-1 px-2">
                    Edit
                  </Button>
                  <Button variant="danger" icon={Trash2} onClick={() => remove(image)} aria-label={`Delete ${image.alt}`} className="px-3" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={Boolean(editing)} title="Edit image" onClose={() => setEditing(null)}>
        {editing && <EditImage image={editing} onClose={() => setEditing(null)} onSaved={reload} />}
      </Modal>
    </>
  );
}
