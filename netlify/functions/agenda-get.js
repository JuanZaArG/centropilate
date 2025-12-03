const { ok, fail, readSheet } = require("./utils");

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const { instructorId, mes } = params;

    const { records: agenda } = await readSheet("Agenda", 12);

    const filtrado = agenda.filter((registro) => {
      if (instructorId && registro.instructor_id !== instructorId) return false;
      if (mes) {
        const fecha = registro.fecha || "";
        if (!fecha.startsWith(mes)) return false;
      }
      return true;
    });

    return ok({ agenda: filtrado });
  } catch (error) {
    console.error("agenda-get error", error);
    return fail(error.message || "No se pudo cargar la agenda", 500);
  }
};
