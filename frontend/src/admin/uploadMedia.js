// Uploads a file straight from the browser to media storage (Cloudinary) using a
// signature from the API, so large videos never pass through the API server.
// Resolves with Cloudinary's response ({ public_id, width, height, duration, ... }).
import { uploadFile } from "../lib/uploadFile";

export async function uploadMedia(request, kind, file, options) {
  const { upload } = await request("/uploads", { method: "POST", body: { kind } });
  return uploadFile(upload, file, options);
}
