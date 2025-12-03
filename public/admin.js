document.addEventListener("DOMContentLoaded", () => {
  let tableLabelTimer = null;
  const setTableDataLabels = () => {
    document.querySelectorAll(".admin-table").forEach((table) => {
      const headers = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent.trim());
      table.querySelectorAll("tbody tr").forEach((row) => {
        row.querySelectorAll("td").forEach((td, idx) => {
          if (headers[idx]) td.setAttribute("data-label", headers[idx]);
        });
      });
    });
  };

  const tableLabelObserver = new MutationObserver(() => {
    clearTimeout(tableLabelTimer);
    tableLabelTimer = setTimeout(setTableDataLabels, 50);
  });
  tableLabelObserver.observe(document.body, { childList: true, subtree: true });
  setTableDataLabels();

  const SESSION_KEY = "landingPilatesSession";
  let sessionUser = null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    sessionUser = stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Sesion inválida", err);
    localStorage.removeItem(SESSION_KEY);
  }
  if (!sessionUser || sessionUser.rol !== "dueno") {
    window.location.href = "index.html";
    return;
  }

  const logoutButton = document.getElementById("admin-exit");
  logoutButton?.addEventListener("click", () => localStorage.removeItem(SESSION_KEY));

  const modals = document.querySelectorAll(".modal");
  const modalTargets = document.querySelectorAll("[data-modal-target]");
  const closeButtons = document.querySelectorAll("[data-close-modal]");
  const tabButtons = document.querySelectorAll(".tab-button");

  const listAlumnos = document.getElementById("list-alumnos");
  const listInstructores = document.getElementById("list-instructores");
  const listHorarios = document.getElementById("list-horarios");

  const reloadAlumnosBtn = document.getElementById("reload-alumnos");
  const reloadInstructoresBtn = document.getElementById("reload-instructores");
  const reloadHorariosBtn = document.getElementById("reload-horarios");

  const formAlumno = document.getElementById("form-alumno");
  const formInstructor = document.getElementById("form-instructor");
  const formHorario = document.getElementById("form-horario");

  const msgAlumnos = document.getElementById("msg-alumnos");
  const msgInstructores = document.getElementById("msg-instructores");
  const msgHorarios = document.getElementById("msg-horarios");

  const alumnoIdInput = document.getElementById("alumno-id");
  const instructorIdInput = document.getElementById("instructor-id");
  const horarioIdInput = document.getElementById("horario-id");
  const horarioInstructorSelect = document.getElementById("horario-instructor-select");
  const modalSelectDelete = document.getElementById("modal-select-delete");
  const modalConfirmDelete = document.getElementById("modal-confirm-delete");
  const deleteList = document.getElementById("delete-list");
  const deleteTitle = document.getElementById("delete-title");
  const deleteInfo = document.getElementById("delete-info");
  const cancelSelectDeleteBtn = document.getElementById("cancel-select-delete");
  const finalDeleteBtn = document.getElementById("btn-confirm-delete");
  const planSelect = document.getElementById("control-plan");
  const planHint = document.getElementById("plan-hint");
  const controlForm = document.getElementById("control-alumno-form");
  const controlAlumnoSelect = document.getElementById("control-alumno");
  const controlInstructorSelect = document.getElementById("control-instructor");
  const controlHorarioInput = document.getElementById("control-horario");
  const controlHorarioSelectorBtn = document.getElementById("control-horario-selector");
  const controlHorarioOpcionesList = document.getElementById("control-horario-opciones");
  const controlHorarioResumenList = document.getElementById("control-horario-resumen");
  const controlHorarioHint = document.getElementById("control-horario-hint");
  const controlPagoFecha = document.getElementById("control-pago-fecha");
  const controlPagoMes = document.getElementById("control-pago-mes");
  const controlPagoMesDisplay = document.getElementById("control-pago-mes-display");
  const controlPagoMonto = document.getElementById("control-pago-monto");
  const controlPlanMontoDisplay = document.getElementById("control-plan-monto");
  const controlPagoMedio = document.getElementById("control-pago-medio");
  const controlPagoObservacion = document.getElementById("control-pago-observacion");
  const controlPagoTable = document.getElementById("pago-list");
  const controlPagoMesFilter = document.getElementById("pago-mes-filter");
  const weekInput = document.getElementById("agenda-week");
  const agendaWeekBody = document.getElementById("agenda-week-body");
  const agendaDaySelector = document.getElementById("agenda-day-selector");
  const agendaPrevBtn = document.getElementById("agenda-prev-week");
  const agendaNextBtn = document.getElementById("agenda-next-week");
  const agendaWeekForm = document.getElementById("agenda-control-form");
  const agendaControlId = document.getElementById("agenda-control-id");
  const agendaControlFecha = document.getElementById("agenda-control-fecha");
  const agendaControlHora = document.getElementById("agenda-control-hora");
  const agendaControlSala = document.getElementById("agenda-control-sala");
  const agendaControlInstructor = document.getElementById("agenda-control-instructor");
  const agendaControlDelete = document.getElementById("agenda-control-delete");
  const recupReprogramarModal = document.getElementById("modal-recuperacion-reprogramar");
  const recupReprogramarForm = document.getElementById("recup-reprogramar-form");
  const recupReprogramarId = document.getElementById("recup-reprogramar-id");
  const recupReprogramarAlumno = document.getElementById("recup-reprogramar-alumno");
  const recupReprogramarInstructor = document.getElementById("recup-reprogramar-instructor");
  const recupReprogramarAlumnoNombre = document.getElementById("recup-reprogramar-alumno-nombre");
  const recupReprogramarInstructorNombre = document.getElementById("recup-reprogramar-instructor-nombre");
  const recupReprogramarFecha = document.getElementById("recup-reprogramar-fecha");
  const recupReprogramarHorario = document.getElementById("recup-reprogramar-horario");
  const planForm = document.getElementById("plan-form");
  const planIdInput = document.getElementById("plan-id");
  const planNombreInput = document.getElementById("plan-nombre");
  const planSesionesInput = document.getElementById("plan-sesiones");
  const planPrecioInput = document.getElementById("plan-precio");
  const planFrecuenciaInput = document.getElementById("plan-frecuencia");
  const planActivoInput = document.getElementById("plan-activo");
  const planResetButton = document.getElementById("plan-reset");
  const planTableBody = document.getElementById("planes-table-body");
  const planRefreshBtn = document.getElementById("btn-refresh-planes");
  const recuperacionesHistoryEl = document.getElementById("recuperaciones-history");
  const asistenciasHistoryEl = document.getElementById("asistencias-history");
  const btnVerAsistencias = document.getElementById("btn-ver-asistencias");
  const btnVerRecuperaciones = document.getElementById("btn-ver-recuperaciones");

  const moraList = document.getElementById("mora-list");
  const mesRecaudacionInput = document.getElementById("mes-recaudacion");
  const btnRecaudacion = document.getElementById("btn-recaudacion");
  const recaudacionBody = document.getElementById("recaudacion-body");
  const totalRecaudacion = document.getElementById("total-recaudacion");
  const gastosListEl = document.getElementById("gastos-list");
  const formGastoEl = document.getElementById("form-gasto");
  const gastoIdInput = document.getElementById("gasto-id");
  const gastoFecha = document.getElementById("gasto-fecha");
  const gastoCategoria = document.getElementById("gasto-categoria");
  const gastoDescripcion = document.getElementById("gasto-descripcion");
  const gastoMonto = document.getElementById("gasto-monto");
  const gastoMedio = document.getElementById("gasto-medio");
  const gastoComprobante = document.getElementById("gasto-comprobante");
  const gastoObservacion = document.getElementById("gasto-observacion");
  const gastoResetBtn = document.getElementById("btn-gasto-reset");
  const mesSueldosInput = document.getElementById("mes-sueldos");
  const btnCalcularSueldos = document.getElementById("btn-calcular-sueldos");
  const btnCargarSueldos = document.getElementById("btn-cargar-sueldos");
  const sueldosListEl = document.getElementById("lista-sueldos");
  const btnRefrescarPagos = document.getElementById("btn-refrescar-pagos");
  const modalControlAlumno = document.getElementById("modal-control-alumno");
  const modalPlan = document.getElementById("modal-plan");
  const modalGasto = document.getElementById("modal-gasto");
  const modalAgendaControl = document.getElementById("modal-agenda-control");
  const modalHorario = document.getElementById("modal-horario");
  const modalHorariosDia = document.getElementById("modal-horarios-dia");
  const modalHorariosDiaTitle = document.getElementById("modal-horarios-dia-title");
  const horariosDiaContent = document.getElementById("horarios-dia-content");
  const modalRecaudacion = document.getElementById("modal-recaudacion");
  const modalSueldos = document.getElementById("modal-sueldos");
  const modalAlumnoAlDia = document.getElementById("modal-alumno-aldia");
  const modalAlumnoAlDiaMsg = document.getElementById("modal-alumno-aldia-msg");
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (mesRecaudacionInput && !mesRecaudacionInput.value) {
    mesRecaudacionInput.value = currentMonth;
  }
  if (mesSueldosInput && !mesSueldosInput.value) {
    mesSueldosInput.value = currentMonth;
  }
  if (controlPagoMes && !controlPagoMes.value) {
    controlPagoMes.value = currentMonth;
    if (controlPagoMesDisplay) controlPagoMesDisplay.textContent = currentMonth;
  }
  if (controlPagoMesFilter && !controlPagoMesFilter.value) {
    controlPagoMesFilter.value = currentMonth;
  }

  let alumnosCache = [];
  let instructoresCache = [];
  let horariosCache = [];
  let editingAlumnoId = null;
  let editingInstructorId = null;
  let editingHorarioId = null;
  let deleteType = null;
  let deleteTarget = null;
  let gastosCache = [];
  let planesCache = [];
  let agendaCache = [];
  let recuperacionesCache = [];
  let horariosPorDia = {};
  let horarioModalDiaActivo = null;
  let pagosPorMesCache = {};
  let controlFormLocked = false;
  let agendaDiasDatos = [];
  let agendaDiaActivo = "";
  let maxHorariosSeleccionables = 1;
  let horariosSeleccionadosSet = new Set();
  let instructorFiltroActual = "";
  let horariosFiltrados = [];
  const HORARIOS_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const normalizarDia = (valor) => {
    if (!valor) return null;
    const limpio = valor
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const mapa = {
      lunes: "Lunes",
      martes: "Martes",
      miercoles: "Miércoles",
      miércoles: "Miércoles",
      jueves: "Jueves",
      viernes: "Viernes",
    };
    return mapa[limpio] || null;
  };
  const getHorarioById = (horarioId) =>
    horariosCache.find((item) => String(item.id || "") === String(horarioId || ""));

  controlHorarioSelectorBtn?.addEventListener("click", () => {
    if (!planSelect?.value) {
      alert("Elegí un plan antes de ver los horarios.");
      return;
    }
    if (!instructorFiltroActual) {
      alert("Seleccioná un instructor para ver sus horarios.");
      return;
    }
    controlHorarioOpcionesList?.classList.toggle("hidden");
    if (!controlHorarioOpcionesList?.classList.contains("hidden")) {
      renderControlHorarioOpciones();
    }
  });

  const apiGet = async (path) => (await fetch(path)).json();
  const apiPost = async (path, data) =>
    (await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })).json();

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  document.querySelectorAll(".admin-subtabs").forEach((subtabGroup) => {
    const buttons = subtabGroup.querySelectorAll(".subtab-button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.subtab;
        const parentPanel = subtabGroup.closest(".tab-panel");
        if (!parentPanel) return;
        buttons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        parentPanel.querySelectorAll(".subtab-content").forEach((content) => content.classList.remove("active"));
        const targetContent = parentPanel.querySelector(`#${targetId}`);
        targetContent?.classList.add("active");
      });
    });
  });

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

  modalTargets.forEach((trigger) => {
    const target = document.getElementById(trigger.dataset.modalTarget);
    trigger.addEventListener("click", () => openModal(target));
  });

  document.querySelectorAll("[data-modal-target=\"modal-alumno\"]").forEach((btn) =>
    btn.addEventListener("click", () => resetAlumnoForm())
  );
  document.querySelectorAll("[data-modal-target=\"modal-instructor\"]").forEach((btn) =>
    btn.addEventListener("click", () => resetInstructorForm())
  );
  document.querySelectorAll("[data-modal-target=\"modal-horario\"]").forEach((btn) =>
    btn.addEventListener("click", () => resetHorarioForm())
  );
  document.querySelectorAll("[data-modal-target=\"modal-control-alumno\"]").forEach((btn) =>
    btn.addEventListener("click", () => {
      controlForm?.reset();
    })
  );
  document.querySelectorAll("[data-modal-target=\"modal-plan\"]").forEach((btn) =>
    btn.addEventListener("click", () => resetPlanForm())
  );
  document.querySelectorAll("[data-modal-target=\"modal-gasto\"]").forEach((btn) =>
    btn.addEventListener("click", () => resetGastoForm())
  );
  document.querySelectorAll("[data-modal-target=\"modal-agenda-control\"]").forEach((btn) =>
    btn.addEventListener("click", () => {
      agendaWeekForm?.reset();
      if (agendaControlId) agendaControlId.value = "";
    })
  );

  closeButtons.forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")))
  );

  modals.forEach((modal) =>
    modal.addEventListener("click", (event) => event.target === modal && closeModal(modal))
  );

  if (modalHorario) {
    modalHorario.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (horarioModalDiaActivo) {
          const dia = horarioModalDiaActivo;
          horarioModalDiaActivo = null;
          delete modalHorario.dataset.fromDay;
          setTimeout(() => mostrarHorariosDia(dia), 120);
        }
      });
    });
    modalHorario.addEventListener("click", (event) => {
      if (event.target === modalHorario && horarioModalDiaActivo) {
        const dia = horarioModalDiaActivo;
        horarioModalDiaActivo = null;
        delete modalHorario.dataset.fromDay;
        setTimeout(() => mostrarHorariosDia(dia), 120);
      }
    });
  }

  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  const renderEstadoPago = (estado) => {
    const map = {
      Verde: "pagado",
      Amarillo: "pendiente",
      Rojo: "vencido",
      "Sin datos": "neutral",
      "Fecha inválida": "neutral",
    };
    const iconMap = {
      Verde: "smile",
      Amarillo: "annoyed",
      Rojo: "angry",
      "Sin datos": "help-circle",
      "Fecha inválida": "help-circle",
    };
    const clase = map[estado] || "neutral";
    const icon = iconMap[estado] || "help-circle";
    return `
      <span class="status-pill status-${clase}" title="${estado}">
        <i class="lucide-icon" data-lucide="${icon}" aria-hidden="true"></i>
        <span class="sr-only">${estado}</span>
      </span>
    `;
  };

  const getMaxSesionesPorSemana = (plan) => {
    if (!plan) return 1;
    const sesiones = Number(plan.sesiones || 0);
    if (!sesiones) return 1;
    return Math.max(1, Math.floor(sesiones / 4));
  };

  const updateControlHorarioHidden = () => {
    if (controlHorarioInput) {
      controlHorarioInput.value = Array.from(horariosSeleccionadosSet).join(",");
    }
  };

  const updateControlHorarioHint = (customMessage) => {
    if (!controlHorarioHint) return;
    if (customMessage) {
      controlHorarioHint.textContent = customMessage;
      return;
    }
    if (!planSelect?.value) {
      controlHorarioHint.textContent = "Elegí un plan para conocer los límites semanales.";
      return;
    }
    if (!instructorFiltroActual) {
      controlHorarioHint.textContent = "Seleccioná un instructor para ver sus horarios disponibles.";
      return;
    }
    controlHorarioHint.textContent = `Podés elegir hasta ${maxHorariosSeleccionables} horarios por semana. (${horariosSeleccionadosSet.size}/${maxHorariosSeleccionables})`;
  };

  const invalidatePagosCache = (mes) => {
    if (!mes) return;
    delete pagosPorMesCache[mes];
  };

  const obtenerPagosPorMes = async (mes, { force = false } = {}) => {
    if (!mes) return [];
    if (!force && pagosPorMesCache[mes]) return pagosPorMesCache[mes];
    const response = await apiGet(`/.netlify/functions/pagos-get?mes=${mes}`);
    if (!response.ok) {
      throw new Error(response.error || "No se pudieron cargar los pagos.");
    }
    const pagos = response.data?.pagos || [];
    pagosPorMesCache[mes] = pagos;
    return pagos;
  };

  const setControlFormLockState = (locked) => {
    if (!controlForm) return;
    controlFormLocked = locked;
    const lockTargets = [
      planSelect,
      controlInstructorSelect,
      controlHorarioSelectorBtn,
      controlPagoFecha,
      controlPagoMedio,
      controlPagoObservacion,
      controlPagoMonto,
    ];
    lockTargets.forEach((el) => {
      if (el) el.disabled = locked;
    });
    controlForm
      .querySelectorAll('button[type="submit"], button[type="reset"]')
      .forEach((btn) => (btn.disabled = locked));
  };

  const verificarAlumnoAlDia = async () => {
    if (!controlAlumnoSelect) return;
    const alumnoId = controlAlumnoSelect.value;
    if (!alumnoId) {
      setControlFormLockState(false);
      return;
    }
    const mes = controlPagoMes?.value || controlPagoFecha?.value?.slice(0, 7);
    if (!mes) {
      setControlFormLockState(false);
      return;
    }
    try {
      const pagos = await obtenerPagosPorMes(mes);
      const pagoRegistrado = pagos.find((pago) => String(pago.alumno_id || "") === String(alumnoId));
      if (pagoRegistrado) {
        setControlFormLockState(true);
        if (modalAlumnoAlDia && modalAlumnoAlDiaMsg) {
          modalAlumnoAlDiaMsg.textContent = `${mapAlumnoName(alumnoId)} ya registró el pago correspondiente a ${mes}.`;
          openModal(modalAlumnoAlDia);
        }
        return;
      }
      setControlFormLockState(false);
    } catch (error) {
      console.warn("No se pudo verificar el estado de pagos del alumno.", error);
      setControlFormLockState(false);
    }
  };

  const renderControlHorarioOpciones = () => {
    if (!controlHorarioOpcionesList) return;
    if (!planSelect?.value) {
      controlHorarioOpcionesList.innerHTML = `<li><div class="empty-state">Elegí un plan para ver horarios.</div></li>`;
      return;
    }
    if (!instructorFiltroActual) {
      controlHorarioOpcionesList.innerHTML = `<li><div class="empty-state">Seleccioná un instructor para ver sus horarios.</div></li>`;
      return;
    }
    if (!horariosFiltrados.length) {
      controlHorarioOpcionesList.innerHTML = `<li><div class="empty-state">No hay horarios cargados para este instructor.</div></li>`;
      return;
    }
    controlHorarioOpcionesList.innerHTML = horariosFiltrados
      .map((horario) => {
        const slotId = String(horario.id || "");
        const selected = horariosSeleccionadosSet.has(slotId);
        const disabled = !selected && horariosSeleccionadosSet.size >= maxHorariosSeleccionables;
        return `
          <li>
            <div class="horario-option__info">
              <strong>${horario.dia || "—"} · ${horario.hora || "—"}</strong>
              <span>Sala ${horario.sala || "—"} · ${horario.capacidad ? `Cupo ${horario.capacidad}` : "Capacidad sin definir"}</span>
              <span>${mapInstructorName(horario.instructor_id)}</span>
            </div>
            <button type="button" class="btn small ${selected ? "ghost" : "primary"}" data-toggle-slot="${slotId}" ${disabled ? "disabled" : ""}>
              <i class="lucide-icon" data-lucide="${selected ? "minus" : "plus"}" aria-hidden="true"></i>
              ${selected ? "Quitar" : "Agregar"}
            </button>
          </li>
        `;
      })
      .join("");
    controlHorarioOpcionesList.querySelectorAll("[data-toggle-slot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotId = btn.dataset.toggleSlot;
        if (!slotId) return;
        if (toggleHorarioSeleccion(slotId)) {
          renderControlHorarioOpciones();
        }
      });
    });
    refreshIcons();
  };

  const renderControlHorarioResumen = () => {
    if (!controlHorarioResumenList) return;
    if (!planSelect?.value || !instructorFiltroActual) {
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Seleccioná plan e instructor para habilitar los horarios.</div></li>`;
      return;
    }
    if (!horariosSeleccionadosSet.size) {
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Elegí horarios para que aparezcan acá antes de confirmar.</div></li>`;
      return;
    }
    const seleccionados = Array.from(horariosSeleccionadosSet)
      .map((slotId) => getHorarioById(slotId))
      .filter(Boolean);
    if (!seleccionados.length) {
      horariosSeleccionadosSet = new Set();
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Los horarios seleccionados ya no están disponibles. Volvé a elegirlos.</div></li>`;
      updateControlHorarioHidden();
      updateControlHorarioHint();
      return;
    }
    controlHorarioResumenList.innerHTML = seleccionados
      .map(
        (horario) => `
        <li>
          <div class="slot-info">
            <strong>${horario.dia || "—"} · ${horario.hora || "—"}</strong>
            <span>Sala ${horario.sala || "—"} · ${horario.capacidad ? `Cupo ${horario.capacidad}` : "Capacidad sin definir"}</span>
          </div>
          <button type="button" class="btn ghost small" data-remove-slot="${horario.id}">
            <i class="lucide-icon" data-lucide="x" aria-hidden="true"></i>
            Quitar
          </button>
        </li>
      `
      )
      .join("");
    controlHorarioResumenList.querySelectorAll("[data-remove-slot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotId = btn.dataset.removeSlot;
        horariosSeleccionadosSet.delete(slotId);
        refreshControlHorarioSelectionUI();
      });
    });
    refreshIcons();
  };

  const refreshControlHorarioSelectionUI = () => {
    updateControlHorarioHidden();
    renderControlHorarioResumen();
    renderControlHorarioOpciones();
    updateControlHorarioHint();
  };

  const limpiarSeleccionHorarios = (reiniciarUi = false) => {
    horariosSeleccionadosSet = new Set();
    updateControlHorarioHidden();
    if (reiniciarUi) {
      horariosFiltrados = [];
      controlHorarioOpcionesList?.classList.add("hidden");
      if (controlHorarioOpcionesList) controlHorarioOpcionesList.innerHTML = "";
      if (controlHorarioResumenList) {
        controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Seleccioná plan e instructor para ver horarios.</div></li>`;
      }
    }
    refreshControlHorarioSelectionUI();
  };
  renderControlHorarioResumen();


  const toggleHorarioSeleccion = (slotId) => {
    const normalizedId = String(slotId || "");
    if (!normalizedId) return false;
    if (!planSelect?.value) {
      alert("Seleccioná un plan para definir cuántos horarios podés elegir.");
      return false;
    }
    if (!instructorFiltroActual) {
      alert("Seleccioná un instructor antes de elegir horarios.");
      return false;
    }
    if (horariosSeleccionadosSet.has(normalizedId)) {
      horariosSeleccionadosSet.delete(normalizedId);
      refreshControlHorarioSelectionUI();
      return true;
    }
    if (horariosSeleccionadosSet.size >= maxHorariosSeleccionables) {
      alert(`Podés elegir hasta ${maxHorariosSeleccionables} horarios por semana.`);
      return false;
    }
    horariosSeleccionadosSet.add(normalizedId);
    refreshControlHorarioSelectionUI();
    return true;
  };

  const getInstructorById = (id) => instructoresCache.find((inst) => inst.id === id);

  const actualizarOpcionesPlanes = () => {
    if (!planSelect) return;
    const opciones = planesCache
      .map((plan) => {
        const sesiones = plan.sesiones || "0";
        const precio = plan.precio ? `$${Number(plan.precio).toLocaleString()}` : "Consultar";
        return `<option value="${plan.plan_id}" data-precio="${plan.precio}">${plan.nombre} · ${sesiones} sesiones · ${precio}</option>`;
      })
      .join("");
    planSelect.innerHTML = `<option value="">Seleccionar plan</option>${opciones}`;
  };

  const actualizarSelectControlAlumnos = () => {
    if (!controlAlumnoSelect || !Array.isArray(alumnosCache)) return;
    controlAlumnoSelect.innerHTML =
      `<option value="">Seleccionar alumno</option>` +
      alumnosCache
        .map((alumno) => `<option value="${alumno.id}">${alumno.nombre} ${alumno.apellido}</option>`)
        .join("");
  };

  const actualizarSelectControlInstructores = () => {
    if (!controlInstructorSelect || !Array.isArray(instructoresCache)) return;
    controlInstructorSelect.innerHTML =
      `<option value="">Seleccionar instructor</option>` +
      instructoresCache
        .map((inst) => `<option value="${inst.id}">${inst.nombre}</option>`)
        .join("");
  };

  const actualizarSelectControlHorarios = (instructorId = "") => {
    instructorFiltroActual = instructorId || "";
    horariosSeleccionadosSet = new Set();
    updateControlHorarioHidden();
    if (!controlHorarioOpcionesList || !controlHorarioResumenList) return;
    controlHorarioOpcionesList.classList.add("hidden");
    if (!planSelect?.value) {
      horariosFiltrados = [];
      if (controlHorarioOpcionesList) controlHorarioOpcionesList.innerHTML = "";
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Seleccioná un plan para habilitar los horarios.</div></li>`;
      controlHorarioOpcionesList?.classList.add("hidden");
      updateControlHorarioHint();
      return;
    }
    if (!instructorFiltroActual) {
      horariosFiltrados = [];
      if (controlHorarioOpcionesList) controlHorarioOpcionesList.innerHTML = "";
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Seleccioná un instructor para ver los horarios.</div></li>`;
      controlHorarioOpcionesList?.classList.add("hidden");
      updateControlHorarioHint();
      return;
    }
    const disponibles = horariosCache.filter(
      (horario) => String(horario.instructor_id || "") === instructorFiltroActual
    );
    if (!disponibles.length) {
      horariosFiltrados = [];
      if (controlHorarioOpcionesList) controlHorarioOpcionesList.innerHTML = "";
      controlHorarioResumenList.innerHTML = `<li><div class="empty-state">Sin horarios cargados para este instructor.</div></li>`;
      controlHorarioOpcionesList?.classList.add("hidden");
      updateControlHorarioHint("No hay horarios configurados para este instructor.");
      return;
    }
    horariosFiltrados = disponibles;
    renderControlHorarioOpciones();
    renderControlHorarioResumen();
    updateControlHorarioHint();
  };

  const actualizarControlSelects = () => {
    actualizarSelectControlAlumnos();
    actualizarSelectControlInstructores();
    actualizarSelectControlHorarios(controlInstructorSelect?.value || "");
    if (agendaControlInstructor && Array.isArray(instructoresCache)) {
      agendaControlInstructor.innerHTML =
        `<option value="">Seleccionar instructor</option>` +
        instructoresCache.map((inst) => `<option value="${inst.id}">${inst.nombre}</option>`).join("");
    }
  };

  const cargarPlanes = async () => {
    const response = await apiGet("/.netlify/functions/planes-get");
    if (!response.ok) {
      return;
    }
    planesCache = response.data?.planes || [];
    actualizarOpcionesPlanes();
    planSelect?.dispatchEvent(new Event("change"));
    renderPlanesTable();
  };

  const resetPlanForm = () => {
    if (!planForm) return;
    planForm.reset();
    if (planIdInput) planIdInput.value = "";
  };

  const fillPlanForm = (plan) => {
    if (!plan) return;
    planIdInput.value = plan.plan_id || "";
    planNombreInput.value = plan.nombre || "";
    planSesionesInput.value = plan.sesiones || "";
    planPrecioInput.value = plan.precio || "";
    planFrecuenciaInput.value = plan.frecuencia || "";
    planActivoInput.value = plan.activo || "sí";
  };

  const renderPlanesTable = () => {
    if (!planTableBody) return;
    if (!planesCache.length) {
      planTableBody.innerHTML = "<tr><td colspan='6'>No hay planes registrados.</td></tr>";
      return;
    }
    planTableBody.innerHTML = planesCache
      .map(
        (plan) => `
          <tr>
            <td>${plan.nombre || "—"}</td>
            <td>${plan.sesiones || "—"}</td>
            <td>${plan.precio ? `$${Number(plan.precio).toLocaleString()}` : "—"}</td>
            <td>${plan.frecuencia || "—"}</td>
            <td>${(plan.activo || "no").toLowerCase() === "sí" ? "Sí" : "No"}</td>
            <td>
              <button class="btn icon-only ghost small btn-plan-edit" data-plan="${plan.plan_id}" aria-label="Editar plan">
                <i class="lucide-icon" data-lucide="pencil" aria-hidden="true"></i>
              </button>
              <button class="btn icon-only danger small" data-plan-delete="${plan.plan_id}" aria-label="Eliminar plan">
                <i class="lucide-icon" data-lucide="trash-2" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        `
      )
      .join("");
    planTableBody.querySelectorAll("[data-plan]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const planId = btn.dataset.plan;
        const plan = planesCache.find((item) => item.plan_id === planId);
        fillPlanForm(plan);
        planIdInput.value = planId;
        planNombreInput.focus();
        openModal(modalPlan);
      });
    });
    planTableBody.querySelectorAll("[data-plan-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const planId = btn.dataset.planDelete;
        const confirmacion = confirm("¿Eliminar ese plan?");
        if (!confirmacion) return;
        const response = await apiPost("/.netlify/functions/planes-delete", { plan_id: planId });
        if (response.ok) {
          await cargarPlanes();
        } else {
          alert(response.error || "No se pudo eliminar el plan.");
        }
      });
    });
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
    if (!weekInput) return;
    const current = weekValueToDate(weekInput.value);
    current.setDate(current.getDate() + delta * 7);
    weekInput.value = getWeekStringFromDate(current);
    renderAgendaWeek();
  };

  const parseLocalDate = (isoDate) => {
    if (!isoDate) return null;
    const [year, month, day] = isoDate.split("-").map((value) => Number(value));
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const formatDayName = (fecha) => {
    if (!fecha) return "—";
    const date = parseLocalDate(fecha);
    if (!date) return "—";
    return new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
  };

  const formatShortDate = (fecha) => {
    if (!fecha) return "—";
    const date = parseLocalDate(fecha);
    if (!date) return "—";
    return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(date);
  };

  const formatFullDate = (fecha) => {
    if (!fecha) return "—";
    const date = parseLocalDate(fecha);
    if (!date) return "—";
    return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(date);
  };

  const fillAgendaControl = (registro) => {
    if (!agendaControlFecha || !agendaControlHora || !agendaControlSala || !agendaControlInstructor) return;
    agendaControlId.value = registro.agenda_id;
    agendaControlFecha.value = registro.fecha;
    agendaControlHora.value = registro.hora;
    agendaControlSala.value = registro.sala;
    agendaControlInstructor.value = registro.instructor_id;
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

  const renderAgendaWeek = () => {
    if (!agendaWeekBody) return;
    const weekValue = weekInput?.value || getWeekStringFromDate(new Date());
    if (weekInput) weekInput.value = weekValue;

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
      const bloquesDia = bloques.filter((bloque) => normalizarDia(bloque.dia) === dia);
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

  const renderAgendaDaySelector = () => {
    if (!agendaDaySelector) return;
    agendaDaySelector.innerHTML = agendaDiasDatos
      .map((diaData, index) => {
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
    refreshIcons();
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
            data-fecha="${bloque.fecha}" data-hora="${bloque.hora}" data-sala="${bloque.sala}" data-instructor="${bloque.instructor_id}" data-alumno="${alumno.id}">
            <i class="lucide-icon" data-lucide="user-check" aria-hidden="true"></i>
          </button>
          <button class="btn icon-only danger btn-agenda-absent" aria-label="Registrar falta" title="Registrar falta"
            data-fecha="${bloque.fecha}" data-hora="${bloque.hora}" data-sala="${bloque.sala}" data-instructor="${bloque.instructor_id}" data-alumno="${alumno.id}">
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
        <p>${formatFullDate(diaData.fecha)}</p>
      </div>
      ${diaData.bloques.map((bloque) => renderAgendaSlotCard(bloque)).join("")}
    `;
    bindAgendaSlotActions();
    refreshIcons();
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
            instructor: btn.dataset.instructor,
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
            instructor: btn.dataset.instructor,
          },
          btn.dataset.alumno,
          "ausente"
        )
      );
    });
  };

  const loadAsistenciaRecords = async () => {
    const response = await apiGet("/.netlify/functions/asistencia-hora-get");
    if (!response.ok) {
      if (agendaDaySelector) {
        agendaDaySelector.innerHTML = `<div class="empty-state">No se pudo cargar la agenda.</div>`;
      }
      agendaWeekBody.innerHTML = "<div class=\"empty-state\">No se pudo cargar la agenda.</div>";
      return;
    }
    agendaCache = response.data?.asistencia || [];
    renderAgendaWeek();
    renderAsistenciasHistory();
    await loadRecuperacionesHistory();
  };

  const mapAlumnoName = (id) => {
    const alumno = alumnosCache.find((item) => item.id === id);
    return alumno ? `${alumno.nombre || ""} ${alumno.apellido || ""}`.trim() : id || "—";
  };

  const mapInstructorName = (id) => {
    const inst = instructoresCache.find((item) => item.id === id);
    return inst ? inst.nombre || id : id || "—";
  };

  const alumniPlanId = (alumnoId) => {
    const alumno = alumnosCache.find((item) => item.id === alumnoId);
    return alumno?.plan_id || "";
  };

  const plansCacheById = (planId) => planesCache.find((plan) => plan.plan_id === planId) || null;

  const renderAsistenciasHistory = () => {
    if (!asistenciasHistoryEl) return;
    if (!agendaCache.length) {
      asistenciasHistoryEl.innerHTML = "<p>No hay asistencias registradas.</p>";
      return;
    }
    const rows = [...agendaCache]
      .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
      .map((asis) => {
        const alumno = mapAlumnoName(asis.alumno_id);
        const instructor = mapInstructorName(asis.instructor_id);
        const estadoLower = (asis.estado || "").toLowerCase();
        const estado =
          estadoLower === "confirmado" ? "Presente" : estadoLower === "ausente" ? "Ausente" : asis.estado || "—";
        return `
          <tr>
            <td>${alumno}</td>
            <td>${instructor}</td>
            <td>${asis.fecha || "—"}</td>
            <td>${asis.hora || "—"}</td>
            <td>${estado}</td>
          </tr>
        `;
      })
      .join("");
    asistenciasHistoryEl.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Instructor</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };

  const loadRecuperacionesHistory = async () => {
    if (!recuperacionesHistoryEl) return;
    const response = await apiGet("/.netlify/functions/recuperaciones-get");
    if (!response.ok) {
      recuperacionesHistoryEl.innerHTML = "<p>No se pudo cargar el historial.</p>";
      return;
    }

    recuperacionesCache = (response.data?.recuperaciones || []).filter((rec) =>
      (rec.motivo || "").toLowerCase().includes("falta")
    );
    if (!recuperacionesCache.length) {
      recuperacionesHistoryEl.innerHTML = "<p>No hay recuperaciones registradas.</p>";
      return;
    }

    const rows = [...recuperacionesCache]
      .reverse()
      .map((rec) => {
        const alumno = mapAlumnoName(rec.alumno_id);
        const instructor = mapInstructorName(rec.instructor_id);
        const recId = rec.recup_id || rec.id || "";
        const detalleReprogramacion = (rec.observacion || "").trim() || rec.fecha_recupera || "—";
        const motivoLower = (rec.motivo || "").toLowerCase();
        let estado = "Pendiente";
        if (detalleReprogramacion && detalleReprogramacion !== "—") {
          estado = "Reprogramado";
        } else if (rec.estado) {
          estado = rec.estado;
        }
        const puedeReprogramar = estado.toLowerCase().includes("pendiente") && motivoLower.includes("falta");
        const accion = puedeReprogramar
          ? `<button class="btn small secondary" data-recup-reprogramar="${recId}">Reprogramar</button>`
          : "—";
        return `
          <tr>
            <td>${alumno}</td>
            <td>${instructor}</td>
            <td>${rec.motivo || "—"}</td>
            <td>${estado}</td>
            <td>${detalleReprogramacion}</td>
            <td>${accion}</td>
          </tr>
        `;
      })
      .join("");

    recuperacionesHistoryEl.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Instructor</th>
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

    recuperacionesHistoryEl.querySelectorAll("[data-recup-reprogramar]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const recId = btn.dataset.recupReprogramar;
        const rec = recuperacionesCache.find((item) => item.recup_id === recId || item.id === recId);
        if (rec) {
          openRecuperacionReprogramar(rec);
        }
      });
    });
  };

  const setRegistrosView = (view) => {
    if (btnVerAsistencias && btnVerRecuperaciones) {
      btnVerAsistencias.classList.toggle("active", view === "asistencias");
      btnVerRecuperaciones.classList.toggle("active", view === "recuperaciones");
      btnVerAsistencias.classList.toggle("ghost", view !== "asistencias");
      btnVerRecuperaciones.classList.toggle("ghost", view !== "recuperaciones");
      btnVerAsistencias.classList.toggle("secondary", view === "asistencias");
      btnVerRecuperaciones.classList.toggle("secondary", view === "recuperaciones");
    }
    if (asistenciasHistoryEl) {
      asistenciasHistoryEl.classList.toggle("hidden", view !== "asistencias");
    }
    if (recuperacionesHistoryEl) {
      recuperacionesHistoryEl.classList.toggle("hidden", view !== "recuperaciones");
    }
  };

  const renderRecuperacionHorarios = (instructorId) => {
    if (!recupReprogramarHorario) return;
    const disponibles = horariosCache.filter(
      (horario) => String(horario.instructor_id || "") === String(instructorId || "")
    );
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
    if (recupReprogramarInstructor) recupReprogramarInstructor.value = rec.instructor_id || "";
    if (recupReprogramarAlumnoNombre) recupReprogramarAlumnoNombre.value = mapAlumnoName(rec.alumno_id);
    if (recupReprogramarInstructorNombre)
      recupReprogramarInstructorNombre.value = mapInstructorName(rec.instructor_id);
    if (recupReprogramarFecha) {
      const hoy = new Date().toISOString().slice(0, 10);
      recupReprogramarFecha.value = rec.fecha_recupera || hoy;
    }
    renderRecuperacionHorarios(rec.instructor_id);
    openModal(recupReprogramarModal);
  };

  const getWeekValueFromDate = (fecha) => (fecha ? getWeekStringFromDate(new Date(fecha)) : "");

  const countAlumnoWeekSessions = (alumnoId, fecha) => {
    const weekValue = getWeekValueFromDate(fecha);
    if (!weekValue) return 0;
    const { start, end } = getWeekRange(weekValue);
    return agendaCache.filter(
      (registro) =>
        registro.alumno_id === alumnoId && registro.fecha && registro.fecha >= start && registro.fecha <= end
    ).length;
  };

  const createRecuperacion = async (payload) => {
    const response = await apiPost("/.netlify/functions/recuperaciones-create", payload);
    if (!response.ok) {
      console.warn("No se pudo crear recuperación:", response.error);
    }
    return response;
  };

  const handleAgendaFormSubmit = async (event) => {
    event?.preventDefault();
    if (!agendaWeekForm) return;
    const payload = {
      agenda_id: agendaControlId?.value || undefined,
      fecha: agendaControlFecha?.value,
      hora: agendaControlHora?.value,
      sala: agendaControlSala?.value,
      instructor_id: agendaControlInstructor?.value,
    };
    if (!payload.fecha || !payload.hora || !payload.sala || !payload.instructor_id) {
      alert("Completá fecha, hora, sala e instructor.");
      return;
    }
    const fechaObj = new Date(payload.fecha);
    payload.dia_semana = formatDayName(payload.fecha);
    payload.semana = `Semana ${Math.ceil(fechaObj.getDate() / 7)}`;
    const plan = planesCache.find((item) => item.plan_id === planSelect?.value);
    if (plan) {
      payload.instructor_id = agendaControlInstructor?.value;
    }
    const response = await apiPost("/.netlify/functions/agenda-set", payload);
    if (!response.ok) {
      alert(response.error || "No se pudo guardar la clase.");
      return;
    }
    agendaWeekForm?.reset();
    agendaControlId.value = "";
    await loadAgendaRecords();
    closeModal(modalAgendaControl);
  };

  const loadAgendaRecords = async () => {
    await loadAsistenciaRecords();
  };

  const handleAgendaAttendanceForStudent = async (slotData, alumnoId, estado) => {
    if (!alumnoId) {
      alert("No se pudo identificar el alumno.");
      return;
    }
    const planId = alumniPlanId(alumnoId);
    const payload = {
      fecha: slotData.fecha,
      hora: slotData.hora,
      sala: slotData.sala,
      instructor_id: slotData.instructor,
      alumno_id: alumnoId,
      plan_id: planId,
      estado,
      observacion: estado === "ausente" ? "Registro desde falta" : "Asistencia confirmada",
    };
    const response = await apiPost("/.netlify/functions/asistencia-hora-create", payload);
    if (!response.ok) {
      alert(response.error || "No se pudo registrar la asistencia.");
      return;
    }
    await loadAsistenciaRecords();
    loadRecuperacionesHistory();
  };

  recupReprogramarForm?.addEventListener("submit", async (event) => {
    event?.preventDefault();
    if (!recupReprogramarId || !recupReprogramarAlumno || !recupReprogramarInstructor) return;
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
      instructor_id: recupReprogramarInstructor.value,
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
    await loadAgendaRecords();
    await loadRecuperacionesHistory();
    closeModal(recupReprogramarModal);
  });

  agendaControlDelete?.addEventListener("click", async () => {
    const id = agendaControlId?.value;
    if (!id) return;
    const confirmacion = confirm("¿Eliminar la clase seleccionada?");
    if (!confirmacion) return;
    const response = await apiPost("/.netlify/functions/agenda-set", { agenda_id: id, remove: true });
    if (response.ok) {
      controlForm?.reset();
      agendaControlId.value = "";
      await loadAgendaRecords();
      closeModal(modalAgendaControl);
    } else {
      alert(response.error || "No se pudo eliminar la clase.");
    }
  });

  const handleControlFormSubmit = async (event) => {
    event?.preventDefault();
    if (!controlForm) return;
    const alumnoId = controlAlumnoSelect?.value;
    if (!alumnoId) {
      alert("Seleccioná un alumno para asignar.");
      return;
    }
    const planId = planSelect?.value;
    if (!planId) {
      alert("Seleccioná un plan para asignar.");
      return;
    }
    const instructorId = controlInstructorSelect?.value;
    const horariosSeleccionados = Array.from(horariosSeleccionadosSet);
    if (!instructorId || !horariosSeleccionados.length) {
      alert("Debés elegir instructor y al menos un horario.");
      return;
    }
    if (controlFormLocked) {
      alert("El alumno ya registró el pago para el mes seleccionado.");
      return;
    }
    if (!controlPagoFecha?.value || !controlPagoMes?.value || !controlPagoMonto?.value || !controlPagoMedio?.value) {
      alert("Completá la fecha, mes, monto y medio del pago.");
      return;
    }

    const plan = planesCache.find((item) => item.plan_id === planId);
    const payloadAlumno = { id: alumnoId };
    if (plan) {
      payloadAlumno.plan_sesiones = plan.sesiones || plan.nombre;
      payloadAlumno.sesiones_restantes = plan.sesiones || "";
    }
    if (controlPagoFecha?.value) {
      payloadAlumno.fecha_pago = controlPagoFecha.value;
    }
    payloadAlumno.instructor = instructorId;
    const etiquetasHorarios = horariosSeleccionados
      .map((horarioId) => {
        const horario = horariosCache.find((h) => h.id === horarioId);
        return horario ? `${horario.dia || ""} · ${horario.hora || ""} · Sala ${horario.sala || "—"}` : null;
      })
      .filter(Boolean);
    if (etiquetasHorarios.length) {
      payloadAlumno.horario = etiquetasHorarios.join(" | ");
    }

    const alumnoResponse = await apiPost("/.netlify/functions/alumnos-update", payloadAlumno);
    if (!alumnoResponse.ok) {
      alert(alumnoResponse.error || "No se pudo guardar la asignación.");
      return;
    }

    const pagoPayload = {
      alumno_id: alumnoId,
      instructor_id: instructorId,
      fecha_pago: controlPagoFecha?.value,
      mes_liquidado: controlPagoMes?.value,
      monto: controlPagoMonto?.value,
      medio_pago: controlPagoMedio?.value,
      observacion: controlPagoObservacion?.value,
    };

    const pagoResponse = await apiPost("/.netlify/functions/pagos-create", pagoPayload);
    if (!pagoResponse.ok) {
      alert(pagoResponse.error || "No se pudo registrar el pago.");
      return;
    }

    const mesLiquidado = controlPagoMes?.value;
    if (mesLiquidado) {
      invalidatePagosCache(mesLiquidado);
      try {
        await apiGet(`/.netlify/functions/sueldos-calc?mes=${mesLiquidado}`);
        await cargarSueldos();
      } catch (error) {
        console.warn("No se pudo recalcular sueldos automáticamente", error);
      }
    }

    controlForm.reset();
    setControlFormLockState(false);
    cargarAlumnos();
    cargarMora();
    cargarPagosPorMes();
    cargarRecaudacionMensual();
    closeModal(modalControlAlumno);
  };

  const handlePlanFormSubmit = async (event) => {
    event?.preventDefault();
    if (!planForm) return;
    const payload = {
      plan_id: planIdInput?.value || undefined,
      nombre: planNombreInput?.value,
      sesiones: planSesionesInput?.value,
      precio: planPrecioInput?.value,
      frecuencia: planFrecuenciaInput?.value,
      activo: planActivoInput?.value || "sí",
    };
    if (!payload.nombre || !payload.sesiones || !payload.precio || !payload.frecuencia) {
      alert("Completá todos los campos obligatorios del plan.");
      return;
    }
    const endpoint = payload.plan_id ? "planes-update" : "planes-create";
    if (!payload.plan_id) delete payload.plan_id;
    const response = await apiPost(`/.netlify/functions/${endpoint}`, payload);
    if (response.ok) {
      resetPlanForm();
      await cargarPlanes();
      cargarMora();
      cargarPagosPorMes();
      cargarRecaudacionMensual();
      closeModal(modalPlan);
    } else {
      alert(response.error || "No se pudo guardar el plan.");
    }
  };

  const resetAlumnoForm = () => {
    formAlumno.reset();
    alumnoIdInput.value = "";
    editingAlumnoId = null;
    const submit = formAlumno.querySelector("button[type='submit']");
    if (submit) submit.textContent = "Guardar alumno";
  };

  const openAlumnoForm = (alumno = null) => {
    if (alumno) {
      editingAlumnoId = alumno.id;
      alumnoIdInput.value = alumno.id;
      formAlumno.nombre.value = alumno.nombre || "";
      formAlumno.apellido.value = alumno.apellido || "";
      formAlumno.dni.value = alumno.dni || "";
      formAlumno.telefono.value = alumno.telefono || "";
      formAlumno.fecha_nacimiento.value = alumno.fecha_nacimiento || "";
      formAlumno.sesiones_restantes.value = alumno.sesiones_restantes || "";
      formAlumno.derivado_medico.value = alumno.derivado_medico || "";
      formAlumno.patologia_cirugia.value = alumno.patologia_cirugia || "";
      formAlumno.patologia_tipo.value = alumno.patologia_tipo || "";
      formAlumno.observaciones.value = alumno.observaciones || "";
      const submit = formAlumno.querySelector("button[type='submit']");
      if (submit) submit.textContent = "Actualizar alumno";
    } else {
      resetAlumnoForm();
    }
    openModal(document.getElementById("modal-alumno"));
  };

  if (formAlumno) {
    formAlumno.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(formAlumno).entries());
      const endpoint = editingAlumnoId
        ? "/.netlify/functions/alumnos-update"
        : "/.netlify/functions/alumnos-create";
      const respuesta = await apiPost(endpoint, data);
      if (respuesta.ok) {
        msgAlumnos.textContent = editingAlumnoId ? "Alumno actualizado." : "Alumno guardado correctamente.";
        closeModal(document.getElementById("modal-alumno"));
        resetAlumnoForm();
        cargarAlumnos();
      } else {
        msgAlumnos.textContent = `Error: ${respuesta.error || "no se pudo guardar"}`;
      }
    });
  }

  const resetInstructorForm = () => {
    formInstructor.reset();
    instructorIdInput.value = "";
    editingInstructorId = null;
    const submit = formInstructor.querySelector("button[type='submit']");
    if (submit) submit.textContent = "Guardar instructor";
  };

  const openInstructorForm = (instructor = null) => {
    if (instructor) {
      editingInstructorId = instructor.id;
      instructorIdInput.value = instructor.id;
      formInstructor.nombre.value = instructor.nombre || "";
      formInstructor.rol.value = instructor.rol || "";
      formInstructor.color.value = instructor.color || "#8b5cf6";
      formInstructor.whatsapp.value = instructor.whatsapp || "";
      const submit = formInstructor.querySelector("button[type='submit']");
      if (submit) submit.textContent = "Actualizar instructor";
    } else {
      resetInstructorForm();
    }
    openModal(document.getElementById("modal-instructor"));
  };

  if (formInstructor) {
    formInstructor.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(formInstructor).entries());
      const endpoint = editingInstructorId
        ? "/.netlify/functions/instructores-update"
        : "/.netlify/functions/instructores-create";
      const respuesta = await apiPost(endpoint, data);
      if (respuesta.ok) {
        msgInstructores.textContent = editingInstructorId
          ? "Instructor actualizado." : "Instructor guardado correctamente.";
        closeModal(document.getElementById("modal-instructor"));
        resetInstructorForm();
        cargarInstructores();
      } else {
        msgInstructores.textContent = `Error: ${respuesta.error || "no se pudo guardar"}`;
      }
    });
  }

  const resetHorarioForm = () => {
    formHorario.reset();
    horarioIdInput.value = "";
    editingHorarioId = null;
    const submit = formHorario.querySelector("button[type='submit']");
    if (submit) submit.textContent = "Guardar horario";
    if (horarioInstructorSelect) horarioInstructorSelect.value = "";
  };

  const openHorarioForm = (horario = null, fromDay = null) => {
    horarioModalDiaActivo = fromDay || null;
    if (fromDay) {
      modalHorario.dataset.fromDay = fromDay;
    } else {
      delete modalHorario.dataset.fromDay;
    }
    if (horario) {
      editingHorarioId = horario.id;
      horarioIdInput.value = horario.id;
      formHorario.dia.value = horario.dia || "";
      formHorario.hora.value = horario.hora || "";
      formHorario.sala.value = horario.sala || "";
      formHorario.capacidad.value = horario.capacidad || "";
      formHorario.instructor_id.value = horario.instructor_id || "";
      if (horarioInstructorSelect) horarioInstructorSelect.value = horario.instructor_id || "";
      formHorario.activo.value = horario.activo || "sí";
      const submit = formHorario.querySelector("button[type='submit']");
      if (submit) submit.textContent = "Actualizar horario";
    } else {
      resetHorarioForm();
    }
    openModal(modalHorario);
  };

  if (formHorario) {
    formHorario.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(formHorario).entries());
      const endpoint = editingHorarioId
        ? "/.netlify/functions/horarios-update"
        : "/.netlify/functions/horarios-create";
      const respuesta = await apiPost(endpoint, data);
      if (respuesta.ok) {
        msgHorarios.textContent = editingHorarioId
          ? "Horario actualizado." : "Horario guardado correctamente.";
        const diaToReopen = horarioModalDiaActivo;
        closeModal(modalHorario);
        resetHorarioForm();
        await cargarHorarios();
        if (diaToReopen) {
          mostrarHorariosDia(diaToReopen);
        }
        horarioModalDiaActivo = null;
      } else {
        msgHorarios.textContent = `Error: ${respuesta.error || "no se pudo guardar"}`;
      }
    });
  }

  const renderHorarioInstructorOptions = () => {
    if (!horarioInstructorSelect) return;
    horarioInstructorSelect.innerHTML = `
      <option value="">Seleccionar instructor</option>
      ${instructoresCache
        .map(
          (inst) =>
            `<option value="${inst.id}">${inst.nombre} (${inst.rol || "Instructor"})</option>`
        )
        .join("")}
    `;
  };

  const cargarAlumnos = async () => {
    listAlumnos.innerHTML = "Cargando...";
    const alumnos = await apiGet("/.netlify/functions/alumnos-get");
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      listAlumnos.innerHTML = `<div class="empty-state">No hay alumnos registrados</div>`;
      return;
    }
    alumnosCache = alumnos;
    actualizarControlSelects();
    listAlumnos.innerHTML = "";
    alumnos.forEach((alumno) => {
      const instructor = getInstructorById(alumno.instructor);
      const instructorNombre = (instructor?.nombre || alumno.instructor || "?").trim();
      const instructorInicial = instructorNombre ? instructorNombre.charAt(0).toUpperCase() : "?";
      const card = document.createElement("article");
      card.className = "entity-card";
      card.innerHTML = `
        <div class="entity-card__header">
          <div>
            <h3 class="entity-card__title">${alumno.nombre} ${alumno.apellido}</h3>
            <p class="entity-card__subtitle">${alumno.plan_sesiones || 0} sesiones</p>
          </div>
          <div class="entity-card__header-right">
            ${renderEstadoPago(alumno.estado_pago)}
            <span class="instructor-chip" style="background:${instructor?.color || "#d1d8dd"};">
              ${instructorInicial}
            </span>
          </div>
        </div>
        <div class="entity-card__body">
          <p class="entity-detail"><strong>Plan:</strong> ${alumno.plan_sesiones || "—"}</p>
          <p class="entity-detail horario-detail"><strong>Horario:</strong> ${alumno.horario || "—"}</p>
        </div>
        <div class="entity-actions">
          <button class="btn small secondary icon-only" type="button" aria-label="Editar alumno">
            <i class="lucide-icon" data-lucide="user-round-cog" aria-hidden="true"></i>
          </button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => openAlumnoForm(alumno));
      listAlumnos.appendChild(card);
    });
    refreshIcons();
  };



  const cargarInstructores = async () => {
    listInstructores.innerHTML = "Cargando...";
    const data = await apiGet("/.netlify/functions/instructores-get");
    if (!Array.isArray(data) || data.length === 0) {
      listInstructores.innerHTML = "<div class=\"empty-state\">No hay instructores.</div>";
      instructoresCache = [];
      renderHorarioInstructorOptions();
      return;
    }
    instructoresCache = data;
    actualizarControlSelects();
    listInstructores.innerHTML = "";
    data.forEach((inst) => {
      const card = document.createElement("article");
      card.className = "entity-card";
      card.innerHTML = `
        <div class="entity-card__header">
          <div>
            <p class="entity-card__title">${inst.nombre}</p>
            <p class="entity-card__subtitle">${inst.rol}</p>
          </div>
          <span class="instructor-chip" style="background:${inst.color || "#c4c4c4"};"></span>
        </div>
        <div class="entity-card__body">
          <p class="entity-detail"><strong>WhatsApp:</strong> ${inst.whatsapp || "—"}</p>
        </div>
        <div class="entity-actions">
          <button class="btn small secondary icon-only" type="button" aria-label="Editar instructor">
            <i class="lucide-icon" data-lucide="user-round-cog" aria-hidden="true"></i>
          </button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => openInstructorForm(inst));
      listInstructores.appendChild(card);
    });
    renderHorarioInstructorOptions();
    refreshIcons();
  };

  const cargarHorarios = async () => {
    if (!listHorarios) return;
    listHorarios.innerHTML = "<p>Cargando horarios...</p>";
    const data = await apiGet("/.netlify/functions/horarios-get");
    if (!Array.isArray(data) || data.length === 0) {
      listHorarios.innerHTML = "<div class=\"empty-state\">No hay horarios cargados</div>";
      return;
    }
    horariosCache = data;
    horariosPorDia = HORARIOS_DIAS.reduce((acc, dia) => {
      acc[dia] = [];
      return acc;
    }, {});
    data.forEach((horario) => {
      const diaNormalizado = normalizarDia(horario.dia || "");
      if (!diaNormalizado) return;
      if (!horariosPorDia[diaNormalizado]) {
        horariosPorDia[diaNormalizado] = [];
      }
      horariosPorDia[diaNormalizado].push(horario);
    });
    actualizarControlSelects();
    renderHorarioInstructorOptions();
    listHorarios.innerHTML = `
      <div class="horario-day-grid">
        ${HORARIOS_DIAS.map(
          (dia) => `
            <button class="day-chip" type="button" data-dia="${dia}">
              <i class="lucide-icon" data-lucide="calendar-days" aria-hidden="true"></i>
              <span>${dia}</span>
            </button>
          `
        ).join("")}
      </div>
    `;
    listHorarios.querySelectorAll("[data-dia]").forEach((btn) => {
      btn.addEventListener("click", () => mostrarHorariosDia(btn.dataset.dia));
    });
    refreshIcons();
  };

  const buildHorarioCard = (horario) => {
    const instructorNombre =
      getInstructorById(horario.instructor_id)?.nombre || horario.instructor_id || "—";
    const activo = (horario.activo || "sí").toLowerCase() !== "no";
    return `
      <article class="entity-card">
        <div class="entity-card__header">
          <div>
            <p class="entity-card__title">${horario.dia || "—"} · ${horario.hora || "—"}</p>
            <p class="entity-card__subtitle">Sala ${horario.sala || "—"} · Capacidad ${horario.capacidad || "—"}</p>
          </div>
          <span class="status-pill status-${activo ? "pagado" : "vencido"}" title="${
      activo ? "Activo" : "Inactivo"
    }">
            <span class="sr-only">${activo ? "Activo" : "Inactivo"}</span>
          </span>
        </div>
        <div class="entity-card__body">
          <p class="entity-detail"><strong>Instructor:</strong> ${instructorNombre}</p>
        </div>
        <div class="entity-actions">
          <button class="btn small secondary icon-only" type="button" aria-label="Editar horario">
            <i class="lucide-icon" data-lucide="user-round-cog" aria-hidden="true"></i>
          </button>
        </div>
      </article>
    `;
  };

  const mostrarHorariosDia = (dia) => {
    if (!modalHorariosDia || !horariosDiaContent) return;
    modalHorariosDiaTitle.textContent = dia;
    const items = horariosPorDia[dia] || [];
    if (!items.length) {
      horariosDiaContent.innerHTML = `<div class="empty-state">No hay horarios para ${dia}.</div>`;
    } else {
      horariosDiaContent.innerHTML = `
        <div class="horarios-dia-list">
          ${items.map((horario) => buildHorarioCard(horario)).join("")}
        </div>
      `;
      const actionButtons = horariosDiaContent.querySelectorAll(".entity-actions button");
      actionButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          closeModal(modalHorariosDia);
          openHorarioForm(items[index], dia);
        });
      });
    }
    openModal(modalHorariosDia);
    refreshIcons();
  };

  const deleteButtons = document.querySelectorAll("[data-delete-type]");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const type = btn.dataset.deleteType;
      if (!type) return;
      openDeleteSelection(type);
    });
  });

  cancelSelectDeleteBtn.addEventListener("click", () => {
    modalSelectDelete.classList.add("hidden");
  });

  finalDeleteBtn.addEventListener("click", async () => {
    if (!deleteType || !deleteTarget) return;
    try {
      const res = await apiPost(
        `/.netlify/functions/${deleteType}-delete-one`,
        { id: deleteTarget.id }
      );
      if (res.ok) {
        modalConfirmDelete.classList.add("hidden");
        if (deleteType === "alumnos") cargarAlumnos();
        if (deleteType === "instructores") cargarInstructores();
        if (deleteType === "horarios") cargarHorarios();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Error de red");
    }
  });

  const openDeleteSelection = (type) => {
    deleteType = type;
    deleteTarget = null;
    deleteTitle.textContent =
      type === "alumnos" ? "Eliminar alumno" :
      type === "instructores" ? "Eliminar instructor" :
      "Eliminar horario";
    deleteInfo.textContent = "";
    deleteList.innerHTML = "<p>Cargando...</p>";
    modalSelectDelete.classList.remove("hidden");
    modalConfirmDelete.classList.add("hidden");
    cargarListasEliminar();
  };

  const cargarListasEliminar = async () => {
    let data = [];
    if (deleteType === "alumnos") data = await apiGet("/.netlify/functions/alumnos-get");
    if (deleteType === "instructores") data = await apiGet("/.netlify/functions/instructores-get");
    if (deleteType === "horarios") data = await apiGet("/.netlify/functions/horarios-get");
    if (!Array.isArray(data) || data.length === 0) {
      deleteList.innerHTML = "<p>No hay registros.</p>";
      return;
    }
    deleteList.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("div");
      row.className = "delete-row";
      row.innerHTML = `
        <div>
          <strong>${item.nombre || item.dia || "Registro"}</strong><br>
          <small>ID: ${item.id}</small>
        </div>
        <button class="btn secondary small" type="button">Seleccionar</button>
      `;
      row.querySelector("button").addEventListener("click", () => {
        deleteTarget = item;
        openDeleteConfirmation();
      });
      deleteList.appendChild(row);
    });
  };

  const openDeleteConfirmation = () => {
    modalSelectDelete.classList.add("hidden");
    deleteInfo.innerHTML = `
      ¿Seguro que querés eliminar <strong>${deleteTarget?.nombre || deleteTarget?.dia || "este registro"}</strong>
      (ID: <strong>${deleteTarget?.id}</strong>)?
    `;
    modalConfirmDelete.classList.remove("hidden");
  };

  const resetGastoForm = () => {
    if (!formGastoEl) return;
    formGastoEl.reset();
    if (gastoIdInput) gastoIdInput.value = "";
  };

  const cargarMora = async () => {
    if (!moraList) return;
    moraList.innerHTML = "<p>Cargando...</p>";
    const response = await apiGet("/.netlify/functions/alumnos-get");
    const alumnos = Array.isArray(response) ? response : response?.data || [];
    alumnosCache = alumnos;
    if (!alumnos.length) {
      moraList.innerHTML = "<p>No hay alumnos registrados.</p>";
      return;
    }
    moraList.innerHTML = alumnos
      .map((alumno) => {
        const nombre = `${alumno.nombre || ""} ${alumno.apellido || ""}`.trim();
        return `
          <article class="mora-card" data-status="${alumno.estado_pago || "Sin datos"}">
            <div class="mora-card__head">
              <strong>${nombre || "Alumno sin nombre"}</strong>
              <span>${alumno.plan_sesiones || "Plan sin definir"}</span>
            </div>
            <div class="mora-card__body">
              ${renderEstadoPago(alumno.estado_pago || "Sin datos")}
              <p>ID: ${alumno.id || "—"}</p>
              <p>Instructor: ${getInstructorById(alumno.instructor_id)?.nombre || alumno.instructor_id || "—"}</p>
            </div>
            <div class="mora-card__actions">
              <button class="btn danger small" data-id="${alumno.id}">Dar de baja</button>
            </div>
          </article>
        `;
      })
      .join("");
    moraList.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => darDeBajaAlumno(btn.dataset.id));
    });
    refreshIcons();
  };

  const darDeBajaAlumno = async (id) => {
    if (!id) return;
    const confirmacion = confirm("Confirmá la baja del alumno. Esta acción marca al alumno como 'activo = no'.");
    if (!confirmacion) return;
    const result = await apiPost("/.netlify/functions/alumnos-update", { id, activo: "no" });
    if (result.ok) {
      cargarMora();
      cargarAlumnos();
    } else {
      alert(result.error || "No se pudo dar de baja al alumno");
    }
  };

  const cargarRecaudacionMensual = async () => {
    if (!recaudacionBody) return;
    const mes = mesRecaudacionInput?.value;
    if (!mes) {
      recaudacionBody.innerHTML = "<p>Seleccioná un mes para ver los pagos.</p>";
      if (totalRecaudacion) totalRecaudacion.textContent = "";
      return;
    }
    recaudacionBody.innerHTML = "<p>Cargando...</p>";
    const response = await apiGet(`/.netlify/functions/pagos-get?mes=${mes}`);
    if (!response.ok) {
      recaudacionBody.innerHTML = `<p>${response.error || "No se pudieron obtener los pagos."}</p>`;
      if (totalRecaudacion) totalRecaudacion.textContent = "";
      return;
    }
    const pagos = response.data?.pagos || [];
    if (!pagos.length) {
      recaudacionBody.innerHTML = "<p>No hay pagos registrados para ese mes.</p>";
      if (totalRecaudacion) totalRecaudacion.textContent = "Total recaudado: $0";
      return;
    }
    recaudacionBody.innerHTML = pagos
      .map(
        (pago) => `
        <article class="recaudacion-card">
          <header class="recaudacion-card__header">
            <strong>Pago</strong>
            <span>${pago.pago_id || "—"}</span>
          </header>
          <div class="recaudacion-card__row"><span>Alumno</span><strong>${pago.alumno_id || "—"}</strong></div>
          <div class="recaudacion-card__row"><span>Medio</span><strong>${pago.medio_pago || "—"}</strong></div>
          <div class="recaudacion-card__row"><span>Monto</span><strong>$${Number(pago.monto || 0).toFixed(2)}</strong></div>
        </article>
      `
      )
      .join("");
    if (totalRecaudacion) {
      totalRecaudacion.textContent = `Total recaudado: $${Number(response.data?.total_recaudado || 0).toFixed(2)}`;
    }
  };

  const cargarPagosPorMes = async () => {
    if (!controlPagoTable) return;
    const mes = controlPagoMesFilter?.value || mesRecaudacionInput?.value;
    if (!mes) {
      controlPagoTable.innerHTML = "<p>Seleccioná un mes de liquidación.</p>";
      return;
    }
    controlPagoTable.innerHTML = "<p>Cargando pagos...</p>";
    let pagos = [];
    try {
      pagos = await obtenerPagosPorMes(mes, { force: true });
    } catch (error) {
      controlPagoTable.innerHTML = `<p>${error.message || "No se pudieron cargar los pagos."}</p>`;
      return;
    }
    if (!pagos.length) {
      controlPagoTable.innerHTML = "<p>No hay pagos para ese mes.</p>";
      return;
    }
    const filas = pagos
      .map(
        (pago) => `
          <tr>
            <td>${pago.pago_id || "—"}</td>
            <td>${mapAlumnoName(pago.alumno_id)}</td>
            <td>${mapInstructorName(pago.instructor_id)}</td>
            <td>${(pago.medio_pago || pago.medio || "—").toString()}</td>
            <td>${pago.fecha_pago || "—"}</td>
            <td>$${Number(pago.monto || 0).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");
    controlPagoTable.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Pago</th>
            <th>Alumno</th>
            <th>Instructor</th>
            <th>Medio</th>
            <th>Fecha</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
    `;
  };

  const cargarGastos = async () => {
    if (!gastosListEl) return;
    gastosListEl.innerHTML = "<p>Cargando...</p>";
    const response = await apiGet("/.netlify/functions/gastos-get");
    if (!response.ok) {
      gastosListEl.innerHTML = `<p>${response.error || "No se pudieron cargar los gastos."}</p>`;
      return;
    }
    const gastos = response.data?.gastos || [];
    gastosCache = gastos;
    if (!gastos.length) {
      gastosListEl.innerHTML = "<p>No hay gastos registrados.</p>";
      return;
    }
    const filas = gastos
      .map(
        (gasto) => `
          <div class="gasto-row">
            <div>
              <strong>${gasto.categoria}</strong> · ${gasto.fecha}
              <br><small>${gasto.descripcion}</small>
              <br><small>${gasto.medio_pago || ""} · ${gasto.comprobanteNro || ""}</small>
            </div>
            <div class="gasto-actions">
              <span>$${Number(gasto.monto || 0).toFixed(2)}</span>
              <button class="btn small" data-edit="${gasto.gasto_id}">Editar</button>
              <button class="btn ghost small" data-delete="${gasto.gasto_id}">Eliminar</button>
            </div>
          </div>
        `
      )
      .join("");
    gastosListEl.innerHTML = filas;
    gastosListEl.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => editarGasto(btn.dataset.edit));
    });
    gastosListEl.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => eliminarGasto(btn.dataset.delete));
    });
  };

  const editarGasto = (targetId) => {
    if (!targetId) return;
    const gasto = gastosCache.find((item) => item.gasto_id === targetId);
    if (!gasto || !formGastoEl) return;
    if (gastoIdInput) gastoIdInput.value = gasto.gasto_id || "";
    if (gastoFecha) gastoFecha.value = gasto.fecha || "";
    if (gastoCategoria) gastoCategoria.value = gasto.categoria || "";
    if (gastoDescripcion) gastoDescripcion.value = gasto.descripcion || "";
    if (gastoMonto) gastoMonto.value = gasto.monto || "";
    if (gastoMedio) gastoMedio.value = gasto.medio_pago || "";
    if (gastoComprobante) gastoComprobante.value = gasto.comprobanteNro || "";
    if (gastoObservacion) gastoObservacion.value = gasto.observacion || "";
    openModal(modalGasto);
  };

  const eliminarGasto = async (id) => {
    if (!id) return;
    const confirmacion = confirm("¿Eliminar este gasto?");
    if (!confirmacion) return;
    const response = await apiPost("/.netlify/functions/gastos-delete-one", { gasto_id: id });
    if (response.ok) {
      cargarGastos();
    } else {
      alert(response.error || "No se pudo eliminar el gasto");
    }
  };

  const handleGastoSubmit = async (event) => {
    event.preventDefault();
    if (!formGastoEl) return;
    const payload = {
      gasto_id: gastoIdInput?.value || undefined,
      fecha: gastoFecha?.value,
      categoria: gastoCategoria?.value,
      descripcion: gastoDescripcion?.value,
      monto: gastoMonto?.value,
      medio_pago: gastoMedio?.value,
      comprobanteNro: gastoComprobante?.value,
      observacion: gastoObservacion?.value,
    };
    if (!payload.fecha || !payload.categoria || !payload.descripcion || !payload.monto || !payload.medio_pago) {
      alert("Completá los campos obligatorios del gasto.");
      return;
    }
    const endpoint = payload.gasto_id ? "gastos-update" : "gastos-create";
    if (!payload.gasto_id) delete payload.gasto_id;
    const response = await apiPost(`/.netlify/functions/${endpoint}`, payload);
    if (response.ok) {
      resetGastoForm();
      cargarGastos();
      closeModal(modalGasto);
    } else {
      alert(response.error || "No se pudo guardar el gasto");
    }
  };

  const calcularSueldos = async () => {
    const mes = mesSueldosInput?.value;
    if (!mes) {
      alert("Seleccioná el mes a liquidar.");
      return false;
    }
    const response = await apiGet(`/.netlify/functions/sueldos-calc?mes=${mes}`);
    if (response.ok) {
      cargarSueldos();
      return true;
    }
    alert(response.error || "No se pudieron calcular los sueldos.");
    return false;
  };

  const cargarSueldos = async () => {
    if (!sueldosListEl) return;
    sueldosListEl.innerHTML = "<p>Cargando sueldos...</p>";
    const response = await apiGet("/.netlify/functions/sueldos-get");
    if (!response.ok) {
      sueldosListEl.innerHTML = `<p>${response.error || "No se pudo obtener la liquidación."}</p>`;
      return;
    }
    const sueldos = response.data?.sueldos || [];
    if (!sueldos.length) {
      sueldosListEl.innerHTML = "<p>No hay sueldos calculados aún.</p>";
      return;
    }
    const filas = sueldos
      .map((registro) => {
        const instructor = getInstructorById(registro.instructor_id);
        return `
          <div class="gasto-row">
            <div>
              <strong>${instructor?.nombre || `ID ${registro.instructor_id}`}</strong>
              <br><small>Mes ${registro.mes}</small>
              <br><small>Total $${Number(registro.total_recaudado || 0).toFixed(2)}</small>
              ${
                registro.detalle_ingresos
                  ? `<br><small>${registro.detalle_ingresos
                      .split("|")
                      .map((item) => item.trim())
                      .join("<br>")}</small>`
                  : ""
              }
            </div>
            <div class="gasto-actions">
              <span>Sueldo: $${Number(registro.sueldo_estimado || 0).toFixed(2)}</span>
              <span class="status-pill status-${(registro.pagado || "no").toLowerCase() === "sí" ? "pagado" : "pendiente"}">
                ${(registro.pagado || "no").toUpperCase()}
              </span>
            </div>
          </div>
        `;
      })
      .join("");
    sueldosListEl.innerHTML = filas;
  };

  const cargarAgendaGeneral = async () => {
    await loadAgendaRecords();
  };

  btnRecaudacion?.addEventListener("click", async () => {
    await cargarRecaudacionMensual();
    closeModal(modalRecaudacion);
  });
  planSelect?.addEventListener("change", () => {
    limpiarSeleccionHorarios(true);
    if (!planHint) return;
    const plan = planesCache.find((item) => item.plan_id === planSelect?.value);
    if (!plan) {
      planHint.textContent = "Elegí un plan para ver el precio y frecuencia.";
      if (controlPlanMontoDisplay) controlPlanMontoDisplay.textContent = "El plan define el monto.";
      if (controlPagoMonto) controlPagoMonto.value = "";
      maxHorariosSeleccionables = 1;
      updateControlHorarioHint();
      actualizarSelectControlHorarios(instructorFiltroActual || controlInstructorSelect?.value || "");
      return;
    }
    maxHorariosSeleccionables = getMaxSesionesPorSemana(plan);
    const precio = plan.precio ? `$${Number(plan.precio).toLocaleString()}` : "Precio a definir";
    planHint.textContent = `${plan.nombre} · ${plan.frecuencia || "Frecuencia indefinida"} · ${precio} · Hasta ${maxHorariosSeleccionables} horarios/semana.`;
    if (controlPlanMontoDisplay) controlPlanMontoDisplay.textContent = precio;
    if (controlPagoMonto) controlPagoMonto.value = plan.precio || "";
    actualizarSelectControlHorarios(instructorFiltroActual || controlInstructorSelect?.value || "");
    updateControlHorarioHint();
  });
  planForm?.addEventListener("submit", handlePlanFormSubmit);
  planResetButton?.addEventListener("click", (event) => {
    event.preventDefault();
    resetPlanForm();
  });
  planRefreshBtn?.addEventListener("click", cargarPlanes);
  controlForm?.addEventListener("submit", handleControlFormSubmit);
  controlInstructorSelect?.addEventListener("change", () => {
    if (!planSelect?.value) {
      updateControlHorarioHint("Seleccioná un plan antes de elegir horarios.");
      if (controlInstructorSelect) controlInstructorSelect.value = "";
      return;
    }
    limpiarSeleccionHorarios();
    actualizarSelectControlHorarios(controlInstructorSelect.value || "");
    updateControlHorarioHint();
    verificarAlumnoAlDia();
  });
  controlAlumnoSelect?.addEventListener("change", () => {
    verificarAlumnoAlDia();
  });
  btnRefrescarPagos?.addEventListener("click", cargarPagosPorMes);
  controlPagoMesFilter?.addEventListener("change", cargarPagosPorMes);
  controlForm?.addEventListener("reset", () => {
    if (planHint) planHint.textContent = "Elegí un plan para ver el precio y frecuencia.";
    if (controlPlanMontoDisplay) controlPlanMontoDisplay.textContent = "El plan define el monto.";
    if (controlPagoMonto) controlPagoMonto.value = "";
    if (planSelect) planSelect.value = "";
    if (controlInstructorSelect) controlInstructorSelect.value = "";
    maxHorariosSeleccionables = 1;
    instructorFiltroActual = "";
    limpiarSeleccionHorarios(true);
    actualizarSelectControlHorarios("");
    setControlFormLockState(false);
  });
  limpiarSeleccionHorarios(true);
  weekInput?.addEventListener("change", renderAgendaWeek);
  agendaPrevBtn?.addEventListener("click", () => changeWeek(-1));
  agendaNextBtn?.addEventListener("click", () => changeWeek(1));
  agendaWeekForm?.addEventListener("submit", handleAgendaFormSubmit);
  const actualizarMesDesdeFecha = () => {
    if (!controlPagoFecha || !controlPagoMes || !controlPagoMesDisplay) return;
    const fecha = controlPagoFecha.value;
    if (!fecha) {
      controlPagoMesDisplay.textContent = "Se calcula según la fecha";
      controlPagoMes.value = "";
      return;
    }
    const mes = fecha.slice(0, 7);
    controlPagoMes.value = mes;
    controlPagoMesDisplay.textContent = mes;
  };
  controlPagoFecha?.addEventListener("change", () => {
    actualizarMesDesdeFecha();
    cargarPagosPorMes();
    verificarAlumnoAlDia();
  });
  formGastoEl?.addEventListener("submit", handleGastoSubmit);
  gastoResetBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    resetGastoForm();
  });
  btnCalcularSueldos?.addEventListener("click", async () => {
    const result = await calcularSueldos();
    if (result) closeModal(modalSueldos);
  });
  btnCargarSueldos?.addEventListener("click", async () => {
    await cargarSueldos();
    closeModal(modalSueldos);
  });
  btnVerAsistencias?.addEventListener("click", () => {
    setRegistrosView("asistencias");
    renderAsistenciasHistory();
  });
  btnVerRecuperaciones?.addEventListener("click", () => {
    setRegistrosView("recuperaciones");
    loadRecuperacionesHistory();
  });

  reloadAlumnosBtn.addEventListener("click", cargarAlumnos);
  reloadInstructoresBtn.addEventListener("click", cargarInstructores);
  reloadHorariosBtn.addEventListener("click", cargarHorarios);

  Promise.all([cargarPlanes(), cargarAlumnos(), cargarInstructores(), cargarHorarios()]).then(() => {
    actualizarControlSelects();
    cargarMora();
    cargarRecaudacionMensual();
    cargarGastos();
    cargarSueldos();
    cargarAgendaGeneral();
    cargarPagosPorMes();
    loadAsistenciaRecords();
    loadRecuperacionesHistory();
    setRegistrosView("asistencias");
  });
});

function descargarHojaGeneral() {
  const SHEET_ID = "1cgDrcvvgOjrSU0-PQzf6z1GxavOEysS4NySm4cM4iUQ";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
  const a = document.createElement("a");
  a.href = url;
  a.download = "panel-control.xlsx";
  a.click();
}
