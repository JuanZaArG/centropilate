const { ok, fail, readSheet, sumByKey } = require("./utils");

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const mes = params.mes;

    if (!mes) {
      return fail("El parámetro 'mes' es obligatorio (formato YYYY-MM)");
    }

    const { records: pagos } = await readSheet("Pagos", 20);

    const pagosFiltrados = pagos.filter((pago) => {
      const mesValor =
        (pago.mes_liquidado ||
          pago["mes_liquidado(YYYY-MM)"] ||
          pago["mes_liquidado (YYYY-MM)"] ||
          "")
          .toString()
          .trim();
      return mesValor === mes;
    });
    const total = sumByKey(pagosFiltrados, "monto");

    return ok({ mes, pagos: pagosFiltrados, total_recaudado: Number(total.toFixed(2)) });
  } catch (error) {
    console.error("pagos-get error", error);
    return fail(error.message || "No se pudo obtener los pagos", 500);
  }
};
