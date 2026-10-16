// Shrinks photos in the browser before upload: at most MAX_SIZE px on the longest side,
// re-encoded as WebP (or JPEG where WebP isn't supported). This keeps the database small,
// makes the gallery load fast, and strips EXIF data such as GPS location from phone photos.
// GIFs are uploaded unchanged so animations survive.

const MAX_SIZE = 1600;
const QUALITY = 0.82;

const toBlob = (canvas, type) => new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));

export async function prepareImage(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This image format isn't supported here. Please choose a JPEG, PNG, WebP or GIF image.");
  }

  try {
    if (file.type === "image/gif") {
      return { blob: file, width: bitmap.width, height: bitmap.height, filename: file.name };
    }

    const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0, width, height);
    let blob = await toBlob(canvas, "image/webp");
    if (!blob || blob.type !== "image/webp") {
      // JPEG has no transparency: paint a white background first.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      blob = await toBlob(canvas, "image/jpeg");
    }
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return { blob, width, height, filename: `${file.name.replace(/\.[^.]+$/, "") || "image"}.${ext}` };
  } finally {
    bitmap.close();
  }
}
