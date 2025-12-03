const { ok, fail, readSheet } = require("./utils");

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const instructorId = params.instructorId;

    const { records: sueldos } = await readSheet("Sueldos", 20);

    const filtrado = instructorId
      ? sueldos.filter((row) => row.instructor_id === instructorId)
      : sueldos;

    return ok({ sueldos: filtrado });
  } catch (error) {
    console.error("sueldos-get error", error);
    return fail(error.message || "No se pudo obtener los sueldos", 500);
  }
};
