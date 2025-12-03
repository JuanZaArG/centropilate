const { getSheetsClient } = require("./sheetsClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    if (!data.dia || !data.hora || !data.sala) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "dia, hora y sala son obligatorios" }),
      };
    }

    const sheets = await getSheetsClient();

    const id = Date.now().toString();

    const row = [
      id,
      data.dia || "",
      data.hora || "",
      data.sala || "",
      data.capacidad || "",
      data.instructor_id || "",
      data.activo || "sí",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Horarios!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, id }),
    };
  } catch (err) {
    console.error("Error en horarios-create:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
