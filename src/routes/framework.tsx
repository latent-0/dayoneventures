import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'
import { FrameworkScroll, PHASES } from '../components/FrameworkScroll'

export const Route = createFileRoute('/framework')({
  head: () =>
    seo({
      path: '/framework',
      title: 'The Framework · Dayone Ventures',
      description:
        'Diagnose, Operate, Compound, Realize. The four-phase value-creation framework Dayone Ventures runs inside every software company it owns.',
      keywords:
        'private equity value creation framework, operating partner, EBITDA expansion, multiple expansion, exit readiness, SaaS diligence',
    }),
  component: FrameworkPage,
})

function FrameworkPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-line bg-canvas">
        <Container className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <Reveal>
            <Eyebrow>The framework</Eyebrow>
            <h1 className="text-display-xl mt-6 max-w-4xl">
              Find the value before you fund it.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-ink-60">
              A single, sequential operating system for value creation. Each
              phase produces an output the next one depends on. No capital moves
              ahead of the diagnosis, and no exit gets scrambled at the end.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap gap-2.5">
              {PHASES.map((p) => (
                <span
                  key={p.n}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 font-sans text-ink-80"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}
                >
                  <span className="font-mono text-gold-deep">{p.n}</span>
                  {p.title}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pinned four-phase progression */}
      <FrameworkScroll />

      {/* Detail grid — all phases laid flat for reference */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow>In full</Eyebrow>
            <h2 className="text-display-md mt-6 max-w-2xl">
              What each phase produces.
            </h2>
          </Reveal>
          <div className="mt-14 space-y-16">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 40}>
                <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[0.9rem] text-gold-deep">{p.n}</span>
                      <h3 className="font-display text-ink" style={{ fontSize: 'clamp(1.9rem,3vw,2.6rem)' }}>
                        {p.title}
                      </h3>
                    </div>
                    <span
                      className="mt-4 inline-block rounded-full border border-line-strong px-3 py-1.5 font-sans text-gold-deep"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                    >
                      Output · {p.output}
                    </span>
                    <p className="mt-5 max-w-sm font-sans text-[1rem] leading-relaxed text-ink-60">
                      {p.lead}
                    </p>
                  </div>
                  <div className="md:col-span-7 md:col-start-6">
                    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                      {p.items.map((it) => (
                        <div key={it.k} className="bg-canvas p-6">
                          <p className="font-sans text-ink" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            {it.k}
                          </p>
                          <p className="mt-2 font-sans text-[0.92rem] leading-relaxed text-ink-60">
                            {it.v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Where we fit */}
      <section className="border-t border-line bg-canvas-2" id="fit">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>Where we fit</Eyebrow>
                <h2 className="text-display-md mt-6">The right shape for the work.</h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={90}>
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                  {[
                    { k: '$5–40M ARR', v: 'The lower middle market, where one team can move the whole number.' },
                    { k: 'Sponsor or founder', v: 'PE-owned, independent sponsor, or a founder ready to compound.' },
                    { k: '2+ levers', v: 'At least two operating gaps a hands-on team can close.' },
                  ].map((c) => (
                    <div key={c.k} className="bg-canvas p-6">
                      <p className="font-display text-ink" style={{ fontSize: '1.15rem' }}>{c.k}</p>
                      <p className="mt-3 font-sans text-[0.92rem] leading-relaxed text-ink-60">{c.v}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container className="py-24 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-lg mx-auto max-w-3xl text-canvas">
              Start with the diagnostic.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/60">
              Bring us a company you own or are considering. We will map the value
              at stake before anyone commits.
            </p>
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
