/**
 * Dayone Ventures — contact-form lead sink.
 *
 * Deploy this as a Google Apps Script Web App bound to the spreadsheet that
 * should collect leads. The site's server function POSTs one JSON object per
 * submission; this appends a row AND emails a notification.
 *
 * Setup:
 *   1. Open the target Google Sheet → Extensions → Apps Script.
 *      IMPORTANT: open it from the Sheet owned by / signed in as
 *      contact@dayoneventurepartners.com, because the notification email is
 *      sent FROM whichever Google account runs the script.
 *   2. Replace the default file with this code. Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the /exec URL → set it as the site's LEAD_SHEET_URL env var.
 *      On first deploy, approve the Sheets + Gmail/Send-email permissions.
 *   4. Re-deploy (Manage deployments → edit → Version: New version) after any edit.
 */

var SHEET_NAME = 'Leads';
var HEADERS = ['Submitted at', 'Name', 'Email', 'Organisation', 'Role', 'Company in question', 'Message', 'Source'];

// --- Notification email -----------------------------------------------------
var SEND_EMAIL = true;                                  // set false to log to the sheet only
var NOTIFY_TO  = 'contact@dayoneventurepartners.com';   // where the notification lands
var NOTIFY_CC  = 'kim@day1tech.com';                    // '' for no cc
// The FROM address is the Google account running the script. To make it read
// as contact@dayoneventurepartners.com, run/deploy the script from that
// account (or add it as a "Send mail as" alias in that account's Gmail).

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

    var result = { ok: true, sheet: ss.getName() };

    if (SEND_EMAIL) {
      try {
        notify_(body);
        result.mailed = true;
      } catch (mailErr) {
        // A mail failure must not fail the capture — the row is already saved.
        result.mailed = false;
        result.mailError = String(mailErr);
        console.error('notify failed: ' + mailErr);
      }
    }

    return json(result);
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function notify_(body) {
  var headline = body.org || body.company || body.name || 'new enquiry';
  var lines = [
    'Name:         ' + (body.name || ''),
    'Email:        ' + (body.email || ''),
    'Organisation: ' + (body.org || '—'),
    'Role:         ' + (body.role || '—'),
    'Company:      ' + (body.company || '—'),
    '',
    'Message:',
    (body.message || ''),
    '',
    '— Sent from the dayoneventurepartners.com contact form',
  ];

  var opts = {
    to: NOTIFY_TO,
    subject: 'New site enquiry — ' + headline,
    body: lines.join('\n'),
    name: 'Dayone Ventures Website',
    replyTo: body.email || NOTIFY_TO,
  };
  if (NOTIFY_CC) opts.cc = NOTIFY_CC;

  // Use contact@ as the From when the account has it as a verified alias;
  // fall back to the account's default address if it doesn't.
  try {
    opts.from = NOTIFY_TO;
    MailApp.sendEmail(opts);
  } catch (fromErr) {
    delete opts.from;
    MailApp.sendEmail(opts);
  }
}

/**
 * Run this ONCE from the Apps Script editor (Run ▸ authorize) after adding the
 * email code. It forces the consent screen so the "send email as you" scope is
 * granted, then sends one test message. After it succeeds, redeploy a new
 * version so the web app picks up the new permission.
 */
function authorize() {
  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'Apps Script authorized',
    body: 'The lead sink can now send email notifications.',
    name: 'Dayone Ventures Website',
  });
}

function doGet() {
  return json({ ok: true, note: 'Dayone lead sink. POST JSON to append a row.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
