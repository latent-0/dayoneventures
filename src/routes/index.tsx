import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'
import { HomeHero } from '../components/HomeHero'
import { HorizonScroll } from '../components/HorizonScroll'
import { StatBlock } from '../components/StatBlock'
import { ApertureReveal } from '../components/ApertureReveal'
import { FrameworkScroll } from '../components/FrameworkScroll'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      path: '/',
      title: 'Day One Ventures · Operating-Partner Private Equity for Software',
      description:
        'Day One Ventures is an operating-partner private equity firm for lower-middle-market software. We diagnose value leakage, deploy revenue, margin and product engines, and build exit readiness — hands-on, from day one of ownership.',
      keywords:
        'private equity, operating partner, value creation, lower middle market software, EBITDA expansion, multiple expansion, net revenue retention, exit readiness, buyout, SaaS private equity',
    }),
  component: Home,
})

/* ---------------------------------------------------------------- */

const ENGAGEMENTS = [
  {
    kicker: 'Control',
    title: 'Buyouts',
    body: 'We acquire control of a single software business and run the value-creation plan ourselves, accountable for the number from close to exit.',
  },
  {
    kicker: 'Structured',
    title: 'Minority & partnerships',
    body: 'For founders and holders who want the operating engine without a full sale — a structured position paired with hands-on operating.',
  },
  {
    kicker: 'For sponsors',
    title: 'Operating partner',
    body: 'An operating standard applied across a sponsor’s software portfolio, backed by playbooks proven inside our own control deals.',
  },
]

function Home() {
  return (
    <>
      <HomeHero />
      <NetworkStrip />
      <HorizonScroll />
      <StatBlock />
      <TheThesis />
      <ApertureReveal />
      <FrameworkScroll />
      <Engagements />
      <TheMoat />
      <WhereWeFit />
      <Faq />
      <ProofBand />
    </>
  )
}

/* ---------------------------------------------------------------- */
/*  Network strip                                                    */
/* ---------------------------------------------------------------- */

function NetworkStrip() {
  return (
    <section className="border-b border-line bg-canvas">
      <Container width="wide" className="py-7 sm:py-8">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
            <p className="eyebrow" style={{ letterSpacing: '0.2em' }}>
              An operating-partner private equity firm
            </p>
            <div className="flex items-center gap-4 font-display text-ink" style={{ fontSize: '1.05rem' }}>
              <span>Software</span>
              <span className="text-line-strong">·</span>
              <span>Data</span>
              <span className="text-line-strong">·</span>
              <span>AI-native</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  The thesis (equity value equation)                              */
/* ---------------------------------------------------------------- */

function TheThesis() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>The thesis</Eyebrow>
              <h2 className="text-display-md mt-6">
                Two numbers decide the outcome. We move both.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={90}>
              <div className="rounded-xl border border-line bg-paper px-6 py-7 text-center">
                <p className="equation text-ink" style={{ fontSize: 'clamp(1.15rem,2.4vw,1.7rem)' }}>
                  Equity Value ={' '}
                  <span className="text-emerald">Earnings</span> ×{' '}
                  <span className="text-gold-deep">Multiple</span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-lead mt-8 text-ink-80 dropcap">
                Every return in software private equity resolves to this identity.
                Earnings, and the multiple the market pays for them. Most firms
                buy at a good multiple and hope the earnings follow.
              </p>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                We work the other way. We grow earnings by rebuilding the revenue
                and margin engines, and we grow the multiple by making the growth
                durable and diligence-proof. Both are engineered, not hoped for —
                and both start on day one, not at the exit. Advice handed to a
                management team rarely closes that gap. Ownership of the work
                does.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Engagements                                                      */
/* ---------------------------------------------------------------- */

function Engagements() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>How we partner</Eyebrow>
              <h2 className="text-display-md mt-6">
                Structured to the outcome, not the fee.
              </h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Three ways to work together — but only one operating standard
                behind them.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {ENGAGEMENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 80}>
                  <div className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10">
                    <div className="sm:w-40 shrink-0">
                      <p className="eyebrow" style={{ letterSpacing: '0.14em' }}>
                        {e.kicker}
                      </p>
                    </div>
                    <div>
                      <h3
                        className="font-display transition-colors group-hover:text-emerald"
                        style={{ fontSize: 'clamp(1.5rem,2.6vw,2.1rem)' }}
                      >
                        {e.title}
                      </h3>
                      <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                        {e.body}
                      </p>
                    </div>
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
/*  The moat                                                         */
/* ---------------------------------------------------------------- */

function TheMoat() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-canvas">
      <Container width="narrow" className="relative py-24 sm:py-32 text-center">
        <Reveal>
          <Eyebrow className="justify-center inline-flex">The compounding advantage</Eyebrow>
        </Reveal>
        <Reveal delay={90}>
          <blockquote className="mt-8">
            <p className="font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.4vw,2.75rem)', lineHeight: 1.16 }}>
              “Every deal adds to a proprietary operating library — diagnostics,
              playbooks, and margin levers built from real ownership. It isn’t
              patentable. It compounds like it is.”
            </p>
          </blockquote>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-[1.02rem] leading-relaxed text-ink-60">
            Operating the whole business ourselves is not just cleaner. It
            compounds. What we learn expanding the value of one company makes the
            next one faster — and that library can’t be replicated by reading a
            deck or hiring one specialist.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <Link to="/firm" className="link-line mt-8 inline-block font-sans text-[0.95rem]">
            The thesis behind Day One →
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Where we fit                                                     */
/* ---------------------------------------------------------------- */

const FIT = [
  { k: '$5–40M ARR', v: 'Lower middle market. Big enough to matter, small enough to move.' },
  { k: 'Sponsor-backed or founder-held', v: 'PE-owned, independent sponsor, or a founder ready to compound.' },
  { k: 'Two or more levers', v: 'At least two operating gaps a hands-on team can close.' },
]

function WhereWeFit() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-night text-canvas" id="fit">
      <Container className="relative py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow className="eyebrow-light">Where we fit</Eyebrow>
              <h2 className="text-display-md mt-6 text-canvas">
                A narrow mandate, run deep.
              </h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-canvas/60">
                We say no often. The work only compounds when the company is the
                right shape for it.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="flex flex-col divide-y divide-night-line border-y border-night-line">
              {FIT.map((f, i) => (
                <Reveal key={f.k} delay={i * 80}>
                  <div className="py-7">
                    <h3 className="font-display text-canvas" style={{ fontSize: 'clamp(1.4rem,2.4vw,1.9rem)', fontWeight: 400 }}>
                      {f.k}
                    </h3>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-canvas/60">
                      {f.v}
                    </p>
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
/*  FAQ                                                              */
/* ---------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: 'What is Day One Ventures?',
    a: 'Day One Ventures is an operating-partner private equity firm for lower-middle-market software companies. One team owns value creation end to end — diagnosing the business, running the revenue, margin and product engines, and building exit readiness from the first day of ownership.',
  },
  {
    q: 'How is this different from a traditional PE firm?',
    a: 'Traditional firms underwrite a deal and hand a plan to management. We operate the plan ourselves. Value creation is not a workstream we outsource to advisors — it is the entire business we are in.',
  },
  {
    q: 'What does the four-phase framework do?',
    a: 'Diagnose maps where value is leaking. Operate deploys the revenue, margin and product engines together. Compound makes the gains durable and diligence-proof. Realize builds the exit narrative and data room years early.',
  },
  {
    q: 'What companies do you work with?',
    a: 'Lower-middle-market software and tech-enabled businesses, roughly $5–40M ARR, that are sponsor-backed or founder-held and have at least two operating levers a hands-on team can pull.',
  },
  {
    q: 'How do you measure value creation?',
    a: 'By EBITDA growth and multiple expansion — traced through net revenue retention, gross margin, Rule-of-40, and a diligence-grade data room that stands up at exit.',
  },
  {
    q: 'Do you only do control buyouts?',
    a: 'No. We do control buyouts, structured minority partnerships, and portfolio-wide operating partnerships for sponsors. The operating standard behind each is the same.',
  },
]

function Faq() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>Common questions</Eyebrow>
              <h2 className="text-display-md mt-6">The answers, plainly.</h2>
              <Link
                to="/firm"
                className="link-line mt-6 inline-block font-sans text-[0.95rem] text-ink-80"
              >
                More about the firm →
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="divide-y divide-line border-y border-line">
              {FAQ_ITEMS.map((item, i) => (
                <Reveal key={item.q} delay={i * 40}>
                  <div className="py-7">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.35rem' }}>
                      {item.q}
                    </h3>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                      {item.a}
                    </p>
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
/*  Proof / CTA band                                                */
/* ---------------------------------------------------------------- */

function ProofBand() {
  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <Container className="relative py-24 sm:py-32">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow className="eyebrow-light">Diagnose before you deploy</Eyebrow>
              <h2 className="text-display-lg mt-6 text-canvas">
                The first conversation is a diagnostic, not a pitch.
              </h2>
              <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/60">
                Bring us a company you own, or one you are looking at. We will
                map where the value is leaking and what it would take to build
                it back — before anyone commits to anything.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={120}>
              <div className="flex flex-col items-start gap-5 md:items-end">
                <Link to="/contact" className="btn btn-light w-full sm:w-auto">
                  Talk to us
                </Link>
                <Link to="/framework" className="link-line font-sans text-[0.95rem] text-canvas/80">
                  Or read the framework →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
