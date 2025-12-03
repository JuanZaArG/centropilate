const { ok, fail, readSheet, overwriteSheet, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    if (!payload.plan_id) {
      return fail("Se requiere plan_id para eliminar");
    }

    const { header, rows, records } = await readSheet("Planes", 10);
    if (!header.length) {
      return fail("Hoja de planes vacía", 500);
    }

    const rowIndex = records.findIndex((item) => item.plan_id === payload.plan_id);
    if (rowIndex === -1) {
      return fail("Plan no encontrado", 404);
    }

    const rowsActualizados = rows.filter((_, idx) => idx !== rowIndex);
    await overwriteSheet("Planes", header, rowsActualizados);

    return ok({ eliminado: payload.plan_id });
  } catch (error) {
    console.error("planes-delete error", error);
    return fail(error.message || "No se pudo eliminar el plan", 500);
  }
};
