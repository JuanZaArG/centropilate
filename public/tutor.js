const SESSION_KEY = "landingPilatesSession";

let loadingCount = 0;
const loaderEl = document.getElementById("loader-overlay");

const setLoading = (active) => {
  loadingCount = Math.max(0, loadingCount + (active ? 1 : -1));
  if (!loaderEl) return;
  if (loadingCount > 0) {
    loaderEl.classList.remove("hidden");
    loaderEl.setAttribute("aria-hidden", "false");
  } else {
    loaderEl.classList.add("hidden");
    loaderEl.setAttribute("aria-hidden", "true");
  }
};

const apiGet = async (path) => {
  setLoading(true);
  try {
    return await (await fetch(path)).json();
  } finally {
    setLoading(false);
  }
};

const apiPost = async (path, data) => {
  setLoading(true);
  try {
    return await (
      await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ).json();
  } finally {
    setLoading(false);
  }
};

const renderEstadoPago = (estado) => {
  const map = {
    Verde: "pagado",
    Amarillo: "pendiente",
    Rojo: "vencido",
    "Sin datos": "neutral",
  };
  const clase = map[estado] || "neutral";
  return `<span class="status-pill status-${clase}">${estado}</span>`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const sessionRaw = localStorage.getItem(SESSION_KEY);
  let sessionUser = null;
  try {
    sessionUser = sessionRaw ? JSON.parse(sessionRaw) : null;
  } catch (err) {
    console.warn("Sesion inválida", err);
    localStorage.removeItem(SESSION_KEY);
  }
  if (!sessionUser || sessionUser.rol !== "instructor") {
    window.location.href = "index.html";
    return;
  }

  const instructorId = String(sessionUser.instructorId || "");
  const logoutBtn = document.getElementById("tutor-logout");
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });

  const agendaForm = document.getElementById("agenda-form");
  const agendaFechaInput = document.getElementById("agenda-fecha");
  const agendaHoraInput = document.getElementById("agenda-hora");
  const agendaSalaInput = document.getElementById("agenda-sala");
  const agendaAlumnoSelect = document.getElementById("agenda-alumno");
  const agendaWeekInput = document.getElementById("agenda-week");
  const agendaDaySelector = document.getElementById("agenda-day-selector");
  const agendaWeekBody = document.getElementById("agenda-week-body");
  const agendaPrevBtn = document.getElementById("agenda-prev-week");
  const agendaNextBtn = document.getElementById("agenda-next-week");
  const tutorSueldos = document.getElementById("tutor-sueldos");
  const formRecuperacion = document.getElementById("form-recuperacion");
  const recuperacionAlumnoSelect = document.getElementById("recuperacion-alumno");
  const recuperacionMesInput = document.getElementById("recuperacion-mes");
  const recuperacionFechaInput = document.getElementById("recuperacion-fecha");
  const recuperacionEstadoSelect = document.getElementById("recuperacion-estado");
  const recuperacionMotivoInput = document.getElementById("recuperacion-motivo");
  const recuperacionObservacionInput = document.getElementById("recuperacion-observacion");
  const recuperacionesTable = document.getElementById("tutor-recuperaciones-table");
  const tutorAsistenciasTable = document.getElementById("tutor-asistencias-table");
  const recupReprogramarModal = document.getElementById("modal-recuperacion-reprogramar");
  const recupReprogramarForm = document.getElementById("recup-reprogramar-form");
  const recupReprogramarId = document.getElementById("recup-reprogramar-id");
  const recupReprogramarAlumno = document.getElementById("recup-reprogramar-alumno");
  const recupReprogramarInstructor = document.getElementById("recup-reprogramar-instructor");
  const recupReprogramarAlumnoNombre = document.getElementById("recup-reprogramar-alumno-nombre");
  const recupReprogramarInstructorNombre = document.getElementById("recup-reprogramar-instructor-nombre");
  const recupReprogramarFecha = document.getElementById("recup-reprogramar-fecha");
  const recupReprogramarHorario = document.getElementById("recup-reprogramar-horario");
  const datosMedicosPanel = document.getElementById("datos-medicos");
  const modals = document.querySelectorAll(".modal");
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const modalCloseButtons = document.querySelectorAll("[data-close-modal]");
  const recuperacionModal = document.getElementById("modal-recuperacion");
  const datosMedicosModal = document.getElementById("modal-datos-medicos");

  const currentMonth = new Date().toISOString().slice(0, 7);
  if (recuperacionMesInput && !recuperacionMesInput.value) recuperacionMesInput.value = currentMonth;

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-active");
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.add("hidden");
    if (!document.querySelector(".modal:not(.hidden)")) {
      document.body.classList.remove("modal-active");
    }
  };

  modalTriggers.forEach((trigger) => {
    const target = document.getElementById(trigger.dataset.modalTarget || "");
    trigger.addEventListener("click", () => openModal(target));
  });

  modalCloseButtons.forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")))
  );

  modals.forEach((modal) =>
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    })
  );

  let alumnosCache = [];
  let horariosCache = [];
  let agendaCache = [];
  let agendaDiasDatos = [];
  let agendaDiaActivo = "";
  const HORARIOS_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  let recuperacionesCache = [];

  const fillAlumnoSelects = () => {
    const disponibles = alumnosCache.filter(
      (alumno) =>
        (alumno.activo || "").toString().toLowerCase() !== "no" &&
        (alumno.estado_pago || "").toString().toLowerCase() !== "rojo"
    );

    if (agendaAlumnoSelect) {
      agendaAlumnoSelect.innerHTML = `<option value="">Seleccionar</option>${disponibles
        .map(
          (alumno) =>
            `<option value="${alumno.id}">${(alumno.nombre || "")} ${(alumno.apellido || "")} · ${alumno.estado_pago ||
              "Sin datos"}</option>`
        )
        .join("")}`;
    }

    if (recuperacionAlumnoSelect) {
      const activos = alumnosCache.filter(
        (alumno) => (alumno.activo || "").toString().toLowerCase() !== "no"
      );
      recuperacionAlumnoSelect.innerHTML = `<option value="">Seleccionar</option>${activos
        .map(
          (alumno) =>
            `<option value="${alumno.id}">${(alumno.nombre || "")} ${(alumno.apellido || "")}</option>`
        )
        .join("")}`;
    }
  };

  const getWeekStringFromDate = (date) => {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayOfYear = Math.floor((date - oneJan) / 86400000) + 1;
    const week = Math.ceil(dayOfYear / 7);
    return `${year}-W${String(week).padStart(2, "0")}`;
  };

  const weekValueToDate = (weekValue) => {
    const parts = (weekValue || "").split("-W");
    if (parts.length !== 2) return new Date();
    const [year, weekStr] = parts;
    const week = Number(weekStr);
    const simple = new Date(Number(year), 0, 1 + (week - 1) * 7);
    const day = simple.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(simple);
    monday.setDate(simple.getDate() - diff);
    return monday;
  };

  const getWeekRange = (weekValue) => {
    const monday = weekValueToDate(weekValue);
    const start = new Date(monday);
    const end = new Date(monday);
    end.setDate(start.getDate() + 6);
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  };

  const changeWeek = (delta) => {
    if (!agendaWeekInput) return;
    const current = weekValueToDate(agendaWeekInput.value);
    current.setDate(current.getDate() + delta * 7);
    agendaWeekInput.value = getWeekStringFromDate(current);
    renderAgendaWeek();
  };

  const parseLocalDate = (isoDate) => {
    if (!isoDate) return null;
    const [year, month, day] = isoDate.split("-").map((value) => Number(value));
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const formatShortDate = (fecha) => {
    if (!fecha) return "—";
    const date = parseLocalDate(fecha);
    if (!date) return "—";
    return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(date);
  };

  const getDateForWeekdayNumber = (weekValue, weekdayNumber) => {
    const { start } = getWeekRange(weekValue);
    const baseDate = parseLocalDate(start);
    if (!baseDate) return "";
    baseDate.setDate(baseDate.getDate() + (weekdayNumber - 1));
    return baseDate.toISOString().slice(0, 10);
  };

  const normalizeHorarioString = (valor) =>
    (valor || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const obtenerSlotsNormalizados = (horarioTexto = "") =>
    horarioTexto
      .split("|")
      .map((fragmento) => normalizeHorarioString(fragmento))
      .filter(Boolean);

  const mapAlumnoName = (id) => {
    const alumno = alumnosCache.find((item) => item.id === id);
    return alumno ? `${alumno.nombre || ""} ${alumno.apellido || ""}`.trim() : id || "—";
  };

  const mapInstructorName = (id) => (String(id) === instructorId ? "Yo" : id || "—");

  const renderRecuperacionHorarios = () => {
    if (!recupReprogramarHorario) return;
    const disponibles = horariosCache.filter((horario) => String(horario.instructor_id || "") === instructorId);
    if (!disponibles.length) {
      recupReprogramarHorario.innerHTML = `<option value="">Sin horarios cargados para este instructor</option>`;
      recupReprogramarHorario.disabled = true;
      return;
    }
    recupReprogramarHorario.disabled = false;
    recupReprogramarHorario.innerHTML =
      `<option value="">Seleccionar horario</option>` +
      disponibles
        .map(
          (horario) =>
            `<option value="${horario.dia || ""}|${horario.hora || ""}|${horario.sala || ""}">${horario.dia || ""} · ${
              horario.hora || ""
            } · Sala ${horario.sala || "—"}</option>`
        )
        .join("");
  };

  const openRecuperacionReprogramar = (rec) => {
    if (!recupReprogramarModal || !recupReprogramarForm) return;
    recupReprogramarForm.reset();
    if (recupReprogramarId) recupReprogramarId.value = rec.recup_id || "";
    if (recupReprogramarAlumno) recupReprogramarAlumno.value = rec.alumno_id || "";
    if (recupReprogramarInstructor) recupReprogramarInstructor.value = rec.instructor_id || instructorId;
    if (recupReprogramarAlumnoNombre) recupReprogramarAlumnoNombre.value = mapAlumnoName(rec.alumno_id);
    if (recupReprogramarInstructorNombre) recupReprogramarInstructorNombre.value = mapInstructorName(rec.instructor_id);
    if (recupReprogramarFecha) {
      const hoy = new Date().toISOString().slice(0, 10);
      recupReprogramarFecha.value = rec.fecha_recupera || hoy;
    }
    renderRecuperacionHorarios();
    openModal(recupReprogramarModal);
  };

  const handleAgendaAttendanceForStudent = async (slotData, alumnoId, estado) => {
    if (!alumnoId) {
      alert("No se pudo identificar el alumno.");
      return;
    }
    const payload = {
      fecha: slotData.fecha,
      hora: slotData.hora,
      sala: slotData.sala,
      instructor_id: instructorId,
      alumno_id: alumnoId,
      plan_id: "",
      estado,
      observacion: estado === "ausente" ? "Registro desde falta" : "Asistencia confirmada",
    };
    const response = await apiPost("/.netlify/functions/asistencia-hora-create", payload);
    if (!response.ok) {
      alert(response.error || "No se pudo registrar la asistencia.");
      return;
    }
    await loadAsistenciaRecords();
    await cargarRecuperaciones();
  };

  const loadHorarios = async () => {
    const response = await apiGet("/.netlify/functions/horarios-get");
    const horarios = Array.isArray(response) ? response : response?.data || response || [];
    horariosCache = horarios.filter((h) => String(h.instructor_id || "") === instructorId);
  };

  const loadAsistenciaRecords = async () => {
    const response = await apiGet("/.netlify/functions/asistencia-hora-get");
    if (!response.ok) {
      agendaWeekBody.innerHTML = "<div class=\"empty-state\">No se pudo cargar la agenda.</div>";
      return;
    }
    const data = response.data?.asistencia || [];
    agendaCache = data.filter((item) => String(item.instructor_id || "") === instructorId);
    renderAgendaWeek();
    renderAsistenciasTable();
  };

  const renderAgendaSlotStudentRow = (bloque, alumno) => {
    const estado = (alumno.estado || "").toLowerCase();
    const statusConfig = {
      label: estado === "confirmado" ? "Presente" : estado === "ausente" ? "Ausente" : "Planificado",
      icon: estado === "confirmado" ? "check-circle" : estado === "ausente" ? "x-circle" : "circle-dashed",
      tone: estado === "confirmado" ? "ok" : estado === "ausente" ? "danger" : "neutral",
    };
    const statusHtml =
      statusConfig.label && statusConfig.label !== "Planificado"
        ? `<span class="estado-icon estado-${statusConfig.tone}" title="${statusConfig.label}">
            <i class="lucide-icon" data-lucide="${statusConfig.icon}" aria-hidden="true"></i>
          </span>`
        : "";
    const acciones =
      alumno.id && alumno.id !== "undefined"
        ? `
        <div class="agenda-slot-student-actions">
          <button class="btn icon-only primary btn-agenda-present" aria-label="Marcar presente" title="Marcar presente"
            data-fecha="${bloque.fecha}" data-hora="${bloque.hora}" data-sala="${bloque.sala}" data-alumno="${alumno.id}">
            <i class="lucide-icon" data-lucide="user-check" aria-hidden="true"></i>
          </button>
          <button class="btn icon-only danger btn-agenda-absent" aria-label="Registrar falta" title="Registrar falta"
            data-fecha="${bloque.fecha}" data-hora="${bloque.hora}" data-sala="${bloque.sala}" data-alumno="${alumno.id}">
            <i class="lucide-icon" data-lucide="user-x" aria-hidden="true"></i>
          </button>
        </div>
      `
        : "";
    return `
      <div class="agenda-slot-student">
        <div>
          <strong>${alumno.nombre || "—"}</strong>
          ${statusHtml}
          ${alumno.origen ? `<small>${alumno.origen}</small>` : ""}
        </div>
        ${acciones}
      </div>
    `;
  };

  const renderAgendaSlotCard = (bloque) => {
    const alumnosPlanificados = bloque.planificados || [];
    const alumnosAdicionales = bloque.adicionales || [];
    const alumnosCombinados = [...alumnosPlanificados, ...alumnosAdicionales];
    const alumnosHtml = alumnosCombinados.length
      ? alumnosCombinados.map((alumno) => renderAgendaSlotStudentRow(bloque, alumno)).join("")
      : `<div class="agenda-slot-empty">Sin alumnos planificados para este horario.</div>`;
    return `
      <div class="agenda-slot-card">
        <div class="agenda-slot-header">
          <div>
            <h4>${bloque.hora || "—"} · Sala ${bloque.sala || "—"}</h4>
            <p class="agenda-slot-meta">${mapInstructorName(bloque.instructor_id)}</p>
          </div>
        </div>
        <div class="agenda-slot-students">
          ${alumnosHtml}
        </div>
      </div>
    `;
  };

  const renderAgendaDaySelector = () => {
    if (!agendaDaySelector) return;
    agendaDaySelector.innerHTML = agendaDiasDatos
      .map((diaData) => {
        const active = diaData.dia === agendaDiaActivo;
        const disabled = !diaData.bloques.length;
        return `
          <button type="button" class="agenda-day-card ${active ? "active" : ""}" data-dia="${diaData.dia}" ${
          disabled ? "disabled" : ""
        }>
            <strong>${diaData.dia}</strong>
            <span>${formatShortDate(diaData.fecha)}</span>
            <small>${diaData.bloques.length ? `${diaData.bloques.length} horarios` : "Sin horarios"}</small>
          </button>
        `;
      })
      .join("");
    agendaDaySelector.querySelectorAll("[data-dia]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const dia = btn.dataset.dia;
        if (!dia || dia === agendaDiaActivo) return;
        agendaDiaActivo = dia;
        renderAgendaDaySelector();
        renderAgendaDayContent();
      });
    });
    if (window.lucide) lucide.createIcons();
  };

  const renderAgendaDayContent = () => {
    if (!agendaWeekBody) return;
    const diaData = agendaDiasDatos.find((item) => item.dia === agendaDiaActivo);
    if (!diaData) {
      agendaWeekBody.innerHTML = `<div class="empty-state">No hay datos para este día.</div>`;
      return;
    }
    if (!diaData.bloques.length) {
      agendaWeekBody.innerHTML = `<div class="empty-state">No hay horarios para ${agendaDiaActivo}.</div>`;
      return;
    }
    agendaWeekBody.innerHTML = `
      <div class="agenda-day-active">
        <h3>${agendaDiaActivo}</h3>
        <p>${formatShortDate(diaData.fecha)}</p>
      </div>
      ${diaData.bloques.map((bloque) => renderAgendaSlotCard(bloque)).join("")}
    `;
    if (window.lucide) lucide.createIcons();
    bindAgendaSlotActions();
  };

  const renderAgendaWeek = () => {
    if (!agendaWeekBody) return;
    const weekValue = agendaWeekInput?.value || getWeekStringFromDate(new Date());
    if (agendaWeekInput) agendaWeekInput.value = weekValue;

    const entriesBySlot = agendaCache.reduce((acc, registro) => {
      const key = `${registro.fecha}|${registro.hora}|${registro.sala}|${registro.instructor_id}`;
      acc[key] = acc[key] || [];
      acc[key].push(registro);
      return acc;
    }, {});

    const dayNameToNumber = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
    };

    const bloques = horariosCache
      .filter((horario) => String(horario.instructor_id || "") === instructorId)
      .map((horario) => {
        const weekdayNumber = dayNameToNumber[(horario.dia || "").toLowerCase()];
        if (!weekdayNumber) return null;
        const fecha = getDateForWeekdayNumber(weekValue, weekdayNumber);
        const key = `${fecha}|${horario.hora}|${horario.sala}|${horario.instructor_id}`;
        const salaEtiqueta = `Sala ${horario.sala || "—"}`;
        const horarioIdentifier = normalizeHorarioString(`${horario.dia || ""} ${horario.hora || ""} ${salaEtiqueta}`);
        const registros = entriesBySlot[key] || [];
        const asistenciaMap = registros.reduce((map, registro) => {
          map[registro.alumno_id] = registro;
          return map;
        }, {});
        const alumnosPlanificados = alumnosCache
          .filter(
            (alumno) =>
              String(alumno.instructor || "") === String(horario.instructor_id || "") &&
              obtenerSlotsNormalizados(alumno.horario).includes(horarioIdentifier)
          )
          .map((alumno) => ({
            id: alumno.id,
            nombre: mapAlumnoName(alumno.id),
            estado: asistenciaMap[alumno.id]?.estado,
          }));
        const extras = registros
          .filter((registro) => !alumnosPlanificados.find((al) => al.id === registro.alumno_id))
          .map((registro) => ({
            id: registro.alumno_id,
            nombre: mapAlumnoName(registro.alumno_id),
            estado: registro.estado,
            origen: "registro manual",
          }));
        return {
          ...horario,
          fecha,
          planificados: alumnosPlanificados,
          adicionales: extras,
        };
      })
      .filter(Boolean);

    agendaDiasDatos = HORARIOS_DIAS.map((dia, index) => {
      const bloquesDia = bloques.filter((bloque) => (bloque.dia || "").toLowerCase().includes(dia.toLowerCase()));
      const fecha = bloquesDia[0]?.fecha || getDateForWeekdayNumber(weekValue, index + 1);
      return {
        dia,
        fecha,
        bloques: bloquesDia,
      };
    });

    const primerDiaConDatos = agendaDiasDatos.find((item) => item.bloques.length);
    agendaDiaActivo = primerDiaConDatos?.dia || HORARIOS_DIAS[0];

    renderAgendaDaySelector();

    if (!bloques.length) {
      agendaWeekBody.innerHTML = `<div class="empty-state">No hay bloques definidos para esta semana.</div>`;
      return;
    }

    renderAgendaDayContent();
  };

  const bindAgendaSlotActions = () => {
    if (!agendaWeekBody) return;
    agendaWeekBody.querySelectorAll(".btn-agenda-present").forEach((btn) => {
      btn.addEventListener("click", () =>
        handleAgendaAttendanceForStudent(
          {
            fecha: btn.dataset.fecha,
            hora: btn.dataset.hora,
            sala: btn.dataset.sala,
          },
          btn.dataset.alumno,
          "confirmado"
        )
      );
    });
    agendaWeekBody.querySelectorAll(".btn-agenda-absent").forEach((btn) => {
      btn.addEventListener("click", () =>
        handleAgendaAttendanceForStudent(
          {
            fecha: btn.dataset.fecha,
            hora: btn.dataset.hora,
            sala: btn.dataset.sala,
          },
          btn.dataset.alumno,
          "ausente"
        )
      );
    });
  };

  const loadAlumnos = async () => {
    const response = await apiGet("/.netlify/functions/alumnos-get");
    const alumnos = Array.isArray(response) ? response : response?.data || [];
    alumnosCache = alumnos;
    fillAlumnoSelects();
  };

  const cargarAgendaInstructor = async () => {
    renderAgendaWeek();
  };

  const calcularSemana = (fecha) => {
    const day = fecha.getDate();
    return `Semana ${Math.ceil(day / 7)}`;
  };

  const agregarAlumnoAgenda = async (event) => {
    event.preventDefault();
    const payload = {
      fecha: agendaFechaInput?.value,
      hora: agendaHoraInput?.value,
      sala: agendaSalaInput?.value,
      instructor_id: instructorId,
      alumno_id: agendaAlumnoSelect?.value,
    };
    if (!payload.fecha || !payload.hora || !payload.sala || !payload.alumno_id) {
      alert("Completa la fecha, hora, sala y alumno.");
      return;
    }
    const fechaInstancia = new Date(payload.fecha);
    if (isNaN(fechaInstancia)) {
      alert("Fecha inválida.");
      return;
    }
    payload.dia_semana = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(fechaInstancia);
    payload.semana = calcularSemana(fechaInstancia);
    const response = await apiPost("/.netlify/functions/agenda-set", payload);
    if (response.ok) {
      agendaForm?.reset();
      closeModal(agendaModal);
      cargarAgendaInstructor();
    } else {
      alert(response.error || "No se pudo agregar al alumno.");
    }
  };

  const quitarAlumnoAgenda = async (agendaId) => {
    if (!agendaId) return;
    const response = await apiPost("/.netlify/functions/agenda-set", { agenda_id: agendaId, remove: true });
    if (response.ok) {
      cargarAgendaInstructor();
    } else {
      alert(response.error || "No se pudo liberar el cupo.");
    }
  };

  const cargarSueldosInstructor = async () => {
    if (!tutorSueldos) return;
    tutorSueldos.innerHTML = "<p>Cargando sueldos...</p>";
    const response = await apiGet(`/.netlify/functions/sueldos-get?instructorId=${instructorId}`);
    if (!response.ok) {
      tutorSueldos.innerHTML = `<p>${response.error || "No se pudo obtener la información."}</p>`;
      return;
    }
    const sueldos = response.data?.sueldos || [];
    if (!sueldos.length) {
      tutorSueldos.innerHTML = "<p>No hay registros mensuales aún.</p>";
      return;
    }
    tutorSueldos.innerHTML = sueldos
      .map(
        (sueldo) => `
          <div class="gasto-row">
            <div>
              <strong>${sueldo.mes}</strong>
              <br><small>Total recaudado: $${Number(sueldo.total_recaudado || 0).toFixed(2)}</small>
            </div>
            <div class="gasto-actions">
              <span>Sueldo estimado: $${Number(sueldo.sueldo_estimado || 0).toFixed(2)}</span>
              <span class="status-pill status-${(sueldo.pagado || "no").toLowerCase() === "sí" ? "pagado" : "pendiente"}">${(sueldo.pagado || "no").toUpperCase()}</span>
            </div>
          </div>
        `
      )
      .join("");
  };

  const cargarRecuperaciones = async () => {
    if (!recuperacionesTable) return;
    recuperacionesTable.innerHTML = "<p>Cargando...</p>";
    const response = await apiGet(`/.netlify/functions/recuperaciones-get?instructorId=${instructorId}`);
    if (!response.ok) {
      recuperacionesTable.innerHTML = `<p>${response.error || "No se pudo obtener las recuperaciones."}</p>`;
      return;
    }
    const registros = (response.data?.recuperaciones || []).filter((rec) =>
      (rec.motivo || "").toLowerCase().includes("falta")
    );
    recuperacionesCache = registros;
    if (!registros.length) {
      recuperacionesTable.innerHTML = "<p>No hay recuperaciones en curso.</p>";
      return;
    }
    const rows = registros
      .map((recup) => {
        const alumno = alumnosCache.find((a) => a.id === recup.alumno_id);
        const nombreAlumno = alumno ? `${alumno.nombre || ""} ${alumno.apellido || ""}` : recup.alumno_id;
        const detalleReprogramacion = (recup.observacion || "").trim() || recup.fecha_recupera || "—";
        let estado = "Pendiente";
        if (detalleReprogramacion && detalleReprogramacion !== "—") {
          estado = "Reprogramado";
        } else if (recup.estado) {
          estado = recup.estado;
        }
        const puedeReprogramar = estado.toLowerCase().includes("pendiente");
        const accion = puedeReprogramar
          ? `<button class="btn small secondary" data-recup-reprogramar="${recup.recup_id}">Reprogramar</button>`
          : "—";
        return `
          <tr>
            <td data-label="Alumno">${nombreAlumno}</td>
            <td data-label="Motivo">${recup.motivo || "—"}</td>
            <td data-label="Estado">${estado}</td>
            <td data-label="Reprogramación">${detalleReprogramacion}</td>
            <td data-label="Acciones">${accion}</td>
          </tr>
        `;
      })
      .join("");
    recuperacionesTable.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Reprogramación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
    recuperacionesTable.querySelectorAll("[data-recup-reprogramar]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const recId = btn.dataset.recupReprogramar;
        const rec = recuperacionesCache.find((item) => item.recup_id === recId);
        if (rec) openRecuperacionReprogramar(rec);
      });
    });
  };

  const renderAsistenciasTable = () => {
    if (!tutorAsistenciasTable) return;
    if (!agendaCache.length) {
      tutorAsistenciasTable.innerHTML = "<p>No hay asistencias registradas.</p>";
      return;
    }
    const rows = [...agendaCache]
      .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
      .map((asis) => {
        const alumno = mapAlumnoName(asis.alumno_id);
        const estadoLower = (asis.estado || "").toLowerCase();
        const estado =
          estadoLower === "confirmado" ? "Presente" : estadoLower === "ausente" ? "Ausente" : asis.estado || "—";
        return `
          <tr>
            <td data-label="Alumno">${alumno}</td>
            <td data-label="Fecha">${asis.fecha || "—"}</td>
            <td data-label="Hora">${asis.hora || "—"}</td>
            <td data-label="Sala">${asis.sala || "—"}</td>
            <td data-label="Estado">${estado}</td>
          </tr>
        `;
      })
      .join("");
    tutorAsistenciasTable.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Sala</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };

  recupReprogramarForm?.addEventListener("submit", async (event) => {
    event?.preventDefault();
    if (!recupReprogramarId || !recupReprogramarAlumno) return;
    const fecha = recupReprogramarFecha?.value;
    const horarioValue = recupReprogramarHorario?.value || "";
    if (!fecha || !horarioValue) {
      alert("Elegí fecha y horario para la reprogramación.");
      return;
    }
    const [dia, hora, sala] = horarioValue.split("|");
    const agendaPayload = {
      fecha,
      hora,
      sala,
      instructor_id: instructorId,
      alumno_id: recupReprogramarAlumno.value,
    };
    const agendaResponse = await apiPost("/.netlify/functions/agenda-set", agendaPayload);
    if (!agendaResponse.ok) {
      alert(agendaResponse.error || "No se pudo reprogramar la clase.");
      return;
    }
    const observacion = `${dia || ""} ${fecha} · ${hora || ""}`;
    const recResponse = await apiPost("/.netlify/functions/recuperaciones-update", {
      recup_id: recupReprogramarId.value,
      estado: "Reprogramado",
      fecha_recupera: fecha,
      observacion,
    });
    if (!recResponse.ok) {
      alert(recResponse.error || "No se pudo actualizar la recuperación.");
      return;
    }
    await loadAsistenciaRecords();
    await cargarRecuperaciones();
    closeModal(recupReprogramarModal);
  });

  const actualizarRecuperacion = async (recupId, estado) => {
    const response = await apiPost("/.netlify/functions/recuperaciones-update", {
      recup_id: recupId,
      estado,
    });
    if (response.ok) {
      cargarRecuperaciones();
    } else {
      alert(response.error || "No se pudo actualizar el estado.");
    }
  };

  const handleRecuperacionSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      alumno_id: recuperacionAlumnoSelect?.value,
      instructor_id: instructorId,
      mes: recuperacionMesInput?.value,
      fecha_recupera: recuperacionFechaInput?.value,
      motivo: recuperacionMotivoInput?.value,
      estado: recuperacionEstadoSelect?.value,
      observacion: recuperacionObservacionInput?.value,
    };
    if (!payload.alumno_id || !payload.mes || !payload.fecha_recupera || !payload.motivo) {
      alert("Completá alumno, mes, fecha y motivo.");
      return;
    }
    const response = await apiPost("/.netlify/functions/recuperaciones-create", payload);
    if (response.ok) {
      formRecuperacion?.reset();
      if (recuperacionMesInput) recuperacionMesInput.value = currentMonth;
      closeModal(recuperacionModal);
      cargarRecuperaciones();
    } else {
      alert(response.error || "No se pudo crear la recuperación.");
    }
  };

  const verDatosMedicos = (alumnoId) => {
    if (!datosMedicosPanel) return;
    const alumno = alumnosCache.find((item) => item.id === alumnoId);
    if (!alumno) {
      datosMedicosPanel.innerHTML = "<p>Alumno no encontrado.</p>";
      openModal(datosMedicosModal);
      return;
    }
    datosMedicosPanel.innerHTML = `
      <p><strong>DNI:</strong> ${alumno.dni || "—"}</p>
      <p><strong>Fecha de nacimiento:</strong> ${alumno.fecha_nacimiento || "—"}</p>
      <p><strong>Derivado médico:</strong> ${alumno.derivado_medico || "—"}</p>
      <p><strong>Patologías:</strong> ${alumno.patologia_cirugia || "—"}</p>
      <p><strong>Tipo:</strong> ${alumno.patologia_tipo || "—"}</p>
      <p><strong>Observación:</strong> ${alumno.observacion || "—"}</p>
    `;
    openModal(datosMedicosModal);
  };

  agendaWeekInput?.addEventListener("change", renderAgendaWeek);
  agendaPrevBtn?.addEventListener("click", () => changeWeek(-1));
  agendaNextBtn?.addEventListener("click", () => changeWeek(1));
  agendaForm?.addEventListener("submit", agregarAlumnoAgenda);
  formRecuperacion?.addEventListener("submit", handleRecuperacionSubmit);

  await Promise.all([loadHorarios(), loadAlumnos()]);
  await Promise.all([loadAsistenciaRecords(), cargarSueldosInstructor(), cargarRecuperaciones()]);
  if (agendaWeekInput && !agendaWeekInput.value) {
    agendaWeekInput.value = getWeekStringFromDate(new Date());
  }
});
