const { getSheetsClient } = require("./sheetsClient");

exports.handler = async () => {
  try {
    const sheets = await getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Horarios!A2:G1000", // A:id, B:dia, C:hora, D:sala, E:capacidad, F:instructor_id, G:activo
    });

    const rows = res.data.values || [];

    const horarios = rows.map((row) => ({
      id: row[0] || "",
      dia: row[1] || "",
      hora: row[2] || "",
      sala: row[3] || "",
      capacidad: row[4] || "",
      instructor_id: row[5] || "",
      activo: row[6] || "",
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(horarios),
    };
  } catch (err) {
    console.error("Error en horarios-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
