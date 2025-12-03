const { getSheetsClient } = require("./sheetsClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const sheets = await getSheetsClient();

    const id = Date.now().toString();
    const { nombre, rol, color, whatsapp } = data;

    const row = [
      id,
      nombre || "",
      rol || "",
      color || "",
      whatsapp || ""
    ];

    // 1) Insertar fila
    const append = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Instructores!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    // Detectar la fila donde se insertó
    const updatedRange = append.data.updates.updatedRange;
    // Ejemplo: "Instructores!A5:E5"
    const fila = Number(updatedRange.match(/\d+/)[0]); 
    const rowIndex = fila - 1; // zero-based

    // 2) Pintar la celda (columna C = índice 3)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: Number(process.env.INSTRUCTORES_GID),
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 3,
                endColumnIndex: 4
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: hexToRgb(color)
                }
              },
              fields: "userEnteredFormat.backgroundColor"
            }
          }
        ]
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, id }),
    };

  } catch (err) {
    console.error("Error en instructores-create:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    red: ((bigint >> 16) & 255) / 255,
    green: ((bigint >> 8) & 255) / 255,
    blue: (bigint & 255) / 255
  };
}
