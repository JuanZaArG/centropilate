const { getSheetsClient } = require("./sheetsClient");
const dayjs = require("dayjs");

const calcularEstadoPago = (fechaPago) => {
  if (!fechaPago) return "Sin datos";
  const fecha = dayjs(fechaPago);
  if (!fecha.isValid()) return "Fecha inválida";
  const diferencia = dayjs().diff(fecha, "day");
  if (diferencia <= 30) return "Verde";
  if (diferencia <= 60) return "Amarillo";
  return "Rojo";
};

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
      range: "Alumnos!A2:P1000",
    });

    const rows = res.data.values || [];
    const targetIndex = rows.findIndex((row) => String(row[0]) === String(id));
    if (targetIndex === -1) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, error: "Alumno no encontrado" }) };
    }

    const existing = rows[targetIndex];

    const newRow = [
      id,
      payload.nombre ?? existing[1] ?? "",
      payload.apellido ?? existing[2] ?? "",
      payload.fecha_nacimiento ?? existing[3] ?? "",
      payload.dni ?? existing[4] ?? "",
      payload.telefono ?? existing[5] ?? "",
      payload.derivado_medico ?? existing[6] ?? "",
      payload.patologia_cirugia ?? existing[7] ?? "",
      payload.patologia_tipo ?? existing[8] ?? "",
      payload.plan_sesiones ?? existing[9] ?? "",
      payload.fecha_pago ?? existing[10] ?? "",
      "",
      payload.instructor ?? existing[12] ?? "",
      payload.horario ?? existing[13] ?? "",
      payload.sesiones_restantes ?? existing[14] ?? "",
      payload.observaciones ?? existing[15] ?? "",
      payload.activo ?? existing[16] ?? "sí",
    ];

    const estado = calcularEstadoPago(newRow[10]);
    newRow[11] = estado;

    const updateRange = `Alumnos!A${targetIndex + 2}:Q${targetIndex + 2}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [newRow] },
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Error en alumnos-update:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
