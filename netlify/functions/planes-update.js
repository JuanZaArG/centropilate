const { ok, fail, readSheet, updateRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    if (!payload.plan_id) {
      return fail("Se requiere plan_id para actualizar");
    }

    const { header, records } = await readSheet("Planes", 10);
    if (!header.length) {
      return fail("Hoja de planes vacía", 500);
    }

    const rowIndex = records.findIndex((item) => item.plan_id === payload.plan_id);
    if (rowIndex === -1) {
      return fail("Plan no encontrado", 404);
    }

    const actualizado = { ...records[rowIndex], ...payload };
    const rowValues = buildRow(header, actualizado);
    await updateRow("Planes", rowIndex + 2, rowValues);

    return ok(actualizado);
  } catch (error) {
    console.error("planes-update error", error);
    return fail(error.message || "No se pudo actualizar el plan", 500);
  }
};
