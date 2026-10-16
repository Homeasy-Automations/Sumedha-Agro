import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Play, Video, X } from "lucide-react";
import content from "../data/content";
import useSiteContent from "../hooks/useSiteContent";
import EmptyState from "./EmptyState";
import Reveal from "./Reveal";
import { cardHover, heading } from "./styles";

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
    <figure className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border-light bg-white ${cardHover}`}>
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
      <figcaption className={`flex flex-1 items-center p-4 text-sm font-semibold ${heading}`}>{video.title}</figcaption>
    </figure>
  );
}

function VideoGrid({ compact }) {
  const { items, loading } = useSiteContent("videos", VIDEO_FALLBACK);
  const shown = compact ? items.slice(0, 1) : items;
  // Compact: the one video card stretches to the height of the gallery beside it.
  const gridClass = compact ? "grid flex-1 gap-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  if (loading && items.length === 0) {
    return <ul className={gridClass}><Skeleton count={compact ? 1 : 3} className="aspect-video" /></ul>;
  }
  if (shown.length === 0) return <EmptyState icon={Video} compact={compact} />;
  return (
    <ul className={gridClass}>
      {shown.map((video, i) => (
        <li key={video.id ?? video.embedUrl}>
          <Reveal delay={Math.min(i, 5) * 0.06} className="h-full">
            <VideoCard video={video} />
          </Reveal>
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
      aria-label={item?.alt || item?.caption || ui.viewImage}
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
  const gridClass = compact ? "grid flex-1 grid-cols-2 gap-3" : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";
  // Compact tiles start at 4:3, so the 2×2 grid is about as tall as the video card beside it,
  // and stretch (cropping a little more) when the row is taller.
  const tileAspect = compact ? "aspect-[4/3]" : "aspect-square";

  if (loading && items.length === 0) {
    return <ul className={gridClass}><Skeleton count={4} className={tileAspect} /></ul>;
  }
  if (shown.length === 0) return <EmptyState icon={Images} compact={compact} />;

  return (
    <>
      <ul className={gridClass}>
        {shown.map((image, i) => (
          <li key={image.id ?? image.src}>
            <Reveal delay={Math.min(i, 7) * 0.05} className="h-full">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className={`group block h-full w-full overflow-hidden rounded-2xl border border-border-light ${cardHover}`}
                aria-label={image.alt || image.caption ? `${ui.viewImage}: ${image.alt || image.caption}` : `${ui.viewImage} ${i + 1}`}
              >
                <img
                  src={image.thumbnailSrc ?? image.src}
                  alt={image.alt}
                  loading="lazy"
                  className={`${tileAspect} h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100`}
                />
              </button>
            </Reveal>
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
// compact: home-page preview (one video, four images); the two blocks stretch to the same height,
// and to the section's height when a className such as flex-1 makes it taller.
export default function MediaSection({ compact = false, headingLevel = "h2", className = "" }) {
  const Heading = headingLevel;
  const blocks = [
    { ...media.videos, icon: Video, Grid: VideoGrid },
    { ...media.gallery, icon: Images, Grid: GalleryGrid },
  ];

  return (
    <div className={`${compact ? "grid gap-6 sm:grid-cols-2" : "grid gap-8"} ${className}`}>
      {blocks.map((block) => {
        const { id, title, icon: BlockIcon, Grid } = block;
        return (
          <section key={id} id={id} aria-labelledby={`${id}-heading`} className="flex scroll-mt-36 flex-col">
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
