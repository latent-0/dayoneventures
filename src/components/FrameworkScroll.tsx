import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useRef, useState } from 'react'
import { Container, Eyebrow } from './site'

export type Phase = {
  n: string
  title: string
  output: string
  lead: string
  items: { k: string; v: string }[]
}

export const PHASES: Phase[] = [
  {
    n: '01',
    title: 'Diagnose',
    output: 'The Value Map',
    lead: 'Before a dollar of change, a structured operating diagnostic across six dimensions. We find exactly where value is leaking and rank every intervention by what it is worth — so capital only ever follows evidence.',
    items: [
      { k: 'Go-to-market efficiency', v: 'Where pipeline, conversion and payback quietly break down.' },
      { k: 'Gross margin & unit economics', v: 'The true cost to serve, rebuilt line by line.' },
      { k: 'Net revenue retention', v: 'Churn, expansion, and how durable the base really is.' },
      { k: 'Pricing & packaging', v: 'Value captured measured against value delivered.' },
      { k: 'Product defensibility', v: 'The moat, the roadmap, and the debt underneath it.' },
      { k: 'Cost & automation', v: 'Where offshore and AI take work out of the P&L.' },
    ],
  },
  {
    n: '02',
    title: 'Operate',
    output: 'EBITDA Expansion',
    lead: 'We deploy three engines at once and run them ourselves — nothing is handed over a wall. Growth, margin and product move on one operating cadence, owned by the people accountable for the result.',
    items: [
      { k: 'Revenue engine', v: 'GTM engineering, pricing, and the expansion motion rebuilt.' },
      { k: 'Margin engine', v: 'Vendor compression, offshore substitution, AI automation.' },
      { k: 'Product engine', v: 'AI-native workflows and a data moat, actually shipped.' },
      { k: 'Operating rhythm', v: 'One instrumented view of the number, reviewed weekly.' },
    ],
  },
  {
    n: '03',
    title: 'Compound',
    output: 'A Business That Compounds',
    lead: 'Growth that survives diligence. We push net revenue retention past 115%, harden the moat, and make every gain structural — so it holds long after we step back, not just while we are in the room.',
    items: [
      { k: 'NRR above 115%', v: 'Expansion that outruns churn, quarter after quarter.' },
      { k: 'Retention loops', v: 'Onboarding, success and product loops that make it stick.' },
      { k: 'Durable defensibility', v: 'Data and workflow lock-in a buyer can underwrite.' },
      { k: 'Rule of 40', v: 'Growth and profitability held in balance, never traded.' },
    ],
  },
  {
    n: '04',
    title: 'Realize',
    output: 'Maximum Multiple',
    lead: 'The exit is built years early, not scrambled at the end. We assemble the diligence-ready data room and the buyer narrative so the process simply confirms a story the numbers already tell.',
    items: [
      { k: 'Investor-grade data room', v: 'Metrics that stand up to the hardest diligence.' },
      { k: 'Buyer narrative', v: 'The equity story, evidenced — never merely asserted.' },
      { k: 'Management presentation', v: 'A team and a plan a buyer will pay up for.' },
      { k: 'Multiple expansion', v: 'A higher exit multiple, earned by the numbers.' },
    ],
  },
]

export function FrameworkScroll() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(PHASES.length - 1, Math.floor(v * PHASES.length + 0.0001))
    setActive(i < 0 ? 0 : i)
  })

  if (reduce) {
    return (
      <section className="border-t border-line bg-canvas">
        <Container width="wide" className="py-24">
          <Eyebrow>The framework</Eyebrow>
          <h2 className="text-display-lg mt-6">Diagnose. Operate. Compound. Realize.</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {PHASES.map((p) => (
              <div key={p.n} className="bg-canvas p-8">
                <PhaseHead p={p} />
                <PhaseItems p={p} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative border-t border-line bg-canvas text-ink"
      style={{ height: `${PHASES.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* soft warm wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 60% at 82% 40%, rgba(195,163,94,0.08), rgba(245,242,234,0) 70%)',
          }}
        />
        <Container width="wide" className="relative w-full">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            {/* Stepper rail */}
            <div className="md:col-span-4">
              <Eyebrow>The framework</Eyebrow>
              <h2
                className="mt-5 font-display text-ink"
                style={{ fontSize: 'clamp(1.6rem,2.4vw,2.1rem)', fontWeight: 500 }}
              >
                Four phases. One operating standard.
              </h2>
              <ol className="mt-9 space-y-1">
                {PHASES.map((p, i) => (
                  <li key={p.n} className="relative flex items-center gap-4 py-2">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-[0.72rem] transition-all duration-500"
                      style={{
                        borderColor:
                          i <= active ? 'var(--color-emerald)' : 'var(--color-line-strong)',
                        color:
                          i <= active ? 'var(--color-emerald-deep)' : 'var(--color-ink-45)',
                        background:
                          i === active ? 'rgba(31,91,69,0.10)' : 'transparent',
                      }}
                    >
                      {p.n}
                    </span>
                    <span
                      className="font-display transition-colors duration-500"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color:
                          i === active ? 'var(--color-ink)' : 'var(--color-ink-45)',
                      }}
                    >
                      {p.title}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 h-px w-full bg-line">
                <Progress progress={scrollYProgress} />
              </div>
            </div>

            {/* Active phase panel */}
            <div className="relative md:col-span-7 md:col-start-6">
              <div className="relative min-h-[24rem]">
                {PHASES.map((p, i) => (
                  <PhasePanel key={p.n} p={p} active={i === active} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

function Progress({ progress }: { progress: MotionValue<number> }) {
  const w = useTransform(progress, [0, 1], ['0%', '100%'])
  return <motion.div className="h-px bg-emerald" style={{ width: w }} />
}

function PhasePanel({ p, active }: { p: Phase; active: boolean }) {
  return (
    <motion.div
      aria-hidden={!active}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : 24,
        filter: active ? 'blur(0px)' : 'blur(8px)',
      }}
      transition={{ type: 'spring', damping: 26, stiffness: 120 }}
      className="absolute inset-0"
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      <PhaseHead p={p} />
      <p className="mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
        {p.lead}
      </p>
      <PhaseItems p={p} />
    </motion.div>
  )
}

function PhaseHead({ p }: { p: Phase }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[0.85rem] text-gold-deep">{p.n}</span>
        <h3
          className="font-display text-ink"
          style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 500 }}
        >
          {p.title}
        </h3>
      </div>
      <span
        className="hidden shrink-0 rounded-full border border-line-strong px-3 py-1.5 font-sans text-gold-deep sm:inline-block"
        style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
      >
        Output · {p.output}
      </span>
    </div>
  )
}

function PhaseItems({ p }: { p: Phase }) {
  return (
    <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {p.items.map((it) => (
        <div key={it.k} className="bg-paper p-5 transition-colors hover:bg-canvas-2">
          <p
            className="font-sans text-ink"
            style={{ fontSize: '0.9rem', letterSpacing: '0.01em', fontWeight: 600 }}
          >
            {it.k}
          </p>
          <p className="mt-2 font-sans text-[0.9rem] leading-relaxed text-ink-60">
            {it.v}
          </p>
        </div>
      ))}
    </div>
  )
}
