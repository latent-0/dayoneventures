import { createServerFn } from '@tanstack/react-start'

/* ------------------------------------------------------------------ */
/*  Inbound submissions                                                */
/*                                                                    */
/*  Every form on the site (contact, project intake, careers) POSTs    */
/*  to the same Google Apps Script web app (LEAD_SHEET_URL). The       */
/*  handler runs server-side only, so the endpoint never reaches the   */
/*  browser. A `type` field routes each submission to its own tab in   */
/*  the one spreadsheet — Leads / Project enquiries / Applications —   */
/*  so there is a single link to monitor everything. See               */
/*  apps-script/Code.gs for the script and its setup.                  */
/* ------------------------------------------------------------------ */

export type SubmitResult = { ok: true } | { ok: false; error: string }

const str = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '').replace(/\s+/g, ' ').trim().slice(0, max)

const multiline = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '').replace(/\r\n/g, '\n').trim().slice(0, max)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Delivers one submission to the Google Apps Script web app
   (Sheet tab + email notification). `type` selects the tab. */
async function deliver(
  type: string,
  fields: Record<string, string>,
  source: string,
): Promise<boolean> {
  const url = process.env.LEAD_SHEET_URL
  if (!url) {
    console.error('[submit] LEAD_SHEET_URL is not set — cannot deliver the submission')
    return false
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script web apps 302 to googleusercontent.com; fetch follows it.
      redirect: 'follow',
      body: JSON.stringify({
        type,
        submittedAt: new Date().toISOString(),
        source,
        ...fields,
      }),
    })

    const body = await res.text().catch(() => '')
    // The Apps Script doPost returns {"ok":true} as JSON on a successful append.
    if (res.ok && /"ok"\s*:\s*true/.test(body)) return true
    console.error('[submit] delivery failed', res.status, body.slice(0, 500))
    return false
  } catch (err) {
    console.error('[submit] delivery error', err)
    return false
  }
}

const GENERIC_ERROR = 'Something went wrong sending your message. Please email us directly.'

/* ==================================================================== */
/*  1. Contact form — PE / operating-partner enquiries (/contact)       */
/* ==================================================================== */

export const LEAD_ROLES = [
  'PE sponsor / fund',
  'Independent sponsor',
  'Founder / owner',
  'Advisor / intermediary',
  'Other',
] as const

// Kept out of LEAD_ROLES on purpose — selecting it redirects to /careers
// client-side rather than submitting as a business lead.
export const CAREER_ROLE = 'Looking for a job at Dayone'

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

export const submitLead = createServerFn({ method: 'POST' })
  .validator(parseLead)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot

    const ok = await deliver(
      'lead',
      {
        name: data.name,
        email: data.email,
        org: data.org,
        role: data.role,
        company: data.company,
        message: data.message,
      },
      'dayoneventurepartners.com contact form',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })

/* ==================================================================== */
/*  2. Project intake — product / engineering engagements (/start-a-project) */
/* ==================================================================== */

export type ProjectInput = {
  industry: string
  industryOther: string
  goal: string
  building: string[]
  buildingOther: string
  details: string
  budget: string
  budgetOther: string
  startWhen: string
  deliverWhen: string
  funding: string
  engagement: string[]
  engagementOther: string
  name: string
  email: string
  phone: string
  company_website: string
}

const resolveOther = (choice: string, other: string) => (choice === 'Other' ? other || 'Other' : choice)

function parseProject(raw: unknown): ProjectInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 12) : [])

  const p: ProjectInput = {
    industry: str(d.industry, 80),
    industryOther: str(d.industryOther, 120),
    goal: str(d.goal, 80),
    building: arr(d.building).map((s) => str(s, 80)),
    buildingOther: str(d.buildingOther, 120),
    details: multiline(d.details, 3000),
    budget: str(d.budget, 80),
    budgetOther: str(d.budgetOther, 80),
    startWhen: str(d.startWhen, 80),
    deliverWhen: str(d.deliverWhen, 80),
    funding: str(d.funding, 80),
    engagement: arr(d.engagement).map((s) => str(s, 80)),
    engagementOther: str(d.engagementOther, 120),
    name: str(d.name, 200),
    email: str(d.email, 320),
    phone: str(d.phone, 60),
    company_website: str(d.company_website, 200),
  }

  if (!p.industry) throw new Error('Please choose an industry.')
  if (!p.goal) throw new Error('Please choose one.')
  if (p.building.length === 0) throw new Error('Please choose at least one.')
  if (!p.budget) throw new Error('Please choose a budget range.')
  if (!p.startWhen) throw new Error('Please choose a start timeline.')
  if (!p.deliverWhen) throw new Error('Please choose a delivery timeline.')
  if (!p.funding) throw new Error('Please choose one.')
  if (p.engagement.length === 0) throw new Error('Please choose at least one engagement model.')
  if (!p.name) throw new Error('Please add your name.')
  if (!EMAIL_RE.test(p.email)) throw new Error('Please add a valid email address.')

  return p
}

export const submitProject = createServerFn({ method: 'POST' })
  .validator(parseProject)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot

    const ok = await deliver(
      'project',
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        industry: resolveOther(data.industry, data.industryOther),
        goal: data.goal,
        building: data.building
          .map((b) => resolveOther(b, data.buildingOther))
          .join(', '),
        details: data.details,
        budget: resolveOther(data.budget, data.budgetOther),
        startWhen: data.startWhen,
        deliverWhen: data.deliverWhen,
        funding: data.funding,
        engagement: data.engagement
          .map((eng) => resolveOther(eng, data.engagementOther))
          .join(', '),
      },
      'dayoneventurepartners.com start-a-project form',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })

/* ==================================================================== */
/*  3. Careers — candidates routed off the business-lead forms (/careers) */
/* ==================================================================== */

export type ApplicationInput = {
  name: string
  email: string
  area: string
  link: string
  message: string
  company_website: string
}

function parseApplication(raw: unknown): ApplicationInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const a: ApplicationInput = {
    name: str(d.name, 200),
    email: str(d.email, 320),
    area: str(d.area, 120),
    link: str(d.link, 300),
    message: multiline(d.message, 3000),
    company_website: str(d.company_website, 200),
  }

  if (!a.name) throw new Error('Please add your name.')
  if (!EMAIL_RE.test(a.email)) throw new Error('Please add a valid email address.')

  return a
}

export const submitApplication = createServerFn({ method: 'POST' })
  .validator(parseApplication)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot

    const ok = await deliver(
      'application',
      {
        name: data.name,
        email: data.email,
        area: data.area,
        link: data.link,
        message: data.message,
      },
      'dayoneventurepartners.com careers form',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })
