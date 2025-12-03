const { ok, fail, readSheet } = require("./utils");

exports.handler = async () => {
  try {
    const { records: gastos } = await readSheet("Gastos", 20);
    return ok({ gastos });
  } catch (error) {
    console.error("gastos-get error", error);
    return fail(error.message || "No se pudieron cargar los gastos", 500);
  }
};
