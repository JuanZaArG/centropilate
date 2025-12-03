const {
  ok,
  fail,
  readSheet,
  appendRow,
  updateRow,
  overwriteSheet,
  buildRow,
} = require("./utils");

const PORCENTAJE = 0.4;

const prepararCabeceraDetalle = async (sueldosSheet) => {
  if (sueldosSheet.header.includes("detalle_ingresos")) {
    return sueldosSheet;
  }
  const header = [...sueldosSheet.header];
  const insertIndex =
    header.indexOf("sueldo_estimado") >= 0 ? header.indexOf("sueldo_estimado") + 1 : header.length;
  header.splice(insertIndex, 0, "detalle_ingresos");
  const rows = sueldosSheet.records.map((record) => {
    const payload = {
      ...record,
      detalle_ingresos: record.detalle_ingresos || "",
    };
    return buildRow(header, payload);
  });
  await overwriteSheet("Sueldos", header, rows);
  return readSheet("Sueldos", header.length);
};

const calcularSueldosMes = async (mes) => {
  if (!mes) {
    throw new Error("El parámetro 'mes' es obligatorio (formato YYYY-MM)");
  }

  const pagosSheet = await readSheet("Pagos", 20);
  let sueldosSheet = await readSheet("Sueldos", 20);
  const alumnosSheet = await readSheet("Alumnos", 20);

  sueldosSheet = await prepararCabeceraDetalle(sueldosSheet);

  const alumnosMap = alumnosSheet.records.reduce((acc, alumno) => {
    acc[alumno.id] = alumno;
    return acc;
  }, {});

  const pagosDelMes = pagosSheet.records.filter((pago) => pago.mes_liquidado === mes);

  const agrupado = pagosDelMes.reduce((acc, pago) => {
    const instructorId = pago.instructor_id;
    if (!instructorId) return acc;

    if (!acc[instructorId]) {
      acc[instructorId] = { acumulado: 0, alumnos: new Set(), detalle: [] };
    }
    const monto = parseFloat(pago.monto || 0);
    acc[instructorId].acumulado += isNaN(monto) ? 0 : monto;
    if (pago.alumno_id) acc[instructorId].alumnos.add(pago.alumno_id);
    const alumnoInfo = alumnosMap[pago.alumno_id] || {};
    const nombreAlumno = `${alumnoInfo.nombre || ""} ${alumnoInfo.apellido || ""}`.trim() || pago.alumno_id;
    const planLabel = alumnoInfo.plan_sesiones ? `Plan ${alumnoInfo.plan_sesiones}` : "Plan sin asignar";
    acc[instructorId].detalle.push(`${nombreAlumno} · ${planLabel} · $${isNaN(monto) ? 0 : monto.toFixed(2)}`);
    return acc;
  }, {});

  const fechaCalculo = new Date().toISOString().split("T")[0];
  const actualizaciones = [];

  for (const [instructorId, resumen] of Object.entries(agrupado)) {
    const alumnosPagadores = resumen.alumnos.size;
    const totalRecaudado = Number(resumen.acumulado.toFixed(2));
    const sueldoEstimado = Number((totalRecaudado * PORCENTAJE).toFixed(2));

    const filaExistenteIndex = sueldosSheet.records.findIndex(
      (row) => row.instructor_id === instructorId && row.mes === mes
    );

    const filaExistente = filaExistenteIndex >= 0 ? sueldosSheet.records[filaExistenteIndex] : {};
    const sueldomes_id = filaExistente.sueldomes_id || `${mes}-${instructorId}`;
    const filaPayload = {
      sueldomes_id,
      instructor_id: instructorId,
      mes,
      alumnos_pagadores: String(alumnosPagadores),
      total_recaudado: String(totalRecaudado),
      porcentaje: String(PORCENTAJE),
      sueldo_estimado: String(sueldoEstimado),
      detalle_ingresos: resumen.detalle.join(" | "),
      fecha_calculo: fechaCalculo,
      pagado: filaExistente.pagado || "no",
      fecha_pago: filaExistente.fecha_pago || "",
      observacion: filaExistente.observacion || "",
    };

    const filaValores = buildRow(sueldosSheet.header, filaPayload);

    if (filaExistenteIndex >= 0) {
      await updateRow("Sueldos", filaExistenteIndex + 2, filaValores);
    } else {
      await appendRow("Sueldos", filaValores);
    }

    actualizaciones.push(filaPayload);
  }

  const resultadoActualizado = await readSheet("Sueldos", sueldosSheet.header.length);

  return { mes, calculos: actualizaciones, sueldos: resultadoActualizado.records };
};

const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const mes = params.mes;
    if (!mes) {
      return fail("El parámetro 'mes' es obligatorio (formato YYYY-MM)");
    }
    const resultado = await calcularSueldosMes(mes);
    return ok(resultado);
  } catch (error) {
    console.error("sueldos-calc error", error);
    return fail(error.message || "No se pudo calcular los sueldos", 500);
  }
};

exports.handler = handler;
exports.calcularSueldosMes = calcularSueldosMes;
