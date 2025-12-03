const { deleteRowById } = require("./delete-row");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Método no permitido" }) };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "JSON inválido" }) };
  }

  const { id } = payload;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Falta el id" }) };
  }

  try {
    const deleted = await deleteRowById("Instructores", id);
    if (!deleted) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, error: "Instructor no encontrado" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Error en instructores-delete-one:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
