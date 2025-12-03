const { google } = require("googleapis");

async function getSheetsClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SHEET_ID) {
    throw new Error("Faltan variables de entorno: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY o SHEET_ID");
  }

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

module.exports = { getSheetsClient };
