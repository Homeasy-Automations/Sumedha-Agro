import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Play, Video, X } from "lucide-react";
import content from "../data/content";
import useSiteContent from "../hooks/useSiteContent";
import EmptyState from "./EmptyState";
import { heading } from "./styles";

const { media, ui } = content;
const VIDEO_FALLBACK = media.videos.items;
const GALLERY_FALLBACK = media.gallery.items;

function Skeleton({ count, className }) {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} aria-hidden="true" className={`animate-pulse rounded-2xl bg-[#0d1b0d]/5 ${className}`} />
  ));
}

// Uploaded videos (Cloudinary) play in the browser's own player and load nothing until
// played. YouTube links show the thumbnail and only load the player when clicked.
function UploadedVideo({ video }) {
  return (
    <video
      className="absolute inset-0 h-full w-full bg-black"
      src={video.videoUrl}
      poster={video.thumbnailUrl}
      controls
      preload="none"
      playsInline
      aria-label={video.title}
    />
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const showPlayer = playing || !video.thumbnailUrl;
  const src = playing && video.thumbnailUrl ? `${video.embedUrl}?autoplay=1` : video.embedUrl;

  return (
    <figure className="overflow-hidden rounded-2xl border border-border-light bg-white">
      <div className="relative aspect-video bg-black">
        {video.provider === "upload" ? (
          <UploadedVideo video={video} />
        ) : showPlayer ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`${ui.playVideo}: ${video.title}`}
          >
            <img src={video.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[#0d1b0d] shadow-xl transition group-hover:scale-110">
                <Play size={24} aria-hidden="true" className="ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className={`p-4 text-sm font-semibold ${heading}`}>{video.title}</figcaption>
    </figure>
  );
}

function VideoGrid({ compact }) {
  const { items, loading } = useSiteContent("videos", VIDEO_FALLBACK);
  const shown = compact ? items.slice(0, 1) : items;
  const gridClass = compact ? "grid gap-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  if (loading && items.length === 0) {
    return <ul className={gridClass}><Skeleton count={compact ? 1 : 3} className="aspect-video" /></ul>;
  }
  if (shown.length === 0) return <EmptyState icon={Video} compact={compact} />;
  return (
    <ul className={gridClass}>
      {shown.map((video) => (
        <li key={video.id ?? video.embedUrl}>
          <VideoCard video={video} />
        </li>
      ))}
    </ul>
  );
}

function Lightbox({ items, index, onClose, onStep }) {
  const dialogRef = useRef(null);
  const item = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onStep(1);
        if (e.key === "ArrowLeft") onStep(-1);
      }}
      aria-label={item?.alt}
      className="m-auto w-[min(1100px,94vw)] bg-transparent p-0 text-white backdrop:bg-black/85"
    >
      {item && (
        <figure className="flex flex-col items-center gap-3">
          <img
            src={item.src}
            alt={item.alt}
            width={item.width ?? undefined}
            height={item.height ?? undefined}
            className="max-h-[78vh] w-auto rounded-xl object-contain"
          />
          {item.caption && <figcaption className="text-center text-sm text-gray-200">{item.caption}</figcaption>}
        </figure>
      )}
      <div className="mt-4 flex items-center justify-center gap-3">
        {items.length > 1 && (
          <button type="button" onClick={() => onStep(-1)} className="rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label={ui.previous}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        )}
        <button type="button" onClick={() => dialogRef.current.close()} className="rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label={ui.close}>
          <X size={20} aria-hidden="true" />
        </button>
        {items.length > 1 && (
          <button type="button" onClick={() => onStep(1)} className="rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label={ui.next}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </dialog>
  );
}

function GalleryGrid({ compact }) {
  const { items, loading } = useSiteContent("gallery", GALLERY_FALLBACK);
  const [open, setOpen] = useState(null);
  const shown = compact ? items.slice(0, 4) : items;
  const gridClass = compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

  if (loading && items.length === 0) {
    return <ul className={gridClass}><Skeleton count={4} className="aspect-square" /></ul>;
  }
  if (shown.length === 0) return <EmptyState icon={Images} compact={compact} />;

  return (
    <>
      <ul className={gridClass}>
        {shown.map((image, i) => (
          <li key={image.id ?? image.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-2xl border border-border-light"
              aria-label={`${ui.viewImage}: ${image.alt}`}
            >
              <img
                src={image.thumbnailSrc ?? image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        items={shown}
        index={open}
        onClose={() => setOpen(null)}
        onStep={(step) => setOpen((i) => (i === null ? i : (i + step + shown.length) % shown.length))}
      />
    </>
  );
}

// "Mushroom Videos" and "Gallery" blocks, managed in the admin panel.
// compact: home-page preview (one video, four images).
export default function MediaSection({ compact = false, headingLevel = "h2" }) {
  const Heading = headingLevel;
  const blocks = [
    { ...media.videos, icon: Video, Grid: VideoGrid },
    { ...media.gallery, icon: Images, Grid: GalleryGrid },
  ];

  return (
    <div className={compact ? "grid gap-6 sm:grid-cols-2" : "grid gap-8"}>
      {blocks.map((block) => {
        const { id, title, icon: BlockIcon, Grid } = block;
        return (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-36">
            <Heading
              id={`${id}-heading`}
              className={`mb-4 flex items-center gap-2 font-bold ${compact ? "text-lg" : "text-2xl"} ${heading}`}
            >
              <BlockIcon size={compact ? 18 : 22} aria-hidden="true" className="text-text-side" />
              {title}
            </Heading>
            <Grid compact={compact} />
          </section>
        );
      })}
    </div>
  );
}
