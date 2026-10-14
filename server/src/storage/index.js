// Media storage for admin uploads (gallery images, video files).
// To use another provider (S3, ImageKit…), add a module with the same methods as
// cloudinary.js and choose it here.
import { createCloudinaryStorage } from "./cloudinary.js";

export class StorageDisabledError extends Error {
  constructor() {
    super("Media uploads are not configured on the server (set CLOUDINARY_URL).");
    this.name = "StorageDisabledError";
  }
}

const disabled = {
  name: "none",
  enabled: false,
  createUpload() {
    throw new StorageDisabledError();
  },
  isOwnAsset: () => false,
  imageUrls: () => ({ src: "", thumbnailSrc: "" }),
  videoUrls: () => ({ videoUrl: "", posterUrl: "" }),
  async destroy() {
    return false;
  },
};

export function createStorage(config, options) {
  return config.cloudinary.enabled ? createCloudinaryStorage(config.cloudinary, options) : disabled;
}
