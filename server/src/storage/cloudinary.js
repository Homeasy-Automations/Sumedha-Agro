// Cloudinary media storage. The admin's browser uploads files straight to Cloudinary with
// a signature from this server (so large videos never pass through the API host); the API
// then stores only the asset's public_id and builds optimized delivery URLs from it.
import { createHash, randomBytes } from "node:crypto";

// oneFile: the signature names the file's public_id, so it can create only that one asset
// (for uploads anyone can ask for: applicants' payment screenshots).
const KINDS = {
  image: { resourceType: "image", subfolder: "gallery", formats: "jpg,jpeg,png,webp,gif", maxBytes: 10 * 1024 * 1024 },
  video: { resourceType: "video", subfolder: "videos", formats: "mp4,mov,webm,m4v", maxBytes: 100 * 1024 * 1024 },
  // Any common image format, or a PDF receipt (Cloudinary stores PDFs as images and can show
  // their first page as one).
  screenshot: {
    resourceType: "image",
    subfolder: "payment-screenshots",
    formats: "jpg,jpeg,png,webp,gif,bmp,tif,tiff,heic,heif,avif,pdf",
    maxBytes: 10 * 1024 * 1024,
    oneFile: true,
  },
};

const PUBLIC_ID = /^[A-Za-z0-9_\-/.]+$/;

// https://cloudinary.com/documentation/authentication_signatures
export function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export function createCloudinaryStorage(cfg, { fetchImpl = fetch, now = () => Date.now() } = {}) {
  const deliver = (resourceType, transformation, publicId, ext = "") =>
    `${cfg.deliveryBaseUrl}/${cfg.cloudName}/${resourceType}/upload/${transformation}/${publicId}${ext}`;
  const folderFor = (kind) => `${cfg.folder}/${KINDS[kind].subfolder}`;

  return {
    name: "cloudinary",
    enabled: true,

    // Everything the browser needs to POST the file to Cloudinary.
    createUpload(kind) {
      const k = KINDS[kind];
      const params = { allowed_formats: k.formats, folder: folderFor(kind), timestamp: Math.floor(now() / 1000) };
      if (k.oneFile) params.public_id = randomBytes(12).toString("hex");
      return {
        provider: "cloudinary",
        uploadUrl: `${cfg.apiBaseUrl}/v1_1/${cfg.cloudName}/${k.resourceType}/upload`,
        fields: { ...params, api_key: cfg.apiKey, signature: signParams(params, cfg.apiSecret) },
        maxBytes: k.maxBytes,
      };
    },

    // Accepts only assets uploaded into this site's folder for that kind.
    isOwnAsset(kind, publicId) {
      return typeof publicId === "string" && PUBLIC_ID.test(publicId) && !publicId.includes("..") && publicId.startsWith(`${folderFor(kind)}/`);
    },

    imageUrls(publicId) {
      return {
        src: deliver("image", "f_auto,q_auto,c_limit,w_1600", publicId),
        thumbnailSrc: deliver("image", "f_auto,q_auto,c_fill,g_auto,w_600,h_600", publicId),
      };
    },

    // A payment screenshot: src to view it, a small square thumbnail, and the file itself.
    // A PDF is shown by its first page as a JPEG; `file` is the PDF. (Free Cloudinary
    // accounts deliver PDFs only with "Allow delivery of PDF and ZIP files" turned on.)
    screenshotUrls(publicId, format = "") {
      if (format === "pdf") {
        return {
          src: deliver("image", "pg_1,f_jpg,q_auto,c_limit,w_1600", publicId, ".jpg"),
          thumbnailSrc: deliver("image", "pg_1,f_jpg,q_auto,c_fill,g_north,w_200,h_200", publicId, ".jpg"),
          file: `${cfg.deliveryBaseUrl}/${cfg.cloudName}/image/upload/${publicId}.pdf`,
        };
      }
      const src = deliver("image", "f_auto,q_auto,c_limit,w_1600", publicId);
      return { src, thumbnailSrc: deliver("image", "f_auto,q_auto,c_fill,g_north,w_200,h_200", publicId), file: src };
    },

    videoUrls(publicId) {
      return {
        videoUrl: deliver("video", "q_auto", publicId, ".mp4"),
        posterUrl: deliver("video", "so_1,c_limit,w_960", publicId, ".jpg"),
      };
    },

    async destroy(kind, publicId) {
      const params = { invalidate: "true", public_id: publicId, timestamp: Math.floor(now() / 1000) };
      const body = new URLSearchParams({ ...params, api_key: cfg.apiKey, signature: signParams(params, cfg.apiSecret) });
      const res = await fetchImpl(`${cfg.apiBaseUrl}/v1_1/${cfg.cloudName}/${KINDS[kind].resourceType}/destroy`, {
        method: "POST",
        body,
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`Cloudinary destroy responded ${res.status}`);
      const { result } = await res.json();
      return result === "ok";
    },
  };
}
