const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: 'path/to/your/service-account-file.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheet(sheetId, sheetName) {
  const client = await auth.getClient();
  const sheetsApi = google.sheets({ version: 'v4', auth: client });
  return sheetsApi.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: sheetName,
  });
}

async function appendToSheet(sheetId, sheetName, values) {
  const client = await auth.getClient();
  const sheetsApi = google.sheets({ version: 'v4', auth: client });
  return sheetsApi.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: sheetName,
    valueInputOption: 'RAW',
    resource: {
      values: [values],
    },
  });
}

module.exports = {
  getSheet,
  appendToSheet,
};
