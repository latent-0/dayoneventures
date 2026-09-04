import { createServerFn } from '@tanstack/react-start'

/* ------------------------------------------------------------------ */
/*  Lead capture                                                       */
/*                                                                    */
/*  The contact form POSTs here. The handler runs server-side only,    */
/*  so the endpoint never reaches the browser. Each lead is sent to a  */
/*  Google Apps Script web app (LEAD_SHEET_URL) which appends a row to */
/*  the lead spreadsheet and emails a notification. See                */
/*  apps-script/Code.gs for the script and its setup.                  */
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

/* Deliver the lead to the Google Apps Script web app (Sheet + notification). */
async function deliver(data: LeadInput): Promise<boolean> {
  const url = process.env.LEAD_SHEET_URL
  if (!url) {
    console.error('[lead] LEAD_SHEET_URL is not set — cannot deliver the lead')
    return false
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script web apps 302 to googleusercontent.com; fetch follows it.
      redirect: 'follow',
      body: JSON.stringify({
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
    // The Apps Script doPost returns {"ok":true} as JSON on a successful append.
    if (res.ok && /"ok"\s*:\s*true/.test(body)) return true
    console.error('[lead] delivery failed', res.status, body.slice(0, 500))
    return false
  } catch (err) {
    console.error('[lead] delivery error', err)
    return false
  }
}

export const submitLead = createServerFn({ method: 'POST' })
  .validator(parseLead)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Bot filled the honeypot — accept silently, deliver nothing.
    if (data.company_website) return { ok: true }

    const ok = await deliver(data)
    if (ok) return { ok: true }

    return {
      ok: false,
      error: 'Something went wrong sending your message. Please email us directly.',
    }
  })
