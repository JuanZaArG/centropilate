const { getSheetsClient } = require("./sheetsClient");

exports.handler = async () => {
  try {
    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.SHEET_ID,
      range: "Instructores!A2:G500"
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
