import { useId, useRef, useState } from "react";
import { ExternalLink, Link2, Plus, Upload } from "lucide-react";
import ContentEditor from "../ContentEditor";
import ProgressBar from "../ProgressBar";
import { useAdmin } from "../session";
import { fieldProps } from "../styles";
import { uploadMedia } from "../uploadMedia";
import { Button, Card, Field, Notice, PageTitle } from "../ui";

const TITLE_FIELD = { name: "title", label: "Title", required: true, maxLength: 200 };
const MODES = [
  { id: "upload", label: "Upload a video file", icon: Upload },
  { id: "link", label: "YouTube or Vimeo link", icon: Link2 },
];

function AddVideo({ onCreated }) {
  const { request } = useAdmin();
  const uid = useId();
  const fileInput = useRef(null);
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);
  const busy = progress !== null;

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      title: title.trim() ? "" : "Enter a title.",
      file: mode === "upload" && !file ? "Choose a video file." : "",
      url: mode === "link" && !url.trim() ? "Paste a link." : "",
    };
    setErrors(nextErrors);
    setError("");
    if (Object.values(nextErrors).some(Boolean)) return;

    setProgress(0);
    try {
      if (mode === "upload") {
        const uploaded = await uploadMedia(request, "video", file, { onProgress: setProgress });
        await request("/videos", { method: "POST", body: { publicId: uploaded.public_id, title: title.trim() } });
      } else {
        await request("/videos", { method: "POST", body: { url: url.trim(), title: title.trim() } });
      }
      setFile(null);
      setUrl("");
      setTitle("");
      if (fileInput.current) fileInput.current.value = "";
      onCreated();
    } catch (err) {
      setErrors(err.errors ?? {});
      setError(err.message);
    } finally {
      setProgress(null);
    }
  };

  return (
    <Card title="Add a video" className="mb-6">
      <div role="radiogroup" aria-label="Video source" className="mb-5 inline-flex rounded-xl bg-background-light p-1">
        {MODES.map(({ id, label, icon: ModeIcon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            disabled={busy}
            onClick={() => {
              setMode(id);
              setErrors({});
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === id ? "bg-white text-text-side shadow-sm" : "text-[#5b735b] hover:text-[#0d1b0d]"
            }`}
          >
            <ModeIcon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <Notice tone="error">{error}</Notice>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {mode === "upload" ? (
          <Field
            id={`${uid}-file`}
            label="Video file"
            required
            hint="MP4, MOV or WebM, up to 100 MB. Stored on Cloudinary."
            error={errors.file}
          >
            <input
              ref={fileInput}
              {...fieldProps(`${uid}-file`, errors.file, true)}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.m4v"
              disabled={busy}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>
        ) : (
          <Field
            id={`${uid}-url`}
            label="YouTube or Vimeo link"
            required
            hint="Paste the address of the video page."
            error={errors.url}
          >
            <input
              {...fieldProps(`${uid}-url`, errors.url, true)}
              type="url"
              placeholder="https://www.youtube.com/watch?v=…"
              value={url}
              maxLength={500}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Field>
        )}
        <Field id={`${uid}-title`} label="Title" required error={errors.title}>
          <input
            {...fieldProps(`${uid}-title`, errors.title)}
            placeholder="e.g. Preparing oyster mushroom spawn"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <div className="flex flex-col gap-3 md:col-span-2">
          <ProgressBar value={mode === "upload" ? progress : null} label="Upload progress" />
          <div>
            <Button type="submit" busy={busy} icon={Plus}>
              {busy ? (mode === "upload" ? "Uploading…" : "Adding…") : "Add video"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

const PROVIDER_LABEL = { youtube: "YouTube", vimeo: "Vimeo", upload: "Uploaded file" };

function Summary({ item }) {
  const href = item.provider === "upload" ? item.videoUrl : item.watchUrl;
  return (
    <div className="flex items-center gap-4">
      {item.thumbnailUrl ? (
        <img src={item.thumbnailUrl} alt="" loading="lazy" className="aspect-video w-32 shrink-0 rounded-lg bg-slate-100 object-cover" />
      ) : (
        <span className="flex aspect-video w-32 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-[#5b735b]">
          {PROVIDER_LABEL[item.provider]}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-[#0d1b0d]">{item.title}</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-text-side hover:underline">
          {PROVIDER_LABEL[item.provider]} <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default function VideosAdmin() {
  return (
    <>
      <PageTitle title="Videos" description="Videos shown under “Mushroom Videos” on the Media page and on the home page (newest first)." />
      <ContentEditor
        kind="videos"
        endpoint="/videos"
        noun="Video"
        fields={[TITLE_FIELD]}
        initial={() => ({ title: "" })}
        renderAdd={({ onCreated }) => <AddVideo onCreated={onCreated} />}
        summary={(item) => <Summary item={item} />}
        emptyText="No videos yet. The website shows “To be announced” until you add one."
      />
    </>
  );
}
