import { createServerFn } from '@tanstack/react-start'

/* ------------------------------------------------------------------ */
/*  Lead capture                                                       */
/*                                                                    */
/*  The contact form POSTs here. The handler runs server-side only,    */
/*  so no keys or endpoints reach the browser. A lead can be           */
/*  delivered to two places, each turned on by its own env var:        */
/*                                                                     */
/*   • Google Sheet  — set LEAD_SHEET_URL to an Apps Script web-app    */
/*     URL (see apps-script/Code.gs). Optional LEAD_SHEET_TOKEN adds   */
/*     a shared secret the script checks.                              */
/*   • Email (Resend) — set RESEND_API_KEY. Sends to LEAD_TO_EMAIL     */
/*     with a copy to LEAD_CC_EMAIL, reply-to the sender.              */
/*                                                                     */
/*  At least one must be configured. The submission succeeds if any    */
/*  configured channel accepts it.                                     */
/* ------------------------------------------------------------------ */

export const LEAD_ROLES = [
  'PE sponsor / fund',
  'Independent sponsor',
  'Founder / owner',
  'Advisor / intermediary',
  'Other',
] as const

export type LeadInput = {
  name: string
  email: string
  org: string
  role: string
  company: string
  message: string
  /** Honeypot — real users never fill this. */
  company_website: string
}

export type LeadResult = { ok: true } | { ok: false; error: string }

const EMAIL_DEFAULTS = {
  to: 'contact@dayoneventurepartners.com',
  cc: 'kim@day1tech.com',
  from: 'Dayone Ventures <contact@dayoneventurepartners.com>',
}

const str = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '').replace(/\s+/g, ' ').trim().slice(0, max)

const multiline = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '').replace(/\r\n/g, '\n').trim().slice(0, max)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseLead(raw: unknown): LeadInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const lead: LeadInput = {
    name: str(d.name, 200),
    email: str(d.email, 320),
    org: str(d.org, 200),
    role: str(d.role, 100),
    company: str(d.company, 200),
    message: multiline(d.message, 5000),
    company_website: str(d.company_website, 200),
  }

  if (!lead.name) throw new Error('Please add your name.')
  if (!EMAIL_RE.test(lead.email)) throw new Error('Please add a valid email address.')
  if (!lead.message) throw new Error('Please add a short note about what you are seeing.')

  return lead
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* ---- channel: Google Sheet via Apps Script web app ---- */
async function appendToSheet(data: LeadInput): Promise<boolean> {
  const url = process.env.LEAD_SHEET_URL
  if (!url) return false

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script web apps 302 to googleusercontent.com; fetch follows it.
      redirect: 'follow',
      body: JSON.stringify({
        token: process.env.LEAD_SHEET_TOKEN || '',
        submittedAt: new Date().toISOString(),
        name: data.name,
        email: data.email,
        org: data.org,
        role: data.role,
        company: data.company,
        message: data.message,
        source: 'dayoneventurepartners.com contact form',
      }),
    })

    const body = await res.text().catch(() => '')
    // The script returns {"ok":true}; treat a 2xx without an explicit error as success.
    if (res.ok && !/"ok"\s*:\s*false/.test(body)) return true
    console.error('[lead] sheet append failed', res.status, body)
    return false
  } catch (err) {
    console.error('[lead] sheet append error', err)
    return false
  }
}

/* ---- channel: email via Resend ---- */
async function sendEmail(data: LeadInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const to = process.env.LEAD_TO_EMAIL || EMAIL_DEFAULTS.to
  const cc = process.env.LEAD_CC_EMAIL || EMAIL_DEFAULTS.cc
  const from = process.env.LEAD_FROM_EMAIL || EMAIL_DEFAULTS.from

  const headline = data.org || data.company || data.name
  const subject = `New site enquiry — ${headline}`
  const rows: Array<[string, string]> = [
    ['Name', data.name],
    ['Email', data.email],
    ['Organisation', data.org || '—'],
    ['Role', data.role || '—'],
    ['Company in question', data.company || '—'],
  ]
  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    data.message,
    '',
    '— Sent from the dayoneventurepartners.com contact form',
  ].join('\n')
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#16130c">
      <h2 style="margin:0 0 16px;font-size:17px">New site enquiry</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#6b6350;vertical-align:top">${escapeHtml(
                k,
              )}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:16px 0 4px;color:#6b6350">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #e7e2d6" />
      <p style="margin:0;color:#9a9384;font-size:13px">Sent from the dayoneventurepartners.com contact form. Reply directly to reach ${escapeHtml(
        data.name,
      )}.</p>
    </div>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        cc: cc ? [cc] : undefined,
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    })
    if (res.ok) return true
    const body = await res.text().catch(() => '')
    console.error('[lead] Resend responded', res.status, body)
    return false
  } catch (err) {
    console.error('[lead] email send error', err)
    return false
  }
}

export const submitLead = createServerFn({ method: 'POST' })
  .validator(parseLead)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Bot filled the honeypot — accept silently, deliver nothing.
    if (data.company_website) return { ok: true }

    const channels: Array<Promise<boolean>> = []
    if (process.env.LEAD_SHEET_URL) channels.push(appendToSheet(data))
    if (process.env.RESEND_API_KEY) channels.push(sendEmail(data))

    if (channels.length === 0) {
      console.error(
        '[lead] no delivery channel configured — set LEAD_SHEET_URL and/or RESEND_API_KEY',
      )
      return {
        ok: false,
        error: 'The form is not fully configured yet. Please email us directly for now.',
      }
    }

    const results = await Promise.all(channels)
    if (results.some(Boolean)) return { ok: true }

    return {
      ok: false,
      error: 'Something went wrong sending your message. Please email us directly.',
    }
  })
