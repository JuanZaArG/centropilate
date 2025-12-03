const { getSheetsClient } = require("./sheetsClient");

const JSON_HEADERS = { "Content-Type": "application/json" };

const createResponse = (statusCode, payload) => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(payload),
});

const ok = (data) => createResponse(200, { ok: true, data });
const fail = (message, statusCode = 400) => createResponse(statusCode, { ok: false, error: message });

const columnLetter = (num) => {
  let letter = "";
  while (num > 0) {
    const mod = (num - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    num = Math.floor((num - 1) / 26);
  }
  return letter;
};

const normalizeHeader = (header) => header.map((col) => (col ? String(col).trim() : ""));

const sanitizeColumn = (column) =>
  column
    ? column
        .replace(/\s*\(.*?\)/g, "")
        .replace(/\s+/g, "_")
        .trim()
    : "";

const mapRows = (header, rows) =>
  rows.map((row) => {
    return header.reduce((acc, column, idx) => {
      const value = row[idx] ?? "";
      acc[column] = value;
      const sanitized = sanitizeColumn(column);
      if (sanitized && sanitized !== column) {
        acc[sanitized] = value;
      }
      return acc;
    }, {});
  });

const readSheet = async (sheetName, maxCols = 26) => {
  const sheets = await getSheetsClient();
  const range = `${sheetName}!A1:${columnLetter(maxCols)}1000`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const values = response.data.values || [];
  const header = values[0] ? normalizeHeader(values[0]) : [];
  const rows = values.slice(1);
  const records = header.length > 0 ? mapRows(header, rows) : [];
  return { header, rows, records };
};

const appendRow = async (sheetName, values) => {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    resource: { values: [values] },
  });
};

const updateRow = async (sheetName, rowNumber, values) => {
  const sheets = await getSheetsClient();
  if (!rowNumber) {
    throw new Error("Número de fila inválido");
  }
  const endCol = columnLetter(values.length);
  const range = `${sheetName}!A${rowNumber}:${endCol}${rowNumber}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values: [values] },
  });
};

const overwriteSheet = async (sheetName, header, rows) => {
  const sheets = await getSheetsClient();
  const values = [header, ...rows];
  const endCol = columnLetter(header.length);
  const range = `${sheetName}!A1:${endCol}${values.length}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
};

const buildRow = (header, payload) => header.map((column) => payload[column] ?? "");

const parseJSONBody = (event) => {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (err) {
    throw new Error("Body inválido: JSON mal formado");
  }
};

const getRecordRowNumber = (records, header, field, value) => {
  const fieldIndex = header.findIndex((col) => col === field);
  if (fieldIndex === -1) return null;
  const rowIndex = records.findIndex((item) => item[field] === value);
  return rowIndex >= 0 ? rowIndex + 2 : null;
};

const sumByKey = (items, key) =>
  items.reduce((acc, item) => acc + parseFloat(item[key] || 0), 0);

module.exports = {
  ok,
  fail,
  readSheet,
  appendRow,
  updateRow,
  overwriteSheet,
  buildRow,
  parseJSONBody,
  getRecordRowNumber,
  sumByKey,
};
