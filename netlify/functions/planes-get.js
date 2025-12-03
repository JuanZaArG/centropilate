const { ok, fail, readSheet } = require("./utils");

exports.handler = async () => {
  try {
    const { records } = await readSheet("Planes", 10);
    const activas = records.filter((plan) => (plan.activo || "").toString().toLowerCase() === "sí");
    return ok({ planes: activas });
  } catch (error) {
    console.error("planes-get error", error);
    return fail(error.message || "No se pudieron cargar los planes", 500);
  }
};
