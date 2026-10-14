// Helpers for video links (YouTube / Vimeo) added in the admin panel.

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;

// Accepts YouTube (watch, youtu.be, shorts, embed, live) and Vimeo links.
export function parseVideoUrl(input) {
  let url;
  try {
    url = new URL(String(input).trim());
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);

  let youtubeId = null;
  if (host === "youtu.be") youtubeId = parts[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtubeId = parts[0] === "watch" ? url.searchParams.get("v") : ["shorts", "embed", "live", "v"].includes(parts[0]) ? parts[1] : null;
  }
  if (youtubeId && YOUTUBE_ID.test(youtubeId)) return { provider: "youtube", videoId: youtubeId };

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parts.find((p) => VIMEO_ID.test(p));
    if (id) return { provider: "vimeo", videoId: id };
  }
  return null;
}

export function videoUrls({ provider, videoId }) {
  if (provider === "youtube") {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  }
  return {
    embedUrl: `https://player.vimeo.com/video/${videoId}`,
    watchUrl: `https://vimeo.com/${videoId}`,
    thumbnailUrl: null,
  };
}
