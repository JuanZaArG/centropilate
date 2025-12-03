const {
  ok,
  fail,
  readSheet,
  appendRow,
  updateRow,
  buildRow,
  parseJSONBody,
} = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    const { header, records } = await readSheet("Agenda", 12);
    if (!header.length) {
      return fail("Ficha de agenda vacía", 500);
    }

    const isRemoval = Boolean(payload.remove);
    if (isRemoval) {
      if (!payload.agenda_id) {
        return fail("Se requiere agenda_id para quitar alumno");
      }
      const rowIndex = records.findIndex((item) => item.agenda_id === payload.agenda_id);
      if (rowIndex === -1) {
        return fail("Registro de agenda no encontrado", 404);
      }
      const registro = { ...records[rowIndex], alumno_id: "" };
      const rowValues = buildRow(header, registro);
      await updateRow("Agenda", rowIndex + 2, rowValues);
      return ok({ action: "removed", registro });
    }

    const required = ["fecha", "hora", "sala", "instructor_id"];
    const missing = required.filter((campo) => !payload[campo]);
    if (missing.length > 0) {
      return fail(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const agendaId = payload.agenda_id || `agenda-${Date.now()}`;
    const existingIndex = records.findIndex((item) => item.agenda_id === agendaId);
    const registro = {
      agenda_id: agendaId,
      fecha: payload.fecha,
      semana: payload.semana || "",
      dia_semana: payload.dia_semana || "",
      hora: payload.hora,
      sala: payload.sala,
      instructor_id: payload.instructor_id,
      alumno_id: payload.alumno_id || "",
    };

    const slotCount = records.filter((item) => {
      const sameSlot = item.fecha === registro.fecha && item.hora === registro.hora && item.sala === registro.sala;
      if (!sameSlot) return false;
      if (existingIndex >= 0 && item.agenda_id === agendaId) return false;
      return true;
    }).length;

    if (slotCount >= 10) {
      return fail("El cupo para ese horario ya alcanzó los 10 alumnos");
    }

    const rowValues = buildRow(header, registro);

    if (existingIndex >= 0) {
      await updateRow("Agenda", existingIndex + 2, rowValues);
      return ok({ action: "updated", registro });
    }

    await appendRow("Agenda", rowValues);
    return ok({ action: "created", registro });
  } catch (error) {
    console.error("agenda-set error", error);
    return fail(error.message || "No se pudo guardar la agenda", 500);
  }
};
