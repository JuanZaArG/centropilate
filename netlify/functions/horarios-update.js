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
      range: "Horarios!A2:G1000",
    });
    const rows = res.data.values || [];
    const targetIndex = rows.findIndex((row) => String(row[0]) === String(id));
    if (targetIndex === -1) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, error: "Horario no encontrado" }) };
    }
    const existing = rows[targetIndex];
    const updatedRow = [
      id,
      payload.dia ?? existing[1] ?? "",
      payload.hora ?? existing[2] ?? "",
      payload.sala ?? existing[3] ?? "",
      payload.capacidad ?? existing[4] ?? "",
      payload.instructor_id ?? existing[5] ?? "",
      payload.activo ?? existing[6] ?? "",
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Horarios!A${targetIndex + 2}:G${targetIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [updatedRow] },
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Error en horarios-update:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
