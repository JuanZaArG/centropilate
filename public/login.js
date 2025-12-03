const SESSION_KEY = "landingPilatesSession";

const usuariosPermitidos = [
  { usuario: "Mauro", password: "1234", rol: "dueno", instructorId: 1763253343461 },
  { usuario: "Gaston", password: "1234", rol: "instructor", instructorId: 1763253362980 },
  { usuario: "Karina", password: "1234", rol: "instructor", instructorId: 1763253419156 },
  { usuario: "Valeria", password: "1234", rol: "instructor", instructorId: 1763253454723 },
  { usuario: "Monica", password: "1234", rol: "instructor", instructorId: 1763253484883 },
];

const loginForm = document.getElementById("login-form");
const loginFeedback = document.getElementById("login-feedback");

const redireccionarSegunRol = (rol) => {
  if (rol === "dueno") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "tutor.html";
  }
};

const guardadoSesion = (usuario) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      usuario: usuario.usuario,
      rol: usuario.rol,
      instructorId: usuario.instructorId || null,
    })
  );
};

if (loginForm) {
  const sesionActiva = localStorage.getItem(SESSION_KEY);
  if (sesionActiva) {
    try {
      const usuarioActivo = JSON.parse(sesionActiva);
      redireccionarSegunRol(usuarioActivo.rol);
    } catch (err) {
      console.warn("Sesion inválida, borrando", err);
      localStorage.removeItem(SESSION_KEY);
    }
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const usuario = (formData.get("usuario") || "").toString().trim().toLowerCase();
    const password = formData.get("password") || "";

    const usuarioEncontrado = usuariosPermitidos.find(
      (item) => item.usuario.toLowerCase() === usuario && item.password === password
    );

    if (!usuarioEncontrado) {
      if (loginFeedback) {
        loginFeedback.textContent = "Usuario o contraseña inválidos.";
      }
      return;
    }

    guardadoSesion(usuarioEncontrado);
    redireccionarSegunRol(usuarioEncontrado.rol);
  });
}
