const { ok, fail, readSheet, appendRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    const required = ["alumno_id", "instructor_id", "mes", "fecha_recupera", "motivo", "estado"];
    const missing = required.filter((campo) => !payload[campo]);
    if (missing.length > 0) {
      return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const pagosSheet = await readSheet("Pagos", 20);
    const pagoValido = pagosSheet.records.some(
      (pago) => pago.alumno_id === payload.alumno_id && pago.mes_liquidado === payload.mes
    );

    if (!pagoValido) {
      return fail("El alumno no registró pago para ese mes");
    }

    const { header } = await readSheet("Recuperaciones", 20);
    if (!header.length) {
      return fail("Hoja de recuperaciones vacía", 500);
    }

    const nuevoRegistro = {
      recup_id: payload.recup_id || `recup-${Date.now()}`,
      alumno_id: payload.alumno_id,
      instructor_id: payload.instructor_id,
      mes: payload.mes,
      fecha_recupera: payload.fecha_recupera,
      motivo: payload.motivo,
      estado: payload.estado,
      observacion: payload.observacion || "",
    };

    await appendRow("Recuperaciones", buildRow(header, nuevoRegistro));

    return ok(nuevoRegistro);
  } catch (error) {
    console.error("recuperaciones-create error", error);
    return fail(error.message || "No se pudo crear la recuperación", 500);
  }
};
