const { ok, fail, readSheet } = require("./utils");

exports.handler = async (event) => {
  try {
    const { records } = await readSheet("AsistenciaPorHora", 20);
    return ok({ asistencia: records });
  } catch (error) {
    console.error("asistencia-hora-get error", error);
    return fail(error.message || "No se pudo cargar la asistencia", 500);
  }
};
