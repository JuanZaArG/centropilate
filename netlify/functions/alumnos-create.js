const { getSheetsClient } = require("./sheetsClient");

function sesionesPorPlan(plan) {
  const n = parseInt(plan, 10);
  if (n === 8 || n === 12 || n === 20) return n;
  return "";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    if (!data.nombre || !data.apellido || !data.dni) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "nombre, apellido y dni son obligatorios" }),
      };
    }

    const sheets = await getSheetsClient();

    const id = Date.now().toString();
    const ahora = new Date().toISOString();

    const sesionesRestantes = sesionesPorPlan(data.plan_sesiones);
    const estadoPago = "verde"; // por defecto: recién abonado / válido

    const row = [
      id,
      data.nombre || "",
      data.apellido || "",
      data.fecha_nacimiento || "",
      data.dni || "",
      data.telefono || "",
      data.derivado_medico || "",
      data.patologia_cirugia || "",
      data.patologia_tipo || "",
      data.plan_sesiones || "",
      data.fecha_pago || ahora,
      estadoPago,
      data.instructor || "",
      data.horario || "",
      sesionesRestantes,
      data.observaciones || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Alumnos!A:P",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, id }),
    };
  } catch (err) {
    console.error("Error en alumnos-create:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
