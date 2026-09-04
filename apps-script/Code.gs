/**
 * Dayone Ventures — contact-form lead sink.
 *
 * Deploy this as a Google Apps Script Web App bound to the spreadsheet that
 * should collect leads. The site's server function POSTs one JSON object per
 * submission; this appends a row.
 *
 * Setup:
 *   1. Open the target Google Sheet → Extensions → Apps Script.
 *   2. Replace the default file with this code. Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the /exec URL → set it as the site's LEAD_SHEET_URL env var.
 *   4. Re-deploy (Manage deployments → edit → Version: New) after any edit.
 */

var SHEET_NAME = 'Leads';
var HEADERS = ['Submitted at', 'Name', 'Email', 'Organisation', 'Role', 'Company in question', 'Message', 'Source'];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      body.submittedAt || new Date().toISOString(),
      body.name || '',
      body.email || '',
      body.org || '',
      body.role || '',
      body.company || '',
      body.message || '',
      body.source || '',
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, note: 'Dayone lead sink. POST JSON to append a row.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
