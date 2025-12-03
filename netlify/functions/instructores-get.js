const { getSheetsClient } = require("./sheetsClient");

exports.handler = async () => {
  try {
    const sheets = await getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Instructores!A2:E1000", // A:id, B:nombre, C:rol, D:color, E:whatsapp
    });

    const rows = res.data.values || [];

    const instructores = rows.map((row) => ({
      id: row[0] || "",
      nombre: row[1] || "",
      rol: row[2] || "",
      color: row[3] || "",
      whatsapp: row[4] || "",
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(instructores),
    };
  } catch (err) {
    console.error("Error en instructores-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
