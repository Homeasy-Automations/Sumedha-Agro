// Sends a file straight from the browser to media storage (Cloudinary), using the signed
// parameters an API endpoint returned ({ uploadUrl, fields, maxBytes }), so files never pass
// through the API server. Resolves with Cloudinary's response ({ public_id, width, height, ... }).

export function uploadFile(upload, file, { filename, onProgress } = {}) {
  if (file.size > upload.maxBytes) {
    return Promise.reject(
      new Error(`The file is larger than ${Math.round(upload.maxBytes / 1024 / 1024)} MB. Please choose a smaller file.`),
    );
  }

  const form = new FormData();
  for (const [key, value] of Object.entries(upload.fields)) form.append(key, String(value));
  form.append("file", file, filename ?? file.name ?? "upload");

  // XMLHttpRequest (not fetch) so we can report upload progress.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", upload.uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // not JSON
      }
      if (xhr.status >= 200 && xhr.status < 300 && data?.public_id) resolve(data);
      else reject(new Error(data?.error?.message ? `Upload failed: ${data.error.message}` : `Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.send(form);
  });
}
