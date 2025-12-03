const { ok, fail, readSheet, updateRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    if (!payload.gasto_id) {
      return fail("Se requiere gasto_id para actualizar");
    }

    const { header, records } = await readSheet("Gastos", 20);
    if (!header.length) {
      return fail("Hoja de gastos vacía", 500);
    }

    const rowIndex = records.findIndex((item) => item.gasto_id === payload.gasto_id);
    if (rowIndex === -1) {
      return fail("Gasto no encontrado", 404);
    }

    const actualizado = { ...records[rowIndex], ...payload };
    const rowValues = buildRow(header, actualizado);

    await updateRow("Gastos", rowIndex + 2, rowValues);

    return ok(actualizado);
  } catch (error) {
    console.error("gastos-update error", error);
    return fail(error.message || "No se pudo actualizar el gasto", 500);
  }
};
