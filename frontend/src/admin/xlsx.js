// Excel (.xlsx) export for admin tables, written directly (no spreadsheet library).
// One sheet: a bold header row that stays visible while scrolling, filter buttons on every
// column, sized columns, and all values as text (so mobile and Aadhar numbers keep every
// digit, and nothing is ever run as a formula). "datetime" columns become real Excel dates.

import { saveFile } from "./csv";

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

// Cell styles (indexes into cellXfs in styles.xml).
const STYLE = { header: 1, text: 2, wrapped: 3, dateTime: 4 };
const MIN_WIDTH = 8;
const MAX_WIDTH = 60;

const escapeXml = (text) =>
  text
    // Characters XML 1.0 does not allow at all.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// 0 -> A, 25 -> Z, 26 -> AA
function columnName(index) {
  let name = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
}

// Excel stores dates as days since 1899-12-30, in local time.
function excelDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return (date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000 + 25_569;
}

function textCell(ref, text, style) {
  const space = /^\s|\s$|\n/.test(text) ? ' xml:space="preserve"' : "";
  return `<c r="${ref}" t="inlineStr" s="${style}"><is><t${space}>${escapeXml(text)}</t></is></c>`;
}

function sheetXml(rows, columns) {
  const widths = columns.map(([, label]) => Math.max(MIN_WIDTH, label.length + 2));
  const lastColumn = columnName(columns.length - 1);
  const lastRow = rows.length + 1;

  const header = columns.map(([, label], c) => textCell(`${columnName(c)}1`, label, STYLE.header)).join("");
  const body = rows.map((row, r) => {
    const cells = columns.map(([key, , type], c) => {
      const ref = `${columnName(c)}${r + 2}`;
      const raw = row[key];
      if (raw == null || raw === "") return "";
      if (type === "datetime") {
        const serial = excelDate(raw);
        if (serial !== null) {
          widths[c] = Math.max(widths[c], 18);
          return `<c r="${ref}" s="${STYLE.dateTime}"><v>${serial}</v></c>`;
        }
      }
      const text = String(raw);
      const longestLine = Math.max(...text.split("\n").map((line) => line.length));
      widths[c] = Math.min(MAX_WIDTH, Math.max(widths[c], longestLine + 2));
      return textCell(ref, text, text.includes("\n") || longestLine > MAX_WIDTH ? STYLE.wrapped : STYLE.text);
    });
    return `<row r="${r + 2}">${cells.join("")}</row>`;
  });

  const cols = widths.map((w, c) => `<col min="${c + 1}" max="${c + 1}" width="${w}" customWidth="1"/>`).join("");
  return (
    `${XML_HEAD}<worksheet xmlns="${NS}">` +
    `<dimension ref="A1:${lastColumn}${lastRow}"/>` +
    '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
    '<sheetFormatPr defaultRowHeight="15"/>' +
    `<cols>${cols}</cols>` +
    `<sheetData><row r="1">${header}</row>${body.join("")}</sheetData>` +
    `<autoFilter ref="A1:${lastColumn}${lastRow}"/>` +
    "</worksheet>"
  );
}

const STYLES_XML =
  `${XML_HEAD}<styleSheet xmlns="${NS}">` +
  '<numFmts count="1"><numFmt numFmtId="164" formatCode="dd mmm yyyy hh:mm"/></numFmts>' +
  '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font>' +
  '<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>' +
  '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
  '<fill><patternFill patternType="solid"><fgColor rgb="FFE7F3E7"/><bgColor indexed="64"/></patternFill></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="5">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
  '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
  '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf>' +
  '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
  '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>' +
  "</cellXfs>" +
  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
  "</styleSheet>";

function workbookFiles(rows, columns, sheetName) {
  const name = sheetName.replace(/[[\]:*?/\\]/g, " ").slice(0, 31) || "Sheet1";
  const range = `'${name.replace(/'/g, "''")}'!$A$1:$${columnName(columns.length - 1)}$${rows.length + 1}`;
  return {
    "[Content_Types].xml":
      `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      "</Types>",
    "_rels/.rels":
      `${XML_HEAD}<Relationships xmlns="${PKG_REL_NS}">` +
      `<Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/>` +
      "</Relationships>",
    "xl/workbook.xml":
      `${XML_HEAD}<workbook xmlns="${NS}" xmlns:r="${REL_NS}">` +
      `<sheets><sheet name="${escapeXml(name)}" sheetId="1" r:id="rId1"/></sheets>` +
      `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">${escapeXml(range)}</definedName></definedNames>` +
      "</workbook>",
    "xl/_rels/workbook.xml.rels":
      `${XML_HEAD}<Relationships xmlns="${PKG_REL_NS}">` +
      `<Relationship Id="rId1" Type="${REL_NS}/worksheet" Target="worksheets/sheet1.xml"/>` +
      `<Relationship Id="rId2" Type="${REL_NS}/styles" Target="styles.xml"/>` +
      "</Relationships>",
    "xl/styles.xml": STYLES_XML,
    "xl/worksheets/sheet1.xml": sheetXml(rows, columns),
  };
}

// --- ZIP container (files stored uncompressed) ------------------------------------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const encoder = new TextEncoder();
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const [path, content] of Object.entries(files)) {
    const name = encoder.encode(path);
    const data = encoder.encode(content);
    const crc = crc32(data);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true); // version needed
    local.setUint16(8, 0, true); // stored
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(local, name, data);

    const entry = new DataView(new ArrayBuffer(46));
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true); // version made by
    entry.setUint16(6, 20, true); // version needed
    entry.setUint16(10, 0, true); // stored
    entry.setUint16(12, dosTime, true);
    entry.setUint16(14, dosDate, true);
    entry.setUint32(16, crc, true);
    entry.setUint32(20, data.length, true);
    entry.setUint32(24, data.length, true);
    entry.setUint16(28, name.length, true);
    entry.setUint32(42, offset, true);
    central.push(entry, name);

    offset += 30 + name.length + data.length;
  }

  const centralSize = central.reduce((sum, part) => sum + part.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, central.length / 2, true);
  end.setUint16(10, central.length / 2, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: XLSX_TYPE });
}

// columns: [[key, label, type?], ...]; type "datetime" for ISO date-time values.
export function toXlsx(rows, columns, { sheetName = "Sheet1" } = {}) {
  return zip(workbookFiles(rows, columns, sheetName));
}

export function downloadXlsx(filename, rows, columns, options) {
  saveFile(filename, toXlsx(rows, columns, options));
}
