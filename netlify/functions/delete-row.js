const { getSheetsClient } = require("./sheetsClient");

async function findSheetId(sheets, spreadsheetId, sheetName) {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });

  const targetSheet = meta.data.sheets?.find((sheet) => sheet.properties.title === sheetName);
  return targetSheet?.properties.sheetId;
}

async function deleteRowById(sheetName, idValue) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SHEET_ID;

  const sheetId = await findSheetId(sheets, spreadsheetId, sheetName);
  if (sheetId === undefined) {
    throw new Error(`Hoja "${sheetName}" no encontrada`);
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A1000`,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row) => String(row[0]).trim() === String(idValue).trim());
  if (rowIndex === -1) {
    return false;
  }

  const startIndex = rowIndex + 1; // se cuenta desde la fila 0 (encabezado)

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex,
              endIndex: startIndex + 1,
            },
          },
        },
      ],
    },
  });

  return true;
}

module.exports = { deleteRowById };
