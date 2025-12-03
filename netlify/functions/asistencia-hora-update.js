const { ok, fail, readSheet, updateRow, buildRow, parseJSONBody } = require("./utils");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return fail("Método no soportado", 405);
    const payload = parseJSONBody(event);
    if (!payload.registro_id) return fail("Se requiere registro_id para actualizar");

    const { header, records } = await readSheet("AsistenciaPorHora", 20);
    if (!header.length) return fail("Hoja AsistenciaPorHora sin cabecera", 500);

    const rowIndex = records.findIndex((item) => item.registro_id === payload.registro_id);
    if (rowIndex === -1) return fail("Registro no encontrado", 404);

    const actualizado = { ...records[rowIndex], ...payload };
    const rowValues = buildRow(header, actualizado);
    await updateRow("AsistenciaPorHora", rowIndex + 2, rowValues);

    return ok(actualizado);
  } catch (error) {
    console.error("asistencia-hora-update error", error);
    return fail(error.message || "No se pudo actualizar la asistencia", 500);
  }
};
