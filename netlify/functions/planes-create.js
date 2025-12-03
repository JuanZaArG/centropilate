const { ok, fail, readSheet, appendRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    const required = ["nombre", "sesiones", "precio", "frecuencia"];
    const missing = required.filter((field) => !payload[field]);
    if (missing.length > 0) {
      return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const { header } = await readSheet("Planes", 10);
    if (!header.length) {
      return fail("Hoja de planes sin cabecera", 500);
    }

    const registro = {
      plan_id: payload.plan_id || `plan-${Date.now()}`,
      nombre: payload.nombre,
      sesiones: payload.sesiones,
      precio: payload.precio,
      frecuencia: payload.frecuencia,
      activo: payload.activo ?? "sí",
    };

    await appendRow("Planes", buildRow(header, registro));

    return ok(registro);
  } catch (error) {
    console.error("planes-create error", error);
    return fail(error.message || "No se pudo crear el plan", 500);
  }
};
