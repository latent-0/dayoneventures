import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/otto')({
  head: () =>
    seo({
      path: '/otto',
      title: 'Otto Intelligence: AI for VC and PE Teams · Dayone Ventures',
      description:
        'Otto Intelligence is Dayone’s intelligence layer for private-capital teams. It tells you what changed, why it matters, who can open the door and what to do next, with a human approving every step.',
      keywords:
        'Otto Intelligence, private capital intelligence, deal sourcing AI, LP shortlist, fundraising for emerging GPs, SEC Form D, diligence copilot, investment committee',
    }),
  component: OttoPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'

const SCREENS = [
  {
    src: '/otto/morning-brief.png',
    k: 'Morning Brief',
    v: 'Start the day on the three things that need you, with live signals, priorities and a map of the pipeline.',
  },
  {
    src: '/otto/deal-radar.png',
    k: 'Deal Radar',
    v: 'A ranked queue where every score is split into seven visible factors. Click one to see the evidence behind it.',
  },
  {
    src: '/otto/diligence-copilot.png',
    k: 'Diligence Copilot',
    v: 'Interrogate a deal in plain English. Answers cite their sources and flag where the evidence contradicts management.',
  },
  {
    src: '/otto/ic-room.png',
    k: 'IC Room',
    v: 'A one-page brief, risk matrix and committee questions, with each decision recorded alongside the evidence at the time.',
  },
]

const POINTS = [
  { k: 'A person decides', v: 'Otto drafts and shortlists. You approve every step and send from your own inbox.' },
  { k: 'Sources on every record', v: 'Each record shows where it came from, when it was checked and how confident we are.' },
  { k: 'Your data stays yours', v: 'A fund’s data is isolated to that fund. It is never pooled or shared with other managers.' },
]

function OttoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 620, height: 620, left: '-8%', top: '4%', opacity: 0.32 }} />
          <div className="blob blob-amber animate-blob" style={{ width: 460, height: 460, right: '-4%', top: '-14%', opacity: 0.24, animationDelay: '5s' }} />
        </div>
        <Container className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">Otto Intelligence · by Dayone Venture Partners</Eyebrow>
            <h1 className="text-display-xl mt-6 max-w-4xl text-canvas">
              Find the signal. Understand the case. Move first.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-canvas/70">
              Otto is Dayone’s intelligence layer for venture and private-equity
              teams. It tells you what changed, why it matters, who can open the
              door and what to do next.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={`mailto:${EMAIL}?subject=Otto%20Intelligence%20access`} className="btn btn-light arrow-link">
                Request access <span className="arrow">→</span>
              </a>
              <a href="#screens" className="btn btn-ghost-light">
                See Otto
              </a>
            </div>
            <p className="mt-6 font-sans text-[0.85rem] text-canvas/45">
              Early version. Access is by invitation.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* About */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>About Otto</Eyebrow>
                <h2 className="text-display-md mt-6">One place for the whole investment lifecycle.</h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={90}>
                <p className="text-lead text-ink-80 dropcap">
                  Private-capital teams work from news alerts, spreadsheets, inboxes
                  and memory. Otto brings them together. It watches the market for
                  signals, scores every opportunity against your theses, finds the
                  warm path to the people who matter, and helps you build the case
                  for investment committee.
                </p>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  It also works for the other side of the table. Emerging managers
                  raising a fund get a scored shortlist of likely investors, drafts
                  that are checked against their own track record, and a pipeline
                  from first note to booked meeting. Investors can see which funds
                  are raising now, read from public SEC filings, and screen them
                  against their mandate.
                </p>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  You can also just ask. Search or speak a question, and Otto
                  answers from your data and can open the right screen for you.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Screenshots */}
      <section id="screens" className="scroll-mt-24 border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Inside Otto</Eyebrow>
              <h2 className="text-display-lg mt-6">What it looks like.</h2>
              <p className="mt-5 font-sans text-[0.95rem] text-ink-45">
                Screens show sample data.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {SCREENS.map((s, i) => (
              <Reveal key={s.k} delay={(i % 2) * 90}>
                <figure className="card-lift h-full overflow-hidden rounded-2xl border border-line bg-paper">
                  <img
                    src={s.src}
                    alt={`Otto ${s.k} screen`}
                    loading="lazy"
                    className="block w-full border-b border-line"
                  />
                  <figcaption className="p-7">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.35rem', fontWeight: 500 }}>
                      {s.k}
                    </h3>
                    <p className="mt-2 font-sans text-[0.96rem] leading-relaxed text-ink-60">{s.v}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-28">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {POINTS.map((p, i) => (
              <Reveal key={p.k} delay={i * 60} className="bg-canvas">
                <div className="h-full p-8">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.3rem', fontWeight: 500 }}>
                    {p.k}
                  </h3>
                  <p className="mt-3 font-sans text-[0.96rem] leading-relaxed text-ink-60">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 520, height: 520, left: '50%', top: '-20%', opacity: 0.3 }} />
        </div>
        <Container className="relative py-24 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-lg mx-auto max-w-3xl text-canvas">See Otto on your own pipeline.</h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/60">
              Otto is an early version, open to a small number of teams by
              invitation. Tell us what you are raising or sourcing.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href={`mailto:${EMAIL}?subject=Otto%20Intelligence%20access`} className="btn btn-light">
                Request access
              </a>
              <Link to="/contact" className="btn btn-ghost-light">
                Talk to us
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
