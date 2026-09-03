import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/platform')({
  head: () =>
    seo({
      path: '/platform',
      title: 'The Platform · Dayone Ventures',
      description:
        'Dayone Ventures runs a captive technology group. Dayone Technologies and DayoneX rebuild the product, data and cost base inside every company we back, which is how our operating plan actually gets built.',
      keywords:
        'captive technology group, operating partner, software value creation, AI platforms, offshore delivery, product engineering, private equity build capability',
    }),
  component: PlatformPage,
})

const COMPANIES = [
  {
    name: 'Dayone Technologies',
    role: 'Technology execution, owned',
    href: 'https://day1tech.com',
    display: 'day1tech.com',
    body: 'A technology operating partner that puts senior execution leadership inside the business and ships the platforms the plan depends on. It does not advise and leave. It stays until the outcome is real.',
    tags: [
      'AI & ML platforms',
      'Data platforms',
      'API platforms',
      'Digital twins',
      'Security systems',
      'Enterprise product engineering',
    ],
    stat: { k: '100+', v: 'production platforms delivered' },
  },
  {
    name: 'DayoneX',
    role: 'Enterprise AI and platform systems',
    href: 'https://dayonex.org',
    display: 'dayonex.org',
    body: 'The build shop behind the group. DayoneX ships production intelligent systems and runs delivery across India and the United States, which is where the margin work and the product moat get done.',
    tags: [
      'Machine learning',
      'Computer vision',
      'Natural language processing',
      'Digital twins',
      'MLOps infrastructure',
      'Offshore delivery',
    ],
    stat: { k: 'India + US', v: 'delivery and engineering teams' },
  },
]

function PlatformPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 560, height: 560, right: '-6%', top: '-14%', opacity: 0.4 }} />
          <div className="blob blob-amber animate-blob" style={{ width: 420, height: 420, left: '-8%', bottom: '-18%', opacity: 0.28, animationDelay: '6s' }} />
        </div>
        <Container className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">The platform</Eyebrow>
            <h1 className="text-display-xl mt-6 max-w-4xl text-canvas">
              The build behind the buy.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-canvas/70">
              Most private equity firms outsource the hard part. We own it. Day
              One runs a captive technology group that rebuilds the product, the
              data and the cost base inside every company we back.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Why it matters */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>Why it matters</Eyebrow>
                <h2 className="text-display-md mt-6">We do not rent the build.</h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={90}>
                <p className="text-lead text-ink-80 dropcap">
                  When we take control of a company, we do not hand the roadmap to
                  a consultancy and hope. We deploy our own engineers. That is how
                  the Operate phase actually happens.
                </p>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  The cost engine gets built by moving delivery offshore and
                  automating with AI. The product engine gets built by shipping
                  AI-native workflows and a real data moat. Both come from the
                  same group, held to the same number. It is the reason we can
                  promise operating outcomes and mean it.
                </p>
                <Link to="/framework" className="arrow-link link-line mt-8 inline-block font-sans text-[0.95rem] text-gold-deep">
                  See the framework <span className="arrow">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* The companies */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow>The group</Eyebrow>
            <h2 className="text-display-lg mt-6 max-w-2xl">
              Two engines, one accountability.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {COMPANIES.map((c, i) => (
              <Reveal key={c.name} delay={i * 90}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-line bg-paper p-8 sm:p-10">
                  <p className="eyebrow">{c.role}</p>
                  <h3 className="mt-4 font-display text-ink" style={{ fontSize: 'clamp(1.7rem,2.6vw,2.3rem)', fontWeight: 500 }}>
                    {c.name}
                  </h3>
                  <p className="mt-4 font-sans text-[1rem] leading-relaxed text-ink-60">
                    {c.body}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-line-strong px-3 py-1.5 font-sans text-ink-80"
                        style={{ fontSize: '0.72rem', letterSpacing: '0.02em' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <div>
                      <div className="font-display text-gold-deep" style={{ fontSize: '1.6rem', fontWeight: 500 }}>
                        {c.stat.k}
                      </div>
                      <p className="mt-1 font-sans text-[0.82rem] text-ink-45">{c.stat.v}</p>
                    </div>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary arrow-link !py-2.5 !px-5 text-[0.82rem]"
                    >
                      Visit {c.display} <span className="arrow">→</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* One group */}
      <section className="border-t border-line bg-canvas">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">One group</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <blockquote className="mt-8">
              <p className="font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.4vw,2.75rem)', lineHeight: 1.16 }}>
                “The capital comes from Dayone Ventures. The build comes from
                Dayone Technologies and DayoneX. Same name, same standard, same
                number.”
              </p>
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-8 max-w-xl font-sans text-[1.02rem] leading-relaxed text-ink-60">
              A buyer can copy a thesis. They cannot copy a technology group that
              has already shipped the platforms, run the offshore delivery, and
              built the data moats we lean on. That is the advantage that
              compounds.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 520, height: 520, right: '8%', top: '-18%', opacity: 0.38 }} />
        </div>
        <Container className="relative py-24 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-lg mx-auto max-w-3xl text-canvas">
              Bring us the company. We bring the build.
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
