const { getSheetsClient } = require("./sheetsClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Método no permitido" }) };
  }
  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "JSON inválido" }) };
  }
  const { id } = payload;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Falta el id" }) };
  }
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.SHEET_ID;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Instructores!A2:E1000",
    });
    const rows = res.data.values || [];
    const targetIndex = rows.findIndex((row) => String(row[0]) === String(id));
    if (targetIndex === -1) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, error: "Instructor no encontrado" }) };
    }
    const existing = rows[targetIndex];
    const updatedRow = [
      id,
      payload.nombre ?? existing[1] ?? "",
      payload.rol ?? existing[2] ?? "",
      payload.color ?? existing[3] ?? "",
      payload.whatsapp ?? existing[4] ?? "",
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Instructores!A${targetIndex + 2}:E${targetIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [updatedRow] },
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Error en instructores-update:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
