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
/*  3. Venture Studio — qualifying intake (/studio#contact)              */
/* ==================================================================== */

export const STUDIO_ROLES = ['Founder', 'LP', 'GP or emerging manager', 'VC', 'PE'] as const
export type StudioRole = (typeof STUDIO_ROLES)[number]

/** One tailored question per role. `points` is the role-answer score (0-3). */
export const STUDIO_QUESTIONS: Record<
  StudioRole,
  { question: string; options: { label: string; points: number }[] }
> = {
  Founder: {
    question: 'What is stuck?',
    options: [
      { label: 'No technical team', points: 3 },
      { label: 'Need to ship in 90 days', points: 3 },
      { label: 'Team too slow', points: 2 },
      { label: 'Other', points: 1 },
    ],
  },
  LP: {
    question: 'What are you looking for?',
    options: [
      { label: 'Emerging managers', points: 2 },
      { label: 'Co-investments', points: 2 },
      { label: 'Direct deals', points: 2 },
    ],
  },
  'GP or emerging manager': {
    question: 'Biggest gap?',
    options: [
      { label: 'Finding LPs', points: 2 },
      { label: 'Deal flow', points: 2 },
      { label: 'Portfolio support', points: 3 },
      { label: 'Operations', points: 3 },
    ],
  },
  VC: {
    question: 'Where do your portfolio companies struggle?',
    options: [
      { label: 'Shipping', points: 3 },
      { label: 'Hiring', points: 2 },
      { label: 'AI', points: 3 },
      { label: 'Other', points: 1 },
    ],
  },
  PE: {
    question: 'Where do you need operating help?',
    options: [
      { label: 'Technology', points: 3 },
      { label: 'AI', points: 3 },
      { label: 'Margins', points: 2 },
      { label: 'Integration', points: 2 },
    ],
  },
}

export const STUDIO_START = [
  { label: 'This month', points: 3 },
  { label: 'Next month', points: 2 },
  { label: 'Next quarter', points: 1 },
] as const

/** Campaign + referrer attribution, captured client-side on page load. */
export type LeadAttribution = {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  referrer: string
  landing: string
}

export const EMPTY_ATTRIBUTION: LeadAttribution = {
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  referrer: '',
  landing: '',
}

export type StudioInput = LeadAttribution & {
  role: string
  answer: string
  win: string
  startWhen: string
  name: string
  email: string
  /** Country code + number, e.g. "+1 5551234567". */
  phone: string
  linkedin: string
  /** Honeypot — real users never fill this. */
  company_website: string
}

function parseAttribution(d: Record<string, unknown>): LeadAttribution {
  return {
    utm_source: str(d.utm_source, 200),
    utm_medium: str(d.utm_medium, 200),
    utm_campaign: str(d.utm_campaign, 200),
    utm_content: str(d.utm_content, 200),
    referrer: str(d.referrer, 500),
    landing: str(d.landing, 500),
  }
}

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'ymail.com', 'outlook.com',
  'hotmail.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me',
  'protonmail.com', 'gmx.com', 'mail.com', 'zoho.com', 'rediffmail.com',
])

const LINKEDIN_PROFILE_RE = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/]{3,}/i

/**
 * Lead score, 0-11:
 *   role answer 0-3 + 90-day answer 0-3 + start date 0-3
 *   + 1 for a company email domain + 1 for a LinkedIn profile URL.
 * Tier: Hot 8+, Warm 5-7, Cold below 5.
 */
export function scoreStudio(
  s: Pick<StudioInput, 'role' | 'answer' | 'win' | 'startWhen' | 'email' | 'linkedin'>,
) {
  const role = (STUDIO_QUESTIONS as Record<string, (typeof STUDIO_QUESTIONS)[StudioRole]>)[s.role]
  const rolePts = role?.options.find((o) => o.label === s.answer)?.points ?? 0

  // The 90-day answer: length shows effort, a number or a concrete verb shows a real target.
  const words = s.win.split(/\s+/).filter(Boolean).length
  let winPts = words >= 15 ? 2 : words >= 6 ? 1 : 0
  if (
    words >= 6 &&
    (/\d/.test(s.win) ||
      /\b(ship|launch|mvp|hire|raise|release|migrate|close|revenue|customers?)\b/i.test(s.win))
  ) {
    winPts += 1
  }
  winPts = Math.min(winPts, 3)

  const startPts = STUDIO_START.find((o) => o.label === s.startWhen)?.points ?? 0
  const domain = s.email.split('@')[1]?.toLowerCase() ?? ''
  const emailPts = domain && !FREE_EMAIL_DOMAINS.has(domain) ? 1 : 0
  const linkedinPts = LINKEDIN_PROFILE_RE.test(s.linkedin) ? 1 : 0

  const score = rolePts + winPts + startPts + emailPts + linkedinPts
  const tier = score >= 8 ? 'Hot' : score >= 5 ? 'Warm' : 'Cold'
  return {
    score,
    tier,
    breakdown: `role ${rolePts}/3, 90-day ${winPts}/3, start ${startPts}/3, email ${emailPts}/1, linkedin ${linkedinPts}/1`,
  }
}

function parseStudio(raw: unknown): StudioInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const s: StudioInput = {
    role: str(d.role, 100),
    answer: str(d.answer, 200),
    win: multiline(d.win, 2000),
    startWhen: str(d.startWhen, 100),
    name: str(d.name, 200),
    email: str(d.email, 320),
    phone: str(d.phone, 40),
    linkedin: str(d.linkedin, 300),
    company_website: str(d.company_website, 200),
    ...parseAttribution(d),
  }

  if (!(STUDIO_ROLES as readonly string[]).includes(s.role)) throw new Error('Please choose who you are.')
  if (!s.win) throw new Error('Please tell us what a win looks like in 90 days.')
  if (!s.startWhen) throw new Error('Please choose when you want to start.')
  if (!s.name) throw new Error('Please add your name.')
  if (!EMAIL_RE.test(s.email)) throw new Error('Please add a valid work email.')
  const digits = s.phone.replace(/\D/g, '').length
  if (digits < 8 || digits > 15) throw new Error('Please add a valid phone number.')

  return s
}

export const submitStudio = createServerFn({ method: 'POST' })
  .validator(parseStudio)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot

    const { score, tier, breakdown } = scoreStudio(data)
    const ok = await deliver(
      'studio_lead',
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin,
        role: data.role,
        answer: data.answer,
        win: data.win,
        startWhen: data.startWhen,
        score: String(score),
        tier,
        breakdown,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        referrer: data.referrer,
        landing: data.landing,
      },
      'dayoneventurepartners.com studio form',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })

/* Optional "Tell us more" follow-up, shown after the main form is in. */

export type StudioMoreInput = {
  email: string
  funding: string
  deciders: string
  company_website: string
}

function parseStudioMore(raw: unknown): StudioMoreInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const m: StudioMoreInput = {
    email: str(d.email, 320),
    funding: str(d.funding, 300),
    deciders: str(d.deciders, 500),
    company_website: str(d.company_website, 200),
  }
  if (!EMAIL_RE.test(m.email)) throw new Error('Missing email.')
  if (!m.funding && !m.deciders) throw new Error('Nothing to add.')
  return m
}

export const submitStudioMore = createServerFn({ method: 'POST' })
  .validator(parseStudioMore)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot
    const ok = await deliver(
      'studio_more',
      { email: data.email, funding: data.funding, deciders: data.deciders },
      'dayoneventurepartners.com studio tell-us-more',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })

/* ==================================================================== */
/*  4. Studio checklist — the lead-magnet email gate (/studio#checklist) */
/* ==================================================================== */

export type ChecklistInput = LeadAttribution & {
  email: string
  company_website: string
}

function parseChecklist(raw: unknown): ChecklistInput {
  const d = (raw ?? {}) as Record<string, unknown>
  const c: ChecklistInput = {
    email: str(d.email, 320),
    company_website: str(d.company_website, 200),
    ...parseAttribution(d),
  }
  if (!EMAIL_RE.test(c.email)) throw new Error('Please add a valid email.')
  return c
}

export const submitChecklist = createServerFn({ method: 'POST' })
  .validator(parseChecklist)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.company_website) return { ok: true } // honeypot

    const ok = await deliver(
      'checklist',
      {
        email: data.email,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        referrer: data.referrer,
        landing: data.landing,
      },
      'dayoneventurepartners.com studio checklist',
    )
    return ok ? { ok: true } : { ok: false, error: GENERIC_ERROR }
  })

/* ==================================================================== */
/*  5. Careers — candidates routed off the business-lead forms (/careers) */
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
