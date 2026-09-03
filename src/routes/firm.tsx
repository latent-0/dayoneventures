import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal, Rosette } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/firm')({
  head: () =>
    seo({
      path: '/firm',
      title: 'The Firm · Dayone Ventures',
      description:
        'Dayone Ventures is a private equity operating firm. We believe value in software is manufactured in the holding period, so we own the operating work ourselves from dayone.',
      keywords:
        'private equity operating firm, value creation, operating partner model, software buyouts, EBITDA growth',
    }),
  component: FirmPage,
})

const PRINCIPLES = [
  {
    n: '01',
    t: 'We operate, we don’t advise.',
    b: 'The plan and the people who run it are the same team. No recommendations handed over a wall, no accountability lost in translation.',
  },
  {
    n: '02',
    t: 'The holding period is the product.',
    b: 'Entry multiple is a fact of the market. Everything that turns it into a return happens after close, so that is where we spend our time.',
  },
  {
    n: '03',
    t: 'Evidence before capital.',
    b: 'No dollar of change moves ahead of the diagnosis. We map where value leaks across six dimensions and rank every fix by what it is worth before we act.',
  },
  {
    n: '04',
    t: 'Build the exit on dayone.',
    b: 'A diligence-grade data room and a clean equity story are not an end-of-hold sprint. They are a discipline we run from the start.',
  },
  {
    n: '05',
    t: 'A narrow mandate, run deep.',
    b: 'Lower-middle-market software, two or more operating levers, a shape the work actually fits. We say no often so the yes compounds.',
  },
  {
    n: '06',
    t: 'The library compounds.',
    b: 'Every deal adds to a proprietary operating library. What we learn on one company makes the next one faster, and it cannot be copied from a deck.',
  },
]

function FirmPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-night text-canvas">
        <div
          aria-hidden
          className="animate-slow-spin pointer-events-none absolute -right-40 -top-40 hidden md:block"
          style={{ opacity: 0.14 }}
        >
          <Rosette size={620} color="var(--color-gold-soft)" />
        </div>
        <Container className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">The firm</Eyebrow>
            <h1 className="text-display-xl mt-6 max-w-4xl text-canvas">
              Value is manufactured, not discovered.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-canvas/65">
              Dayone Ventures is a private equity operating firm for
              lower-middle-market software. We take control or structured
              positions in businesses we can genuinely improve, and then we do
              the improving ourselves.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Thesis */}
      <section className="border-t border-line bg-canvas" id="thesis">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>The thesis</Eyebrow>
                <h2 className="text-display-md mt-6">Why we exist.</h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={90}>
                <p className="text-lead text-ink-80 dropcap">
                  Software is bought well and run flat more often than anyone
                  admits. The deal gets underwritten, a hundred-day plan gets
                  written, and then the hardest part, actually operating the
                  business to a bigger number, gets handed to the same people who
                  were already running it flat.
                </p>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  We were built to close that gap. Not as advisors billing for
                  slides, but as operators who own the plan and the outcome
                  together. We grow earnings by rebuilding the revenue and margin
                  engines, and we grow the multiple by making that growth durable
                  enough to survive the hardest diligence. Both, from the first
                  day of ownership.
                </p>
                <p className="equation mt-8 text-[0.95rem] text-emerald-deep">
                  Equity Value = Earnings × Multiple
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How we operate</Eyebrow>
              <h2 className="text-display-lg mt-6">Six principles, held without exception.</h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 60} className="bg-canvas">
                <div className="h-full p-8 transition-colors hover:bg-paper">
                  <span className="font-mono text-[0.8rem] text-gold-deep">{p.n}</span>
                  <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.4rem', lineHeight: 1.15 }}>
                    {p.t}
                  </h3>
                  <p className="mt-3 font-sans text-[0.96rem] leading-relaxed text-ink-60">
                    {p.b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Standard / quote */}
      <section className="border-t border-line bg-canvas">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">The standard</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <blockquote className="mt-8">
              <p className="font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.4vw,2.75rem)', lineHeight: 1.16 }}>
                “We would rather own the number than opine on it. If we are not
                accountable for the outcome, we are not the right partner.”
              </p>
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <Link to="/framework" className="link-line mt-8 inline-block font-sans text-[0.95rem]">
              See the framework →
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container className="py-24 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-lg mx-auto max-w-3xl text-canvas">
              Let’s find the value together.
            </h2>
            <div className="mt-9 flex justify-center">
              <Link to="/contact" className="btn btn-light">
                Talk to us
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
