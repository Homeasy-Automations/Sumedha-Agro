// CSV export for admin tables (opens correctly in Excel and Google Sheets).

const cell = (value) => {
  let text = value == null ? "" : String(value);
  // Stop spreadsheet apps treating user input as a formula ("CSV injection").
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// columns: [[key, label, type?], ...] (type is used by the Excel export only)
export function toCsv(rows, columns) {
  const header = columns.map(([, label]) => cell(label)).join(",");
  const lines = rows.map((row) => columns.map(([key]) => cell(row[key])).join(","));
  return [header, ...lines].join("\r\n");
}

// Saves a Blob as a download.
export function saveFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCsv(filename, csv) {
  saveFile(filename, new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" })); // BOM so Excel reads UTF-8
}

// Fetches every page of an admin list endpoint.
export async function fetchAll(request, path) {
  const items = [];
  const sep = path.includes("?") ? "&" : "?";
  for (let offset = 0; ; offset += 100) {
    const page = await request(`${path}${sep}limit=100&offset=${offset}`);
    items.push(...page.items);
    if (items.length >= page.total || page.items.length === 0) return items;
  }
}

export const today = () => new Date().toISOString().slice(0, 10);
