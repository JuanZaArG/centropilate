const { ok, fail, readSheet, overwriteSheet, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    if (!payload.gasto_id) {
      return fail("Se requiere gasto_id para eliminar");
    }

    const { header, rows, records } = await readSheet("Gastos", 20);
    if (!header.length) {
      return fail("Hoja de gastos vacía", 500);
    }

    const rowIndex = records.findIndex((item) => item.gasto_id === payload.gasto_id);
    if (rowIndex === -1) {
      return fail("Gasto no encontrado", 404);
    }

    const rowsActualizados = rows.filter((_, idx) => idx !== rowIndex);
    await overwriteSheet("Gastos", header, rowsActualizados);

    return ok({ eliminado: payload.gasto_id });
  } catch (error) {
    console.error("gastos-delete-one error", error);
    return fail(error.message || "No se pudo eliminar el gasto", 500);
  }
};
