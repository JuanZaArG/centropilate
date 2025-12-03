const { ok, fail, readSheet, updateRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return fail("Método no soportado", 405);
    }

    const payload = parseJSONBody(event);
    if (!payload.recup_id) {
      return fail("Se requiere recup_id para actualizar");
    }

    const { header, records } = await readSheet("Recuperaciones", 20);
    if (!header.length) {
      return fail("Hoja de recuperaciones vacía", 500);
    }

    const rowIndex = records.findIndex((item) => item.recup_id === payload.recup_id);
    if (rowIndex === -1) {
      return fail("Recuperación no encontrada", 404);
    }

    const actualizado = { ...records[rowIndex], ...payload };
    const rowValues = buildRow(header, actualizado);

    await updateRow("Recuperaciones", rowIndex + 2, rowValues);

    return ok(actualizado);
  } catch (error) {
    console.error("recuperaciones-update error", error);
    return fail(error.message || "No se pudo actualizar la recuperación", 500);
  }
};
