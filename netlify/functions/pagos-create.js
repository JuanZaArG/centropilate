const { ok, fail, readSheet, appendRow, buildRow, parseJSONBody } = require("./utils");
const { calcularSueldosMes } = require("./sueldos-calc");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    const required = ["alumno_id", "instructor_id", "fecha_pago", "mes_liquidado", "monto"];
    const missing = required.filter((campo) => !payload[campo]);
    if (missing.length > 0) {
      return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const { header } = await readSheet("Pagos", 20);
    if (!header.length) {
      return fail("Cabecera de hoja Pagos indefinida", 500);
    }

    const registro = {
      pago_id: payload.pago_id || `pago-${Date.now()}`,
      alumno_id: payload.alumno_id,
      instructor_id: payload.instructor_id,
      fecha_pago: payload.fecha_pago,
      mes_liquidado: payload.mes_liquidado,
      monto: payload.monto,
      medio_pago: payload.medio_pago || "",
      observacion: payload.observacion || "",
    };

    await appendRow("Pagos", buildRow(header, registro));

    try {
      await calcularSueldosMes(payload.mes_liquidado);
    } catch (error) {
      console.error("No se pudo recalcular sueldos automáticamente:", error);
    }

    return ok(registro);
  } catch (error) {
    console.error("pagos-create error", error);
    return fail(error.message || "No se pudo crear el pago", 500);
  }
};
