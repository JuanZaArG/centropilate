// netlify/functions/alumnos-get.js
const { getSheetsClient } = require("./sheetsClient");

// ----------------------------
// Función para calcular estado
// ----------------------------
function calcularEstadoPago(fechaPago) {
  if (!fechaPago || fechaPago.trim() === "") return "Sin datos";

  const fecha = new Date(fechaPago);
  if (isNaN(fecha)) return "Fecha inválida";

  const hoy = new Date();
  const diferenciaMs = hoy - fecha;
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24)); // días exactos

  if (dias <= 30) return "Verde";      // Vigente
  if (dias <= 60) return "Amarillo";   // Aviso
  return "Rojo";                        // Baja manual
}

exports.handler = async () => {
  try {
    const sheets = await getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Alumnos!A2:P1000",
    });

    const rows = res.data.values || [];

    const alumnos = rows.map((row) => {
      const fechaPago = row[10] || "";

      return {
        id: row[0] || "",
        nombre: row[1] || "",
        apellido: row[2] || "",
        fecha_nacimiento: row[3] || "",
        dni: row[4] || "",
        telefono: row[5] || "",
        derivado_medico: row[6] || "",
        patologia_cirugia: row[7] || "",
        patologia_tipo: row[8] || "",
        plan_sesiones: row[9] || "",
        fecha_pago: fechaPago,
        estado_pago: calcularEstadoPago(fechaPago), // ← APLICA LA NUEVA FUNCIÓN
        instructor: row[12] || "",
        horario: row[13] || "",
        sesiones_restantes: row[14] || "",
        observaciones: row[15] || "",
      };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnos),
    };
  } catch (err) {
    console.error("Error en alumnos-get:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
