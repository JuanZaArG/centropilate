const { ok, fail, readSheet, appendRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return fail("Método no soportado", 405);
    const payload = parseJSONBody(event);
    const required = ["fecha", "hora", "sala", "instructor_id", "alumno_id"];
    const missing = required.filter((field) => !payload[field]);
    if (missing.length) return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);

    const { header } = await readSheet("AsistenciaPorHora", 20);
    if (!header.length) return fail("La hoja AsistenciaPorHora no tiene cabecera", 500);

    const registro = {
      registro_id: payload.registro_id || `asistencia-${Date.now()}`,
      fecha: payload.fecha,
      hora: payload.hora,
      sala: payload.sala,
      instructor_id: payload.instructor_id,
      alumno_id: payload.alumno_id,
      plan_id: payload.plan_id || "",
      estado: payload.estado || "confirmado",
      observacion: payload.observacion || "",
    };

    await appendRow("AsistenciaPorHora", buildRow(header, registro));

    try {
      const motivo =
        (payload.estado || "").toLowerCase() === "confirmado" ? "Asistencia confirmada" : "Falta registrada";
      const recupData = {
      recup_id: `recup-${Date.now()}`,
      alumno_id: payload.alumno_id,
      instructor_id: payload.instructor_id,
      mes: payload.fecha ? payload.fecha.slice(0, 7) : "",
      fecha_recupera: "",
        motivo,
        estado: "",
        observacion: "",
      };
      const { header: recHeader } = await readSheet("Recuperaciones", 20);
      if (recHeader.length) {
        const recRow = buildRow(recHeader, recupData);
        await appendRow("Recuperaciones", recRow);
      } else {
        console.warn("Hoja Recuperaciones sin cabecera; no se registró la asistencia.");
      }
    } catch (err) {
      console.error("No se pudo registrar en Recuperaciones desde asistencia-hora-create", err);
    }

    return ok(registro);
  } catch (error) {
    console.error("asistencia-hora-create error", error);
    return fail(error.message || "No se pudo registrar la asistencia", 500);
  }
};
