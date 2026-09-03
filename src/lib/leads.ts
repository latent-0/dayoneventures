import { createServerFn } from '@tanstack/react-start'

/* ------------------------------------------------------------------ */
/*  Lead capture                                                       */
/*                                                                    */
/*  The contact form POSTs here. The handler runs server-side only,   */
/*  so the Resend API key never reaches the browser. Leads are        */
/*  emailed to LEAD_TO_EMAIL with a copy to LEAD_CC_EMAIL, and the    */
/*  sender's address is set as reply-to so a reply goes straight to   */
/*  them.                                                             */
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

const DEFAULTS = {
  to: 'contact@dayoneventurepartners.com',
  cc: 'kim@day1tech.com',
  from: 'Dayone Ventures <website@dayoneventurepartners.com>',
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

export const submitLead = createServerFn({ method: 'POST' })
  .validator(parseLead)
  .handler(async ({ data }): Promise<LeadResult> => {
    // Bot filled the honeypot — accept silently, send nothing.
    if (data.company_website) return { ok: true }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.LEAD_TO_EMAIL || DEFAULTS.to
    const cc = process.env.LEAD_CC_EMAIL || DEFAULTS.cc
    const from = process.env.LEAD_FROM_EMAIL || DEFAULTS.from

    if (!apiKey) {
      console.error('[lead] RESEND_API_KEY is not set — cannot send lead email')
      return {
        ok: false,
        error: 'The form is not fully configured yet. Please email us directly for now.',
      }
    }

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

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error('[lead] Resend responded', res.status, body)
        return {
          ok: false,
          error: 'Something went wrong sending your message. Please email us directly.',
        }
      }
    } catch (err) {
      console.error('[lead] send failed', err)
      return {
        ok: false,
        error: 'Something went wrong sending your message. Please email us directly.',
      }
    }

    return { ok: true }
  })
