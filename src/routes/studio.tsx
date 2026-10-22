import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { HorizonScroll } from '../components/HorizonScroll'
import { seo } from '../lib/seo'
import {
  submitStudio,
  submitChecklist,
  STUDIO_ROLES,
  STUDIO_STAGES,
  STUDIO_FUNDING,
  STUDIO_CTO,
  EMPTY_ATTRIBUTION,
  type StudioInput,
  type LeadAttribution,
} from '../lib/leads'

export const Route = createFileRoute('/studio')({
  head: () =>
    seo({
      path: '/studio',
      title:
        'Venture Studio: Dedicated Product Teams for Funded Founders · Dayone Ventures',
      description:
        'Dayone Venture Studio gives funded founders a dedicated product team: a product manager, engineers, a designer and a tester, working only on your product, month to month, backed by the Dayone group.',
      keywords:
        'venture studio, dedicated product team, startup dev team, hire developers for startup, non-technical founder, MVP development, healthtech development, fintech development, product management team',
    }),
  component: StudioPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'
const CHECKLIST_PDF = '/DayOne_Studio_Lead_Magnet_Dev_Team_Checklist.pdf'

/* ---------------------------------------------------------------- */
/*  Content                                                          */
/* ---------------------------------------------------------------- */

const BEATS = [
  { chapter: 'The problem', text: 'A funded founder with a real idea and no technical team.' },
  { chapter: 'The trap', text: 'Hiring slowly, or hiring the wrong people, burns the runway.' },
  { chapter: 'The truth', text: 'The product is the company. Speed to a working product is the whole game.' },
  { chapter: 'The difference', text: 'So we do not hand you a plan. We hand you a team.' },
  { chapter: 'The promise', text: 'From dayone, we build with you.', accent: true },
]

const TEAM = [
  { k: 'Product manager', v: 'Turns your ideas into a ranked list with reasons. Runs the weekly demo. Your single point of contact.' },
  { k: 'Engineers', v: 'Build, ship and document. The code lives in your repository, in your name, from the first day.' },
  { k: 'Designer', v: 'Screens, flows and a design system that keeps the product consistent. Included in the one-engineer pod.' },
  { k: 'Tester', v: 'Owns quality, separate from the people writing the code.' },
  { k: 'Expert network', v: 'Access to a network of 500+ subject-matter experts worldwide, in any industry, when your product needs a specialist view.' },
]

const PODS = [
  { k: 'Pod A', v: '1 engineer, 1 designer, 1 tester, 1 product manager. Best when design matters from the start.' },
  { k: 'Pod B', v: '2 engineers, 1 tester, 1 product manager. Best when the design is already clear.' },
]

const STEPS = [
  {
    n: '01',
    title: 'Scope',
    output: 'The one-page plan',
    body: 'A free call. We learn the problem, the users and the budget, then send a one-page plan with a ranked list of what to build first. No audit, no slide deck. Whether you work with us afterwards is up to you.',
  },
  {
    n: '02',
    title: 'Build',
    output: 'A working first slice',
    body: 'The pod starts one week after you agree. You can see work in progress day to day in shared tools such as Basecamp. Within the first month you have a deployed, testable slice of your product on a link you can open, plus a walkthrough.',
  },
  {
    n: '03',
    title: 'Ship',
    output: 'A product users can use',
    body: 'Day-to-day visibility in Basecamp, a weekly demo, a tester on every release, and a short written update each Friday. You change your mind, we re-rank, and nothing is lost in translation.',
  },
  {
    n: '04',
    title: 'Own',
    output: 'A product you control',
    body: 'Code, cloud accounts and designs are yours. If you stop working with us, we hand over documents and a walkthrough inside the notice period.',
  },
]

const FIT = [
  { k: 'Funded', v: 'Seed or pre-seed with enough runway to build for at least six months, and open to sharing upside.' },
  { k: 'Building a product', v: 'Software, app, platform or data product. Healthtech, biotech and fintech are areas we know well.' },
  { k: 'Domain expert, or founder-led', v: 'You know your field: a doctor reshaping the patient journey, a CPA or CFA rebuilding financial workflows. You bring the domain, we bring the product team.' },
]

const PROOF = [
  { k: 'Since 2016', v: 'Building products' },
  { k: '100+', v: 'Production platforms delivered' },
  { k: '10+', v: 'Countries' },
  { k: '70%', v: 'Repeat business' },
  { k: '500,000+', v: 'Hours of code delivered' },
]

const BUILT = [
  { field: 'Fintech', place: 'New York', v: 'A micro-investing app that went up against the best-funded names in consumer investing, then was acquired by an Australian consumer-finance company.' },
  { field: 'Investing & money management', place: 'India', v: 'A platform for personal investing and money management.' },
  { field: 'Trading', place: 'Dallas', v: 'A marketplace that matches investors with automated trading strategies, built for a seed-stage startup.' },
  { field: 'AI & language', place: 'Web & mobile', v: 'A paraphrasing platform built from scratch, with machine-learning models for meaning and a plagiarism check.' },
  { field: 'Computer vision', place: 'Manufacturing', v: 'An app and admin panel that lets inspectors photograph factory panels and flags missing parts and wrong fittings before shipment.' },
  { field: 'Energy', place: 'Germany', v: 'The software platform for a Berlin clean-energy company that lets utilities launch and bill new green energy products. It has since raised venture funding.' },
  { field: 'Health & wellness', place: 'Mobile', v: 'A meditation and inner-wellbeing app, built with its founder.' },
  { field: 'Hospitality & food-tech', place: 'Gulf', v: 'A restaurant reservations platform with consumer iOS and Android apps, an admin portal and a booking desk for hosts.' },
]

const ALSO_BUILT =
  'Also built: music technology in Canada, travel and payments in the US, education and corporate training in London, rewards and loyalty in Singapore and India, e-commerce and lending in Germany, air-quality sensors and hardware integration for a European industrial company, wi-fi as a platform in Singapore, and parking and payments in Greece.'

const FAQ = [
  { q: 'What is Dayone Venture Studio?', a: 'A dedicated product team for funded founders. A product manager, engineers, a designer and a tester work only on your product, on a month-to-month basis.' },
  { q: 'What does the first call involve?', a: 'A free scoping call. We learn what you are building, who it is for and what you can spend. You receive a one-page plan afterwards. No audit, no pitch.' },
  { q: 'Who is on the team?', a: 'Four people: either one engineer, one designer, one tester and one product manager, or two engineers, one tester and one product manager.' },
  { q: 'Who makes the technical decisions if I have no CTO?', a: 'The pod lead engineer proposes, the product manager ties it to your goals, and you approve anything that changes cost, timeline or scope. A network of 500+ subject-matter experts worldwide is on hand when you need specialist input.' },
  { q: 'What do I own?', a: 'The code, cloud accounts and designs are yours from the first day.' },
  { q: 'How long is the commitment?', a: 'Month to month.' },
  { q: 'Is equity involved?', a: 'Often, yes. The studio lowers your cash cost and shares the upside. Depending on the founder, that is less cash plus equity, less cash plus a revenue share, or less cash plus an investment from us and a profit share. We agree the structure on the scoping call.' },
  { q: 'What will I see after the first month?', a: 'You can watch work happen day to day in Basecamp. Within the first month you have a deployed, working first slice of your product that you can open and test, with a walkthrough and a ranked plan for month two.' },
  { q: 'How fast can a team start?', a: 'One week after you agree.' },
  { q: 'Where is the team based?', a: 'Delivery teams in India and the United States.' },
  { q: 'What does it cost?', a: 'A team like this normally costs well above what an early founder can spend. We lower the monthly cash cost and share the upside instead. We give the figure on the scoping call, so you hear it with the full picture.' },
]

/* ---------------------------------------------------------------- */
/*  Conversion tracking                                              */
/*  Guarded: fires Google Ads / LinkedIn only if the global exists.  */
/*  Never fires on page view. The team wires the real IDs + labels   */
/*  into the gtag / lintrk snippets (see QA checklist in the brief). */
/* ---------------------------------------------------------------- */

function fireConversion(label: 'studio_lead' | 'checklist_download') {
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void
    lintrk?: (...a: unknown[]) => void
  }
  try {
    w.gtag?.('event', 'conversion', { event_category: 'studio', event_label: label })
  } catch {
    /* no-op */
  }
  try {
    w.lintrk?.('track', { conversion_label: label })
  } catch {
    /* no-op */
  }
  try {
    window.dispatchEvent(new CustomEvent('dayone:conversion', { detail: { label } }))
  } catch {
    /* no-op */
  }
}

/** Reads UTM params, referrer and landing URL once on mount. */
function useAttribution(): LeadAttribution {
  const [attr, setAttr] = useState<LeadAttribution>(EMPTY_ATTRIBUTION)
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      setAttr({
        utm_source: p.get('utm_source') ?? '',
        utm_medium: p.get('utm_medium') ?? '',
        utm_campaign: p.get('utm_campaign') ?? '',
        utm_content: p.get('utm_content') ?? '',
        referrer: document.referrer ?? '',
        landing: window.location.href ?? '',
      })
    } catch {
      /* no-op */
    }
  }, [])
  return attr
}

/* ---------------------------------------------------------------- */
/*  Page                                                            */
/* ---------------------------------------------------------------- */

function StudioPage() {
  const attribution = useAttribution()

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.dayoneventurepartners.com/studio#service',
    name: 'Dayone Venture Studio',
    serviceType: 'Dedicated product teams for funded founders',
    slogan: 'Your product team. From dayone.',
    description:
      'Dayone Venture Studio provides dedicated, month-to-month product teams to funded startup founders, backed by the Dayone group of technology companies.',
    provider: { '@id': 'https://www.dayoneventurepartners.com/#organization' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    audience: { '@type': 'Audience', audienceType: 'Funded startup founders' },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.dayoneventurepartners.com/studio#faq',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <StudioHero />
      <HorizonScroll beats={BEATS} />
      <WhatYouGet />
      <HowItWorks />
      <WhoItsFor />
      <WhyDayone />
      <Checklist attribution={attribution} />
      <Faq />
      <ContactForm attribution={attribution} />
      <CtaBand />
    </>
  )
}

/* ---------------------------------------------------------------- */
/*  Hero                                                            */
/* ---------------------------------------------------------------- */

function StudioHero() {
  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-orange animate-blob" style={{ width: 620, height: 620, left: '-8%', top: '6%', opacity: 0.4 }} />
        <div className="blob blob-amber animate-blob" style={{ width: 480, height: 480, right: '-4%', top: '-14%', opacity: 0.28, animationDelay: '5s' }} />
      </div>
      <Container className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
        <Reveal>
          <Eyebrow className="eyebrow-light">Venture studio · Dedicated product teams</Eyebrow>
          <h1 className="text-display-xl mt-6 max-w-4xl text-canvas">
            Your product team. From dayone.
          </h1>
          <p className="text-lead mt-8 max-w-2xl text-canvas/70">
            A product manager, engineers, a designer and a tester, working only
            on your product. Month to month. Working demos every week.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn btn-light arrow-link">
              Book a free scoping call <span className="arrow">→</span>
            </a>
            <a href="#checklist" className="btn btn-ghost-light">
              Get the 12-question checklist
            </a>
          </div>
          <p className="mt-6 font-sans text-[0.85rem] text-canvas/45">
            Backed by the Dayone group: 100+ production platforms delivered.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  What you get                                                    */
/* ---------------------------------------------------------------- */

function WhatYouGet() {
  return (
    <section className="border-t border-line bg-canvas">
      <Container className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>What you get</Eyebrow>
            <h2 className="text-display-lg mt-6">A team that is yours, not rented.</h2>
            <p className="text-lead mt-6 text-ink-60">
              One dedicated pod, scoped to your product. It works the way an
              in-house team would, without the hiring, the payroll or the delay.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((t, i) => (
            <Reveal key={t.k} delay={i * 60} className="bg-paper">
              <div className="h-full p-7 transition-colors hover:bg-canvas-2">
                <h3 className="font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 500 }}>
                  {t.k}
                </h3>
                <p className="mt-3 font-sans text-[0.96rem] leading-relaxed text-ink-60">{t.v}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={TEAM.length * 60} className="bg-canvas-2">
            <div className="flex h-full flex-col justify-center p-7">
              <p className="eyebrow">Two pod shapes</p>
              <ul className="mt-4 space-y-4">
                {PODS.map((p) => (
                  <li key={p.k}>
                    <span className="font-display text-ink" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                      {p.k}.
                    </span>{' '}
                    <span className="font-sans text-[0.92rem] leading-relaxed text-ink-60">{p.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 max-w-2xl font-sans text-[1.02rem] leading-relaxed text-ink-60">
            Four people, working only on your product, plus an expert network
            behind them. You follow the work day to day in shared tools such as
            Basecamp.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  How it works                                                    */
/* ---------------------------------------------------------------- */

function HowItWorks() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-display-lg mt-6">Four steps. One working product.</h2>
          </Reveal>
        </div>
        <div className="mt-14 space-y-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <div className="grid gap-5 rounded-2xl border border-line bg-paper p-7 sm:p-9 md:grid-cols-12 md:items-start">
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.85rem] text-gold-deep">{s.n}</span>
                    <h3 className="font-display text-ink" style={{ fontSize: 'clamp(1.6rem,2.4vw,2.1rem)', fontWeight: 500 }}>
                      {s.title}
                    </h3>
                  </div>
                  <span
                    className="mt-4 inline-block rounded-full border border-line-strong px-3 py-1.5 font-sans text-gold-deep"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    Output · {s.output}
                  </span>
                </div>
                <p className="font-sans text-[1rem] leading-relaxed text-ink-60 md:col-span-8">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Who it is for                                                   */
/* ---------------------------------------------------------------- */

function WhoItsFor() {
  return (
    <section className="border-t border-line bg-canvas">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>Who it is for</Eyebrow>
              <h2 className="text-display-md mt-6">A narrow offer, run deep.</h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                We work with a small number of founders at a time, so the team
                can give each one full attention.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {FIT.map((f, i) => (
                <Reveal key={f.k} delay={i * 80}>
                  <div className="py-7">
                    <h3 className="font-display text-ink" style={{ fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 500 }}>
                      {f.k}
                    </h3>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">{f.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={240}>
              <p className="mt-8 font-sans text-[0.95rem] leading-relaxed text-ink-45">
                Who it is not for: projects that need a fixed price for an
                undefined product, regulated work that needs certifications we do
                not hold, or teams who want to manage a team by the hour.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Why Dayone + proof + where we have built                        */
/* ---------------------------------------------------------------- */

function WhyDayone() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-night text-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-orange animate-blob" style={{ width: 540, height: 540, right: '-6%', top: '-16%', opacity: 0.32 }} />
      </div>
      <Container className="relative py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <Eyebrow className="eyebrow-light">Why Dayone</Eyebrow>
              <h2 className="text-display-md mt-6 text-canvas">The Dayone group, behind your team.</h2>
              <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                Your pod is backed by Dayone Technologies, a technology operating
                partner building products since 2016, and by DayoneX, our
                enterprise AI and platform group, with engineering teams in India
                and the United States. That depth is what lets a four-person team
                move fast and not stall.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-3">
              {PROOF.map((p, i) => (
                <Reveal key={p.k} delay={i * 60} className="bg-night-2">
                  <div className="p-6">
                    <div className="font-display text-gold-soft" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 600 }}>
                      {p.k}
                    </div>
                    <p className="mt-2 font-sans text-[0.82rem] leading-relaxed text-canvas/55">{p.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Where we have built */}
        <div className="mt-20">
          <Reveal>
            <Eyebrow className="eyebrow-light">Where we have built</Eyebrow>
            <h3 className="mt-5 max-w-2xl font-display text-canvas" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)', fontWeight: 500 }}>
              Products for founders, across fields and places.
            </h3>
            <p className="mt-4 max-w-2xl font-sans text-[0.95rem] leading-relaxed text-canvas/55">
              Domains and places only. No client names, logos or figures.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-2 lg:grid-cols-4">
            {BUILT.map((b, i) => (
              <Reveal key={b.field + b.place} delay={(i % 4) * 60} className="bg-night-2">
                <div className="h-full p-6">
                  <p className="font-sans text-gold-soft" style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {b.field} · {b.place}
                  </p>
                  <p className="mt-3 font-sans text-[0.9rem] leading-relaxed text-canvas/65">{b.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 max-w-4xl font-sans text-[0.92rem] leading-relaxed text-canvas/50">
              {ALSO_BUILT}
            </p>
          </Reveal>
          <Reveal>
            <p className="mt-8 max-w-2xl border-t border-night-line pt-8 font-sans text-[0.95rem] leading-relaxed text-canvas/65">
              <span className="text-canvas">Your idea is protected.</span> We sign
              an NDA before you share anything confidential. Everyone on the team
              is under NDA. An IP agreement protects your work, and access to your
              code and servers is limited to people you agree.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Checklist download (#checklist)                                 */
/* ---------------------------------------------------------------- */

type Status = 'idle' | 'sending' | 'sent' | 'error'

function Checklist({ attribution }: { attribution: LeadAttribution }) {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await submitChecklist({
        data: { email, company_website: hp, ...attribution },
      })
      if (res.ok) {
        setStatus('sent')
        fireConversion('checklist_download')
        try {
          window.open(CHECKLIST_PDF, '_blank', 'noopener')
        } catch {
          /* the visible link below is the fallback */
        }
      } else {
        setStatus('error')
        setErrorMsg(res.error)
      }
    } catch {
      setStatus('error')
      setErrorMsg(`Something went wrong. Please email us at ${EMAIL}.`)
    }
  }

  return (
    <section id="checklist" className="scroll-mt-24 border-t border-line bg-canvas-2">
      <Container width="narrow" className="py-24 sm:py-28">
        <Reveal>
          <div className="text-center">
            <Eyebrow className="justify-center inline-flex">The checklist</Eyebrow>
            <h2 className="text-display-md mt-6">
              Before you hire any dev team, ask these twelve questions.
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
              A one-page checklist for non-technical founders. Takes ten minutes.
              Use it with any agency, including us.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {status === 'sent' ? (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-line bg-paper p-7 text-center">
              <p className="font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 500 }}>
                Thank you. Your checklist is on its way, and downloads below.
              </p>
              <a href={CHECKLIST_PDF} target="_blank" rel="noopener noreferrer" className="btn btn-primary arrow-link mt-6">
                Download the PDF <span className="arrow">→</span>
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              >
                <label>
                  Company website
                  <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@startup.com"
                  aria-label="Work email"
                  className="w-full rounded-md border border-line-strong bg-paper px-4 py-3 font-sans text-[0.95rem] text-ink placeholder:text-ink-45 outline-none transition-colors focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send me the checklist'}
                </button>
              </div>
              {status === 'error' && (
                <p className="mt-3 font-sans text-[0.85rem] text-[color:var(--color-gold-deep)]">{errorMsg}</p>
              )}
              <p className="mt-3 text-center font-sans text-[0.78rem] text-ink-45">
                One email with the checklist, then a short note from us.
                Unsubscribe any time.
              </p>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  FAQ                                                             */
/* ---------------------------------------------------------------- */

function Faq() {
  return (
    <section className="border-t border-line bg-canvas">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>Common questions</Eyebrow>
              <h2 className="text-display-md mt-6">The answers, plainly.</h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="divide-y divide-line border-y border-line">
              {FAQ.map((item, i) => (
                <Reveal key={item.q} delay={i * 30}>
                  <div className="py-7">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 500 }}>
                      {item.q}
                    </h3>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">{item.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Contact form (#contact)                                        */
/* ---------------------------------------------------------------- */

const STUDIO_EMPTY: Omit<StudioInput, keyof LeadAttribution> = {
  name: '',
  email: '',
  company: '',
  website: '',
  country: '',
  role: STUDIO_ROLES[0],
  stage: STUDIO_STAGES[0],
  funding: STUDIO_FUNDING[0],
  cto: STUDIO_CTO[0],
  message: '',
  company_website: '',
}

function ContactForm({ attribution }: { attribution: LeadAttribution }) {
  const [form, setForm] = useState(STUDIO_EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await submitStudio({ data: { ...form, ...attribution } })
      if (res.ok) {
        setStatus('sent')
        fireConversion('studio_lead')
      } else {
        setStatus('error')
        setErrorMsg(res.error)
      }
    } catch {
      setStatus('error')
      setErrorMsg(
        `Something went wrong sending your message. Please email us directly at ${EMAIL}.`,
      )
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-night text-canvas">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <Eyebrow className="eyebrow-light">Contact</Eyebrow>
              <h2 className="text-display-lg mt-6 text-canvas">Book a free scoping call.</h2>
              <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                Tell us what you are building. We will reply within one business
                day with times for a 30-minute call, and a one-page plan
                afterwards.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10 border-t border-night-line pt-8">
                <p className="eyebrow text-gold-soft">Email</p>
                <a href={`mailto:${EMAIL}`} className="link-line mt-2 inline-block font-display text-canvas" style={{ fontSize: '1.3rem' }}>
                  {EMAIL}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={90}>
              {status === 'sent' ? (
                <div className="rounded-2xl border border-night-line bg-night-2 p-7 sm:p-9">
                  <p className="eyebrow text-gold-soft">Received</p>
                  <h3 className="mt-4 font-display text-canvas" style={{ fontSize: '1.6rem' }}>
                    Thank you. Your note is with us.
                  </h3>
                  <p className="mt-4 font-sans text-[0.98rem] leading-relaxed text-canvas/65">
                    We read every enquiry ourselves and will reply to{' '}
                    <span className="text-canvas">{form.email}</span> within one
                    business day, usually sooner.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(STUDIO_EMPTY)
                      setStatus('idle')
                    }}
                    className="btn btn-light mt-7"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative rounded-2xl border border-night-line bg-night-2 p-7 sm:p-9">
                  <div aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0">
                    <label>
                      Company website
                      <input type="text" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={set('company_website')} />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name">
                      <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Founder" />
                    </Field>
                    <Field label="Work email">
                      <input required type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="jane@startup.com" />
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Company">
                      <input value={form.company} onChange={set('company')} className={inputCls} placeholder="Startup name" />
                    </Field>
                    <Field label="Website (optional)">
                      <input value={form.website} onChange={set('website')} className={inputCls} placeholder="yourstartup.com" />
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Country">
                      <input required value={form.country} onChange={set('country')} className={inputCls} placeholder="United States" />
                    </Field>
                    <Field label="You are a">
                      <select value={form.role} onChange={set('role')} className={inputCls}>
                        {STUDIO_ROLES.map((r) => (
                          <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Stage">
                      <select value={form.stage} onChange={set('stage')} className={inputCls}>
                        {STUDIO_STAGES.map((r) => (
                          <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Funding">
                      <select value={form.funding} onChange={set('funding')} className={inputCls}>
                        {STUDIO_FUNDING.map((r) => (
                          <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Do you have a CTO or engineering team?">
                      <select value={form.cto} onChange={set('cto')} className={inputCls}>
                        {STUDIO_CTO.map((r) => (
                          <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="What are you building?">
                      <textarea
                        required
                        value={form.message}
                        onChange={set('message')}
                        rows={5}
                        className={`${inputCls} resize-none`}
                        placeholder="The product, who it is for, and when you need it."
                      />
                    </Field>
                  </div>

                  {status === 'error' && (
                    <p className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 font-sans text-[0.85rem] text-red-200">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn btn-light mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="mt-4 text-center font-sans text-[0.78rem] text-canvas/40">
                    Goes straight to our team. We reply within one business day.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

const inputCls =
  'w-full rounded-md border border-night-line bg-night px-4 py-3 font-sans text-[0.95rem] text-canvas placeholder:text-canvas/30 outline-none transition-colors focus:border-gold-soft'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[0.72rem] uppercase tracking-[0.14em] text-canvas/50">
        {label}
      </span>
      {children}
    </label>
  )
}

/* ---------------------------------------------------------------- */
/*  Final CTA band                                                 */
/* ---------------------------------------------------------------- */

function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-orange animate-blob" style={{ width: 520, height: 520, left: '50%', top: '-20%', opacity: 0.3 }} />
      </div>
      <Container className="relative py-24 sm:py-28 text-center">
        <Reveal>
          <h2 className="text-display-lg mx-auto max-w-3xl text-canvas">
            Your product, started this month.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/60">
            Book a free scoping call. You leave with a one-page plan, whether or
            not we work together.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn btn-light">
              Book a free scoping call
            </a>
            <a href="#checklist" className="btn btn-ghost-light">
              Or get the checklist
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
