/**
 * Dayone Ventures — inbound submission sink.
 *
 * Deploy this as a Google Apps Script Web App bound to the spreadsheet that
 * should collect everything. The site's server functions POST one JSON
 * object per submission, tagged with a `type`. This appends a row to the
 * matching tab AND emails a notification — one spreadsheet, one link, every
 * inbound lead / project enquiry / application in one place.
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

// --- Sheet tabs, one per submission type ------------------------------------
var TABS = {
  lead: {
    sheetName: 'Leads',
    headers: ['Submitted at', 'Name', 'Email', 'Organisation', 'Role', 'Company in question', 'Message', 'Source'],
    fields: ['submittedAt', 'name', 'email', 'org', 'role', 'company', 'message', 'source'],
  },
  project: {
    sheetName: 'Project enquiries',
    headers: [
      'Submitted at', 'Name', 'Email', 'Phone', 'Industry', 'Goal', 'Building',
      'Details', 'Budget', 'Start', 'Delivery', 'Funding', 'Engagement model', 'Source',
    ],
    fields: [
      'submittedAt', 'name', 'email', 'phone', 'industry', 'goal', 'building',
      'details', 'budget', 'startWhen', 'deliverWhen', 'funding', 'engagement', 'source',
    ],
  },
  application: {
    sheetName: 'Applications',
    headers: ['Submitted at', 'Name', 'Email', 'Area of interest', 'Resume / LinkedIn', 'Message', 'Source'],
    fields: ['submittedAt', 'name', 'email', 'area', 'link', 'message', 'source'],
  },
};

// --- Notification email -----------------------------------------------------
var SEND_EMAIL = true;                                  // set false to log to the sheet only
var NOTIFY_TO  = 'contact@dayoneventurepartners.com';   // where the notification lands
var NOTIFY_CC  = 'kim@day1tech.com';                    // '' for no cc
// The FROM address is the Google account running the script. To make it read
// as contact@dayoneventurepartners.com, run/deploy the script from that
// account (or add it as a "Send mail as" alias in that account's Gmail).

var SUBJECTS = {
  lead: 'New site enquiry',
  project: 'New project enquiry',
  application: 'New application',
};

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var type = TABS[body.type] ? body.type : 'lead';
    var tab = TABS[type];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(tab.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(tab.sheetName);
      sheet.appendRow(tab.headers);
      sheet.getRange(1, 1, 1, tab.headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var row = tab.fields.map(function (key) {
      if (key === 'submittedAt') return body.submittedAt || new Date().toISOString();
      return body[key] || '';
    });
    sheet.appendRow(row);

    var result = { ok: true, sheet: ss.getName(), tab: tab.sheetName };

    if (SEND_EMAIL) {
      try {
        notify_(type, body);
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

function notify_(type, body) {
  var headline = body.org || body.company || body.name || 'new submission';
  var tab = TABS[type];
  var lines = tab.fields
    .filter(function (k) { return k !== 'submittedAt' && k !== 'source'; })
    .map(function (k) { return k + ': ' + (body[k] || '—'); });
  lines.push('', '— Submitted via ' + (body.source || 'dayoneventurepartners.com'));

  var opts = {
    to: NOTIFY_TO,
    subject: (SUBJECTS[type] || 'New submission') + ' — ' + headline,
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
    body: 'The inbound sink can now send email notifications.',
    name: 'Dayone Ventures Website',
  });
}

function doGet() {
  return json({ ok: true, note: 'Dayone inbound sink. POST JSON with a `type` to append a row.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
