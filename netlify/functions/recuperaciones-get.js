const { ok, fail, readSheet } = require("./utils");

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const { instructorId, mes, alumnoId } = params;

    const { records: recuperaciones } = await readSheet("Recuperaciones", 20);

    const filtrado = recuperaciones.filter((registro) => {
      if (instructorId && registro.instructor_id !== instructorId) return false;
      if (mes && registro.mes !== mes) return false;
      if (alumnoId && registro.alumno_id !== alumnoId) return false;
      return true;
    });

    return ok({ recuperaciones: filtrado });
  } catch (error) {
    console.error("recuperaciones-get error", error);
    return fail(error.message || "No se pudieron cargar las recuperaciones", 500);
  }
};
