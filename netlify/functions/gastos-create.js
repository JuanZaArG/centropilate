const { ok, fail, readSheet, appendRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    const required = ["fecha", "categoria", "descripcion", "monto", "medio_pago"];
    const missing = required.filter((campo) => !payload[campo]);
    if (missing.length > 0) {
      return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const { header } = await readSheet("Gastos", 20);
    if (!header.length) {
      return fail("Hoja de gastos sin cabecera", 500);
    }

    const registro = {
      gasto_id: payload.gasto_id || `gasto-${Date.now()}`,
      fecha: payload.fecha,
      categoria: payload.categoria,
      descripcion: payload.descripcion,
      monto: payload.monto,
      medio_pago: payload.medio_pago,
      comprobanteNro: payload.comprobanteNro || "",
      observacion: payload.observacion || "",
    };

    await appendRow("Gastos", buildRow(header, registro));
    return ok(registro);
  } catch (error) {
    console.error("gastos-create error", error);
    return fail(error.message || "No se pudo crear el gasto", 500);
  }
};
