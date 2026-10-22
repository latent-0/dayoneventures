import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from 'motion/react'
import { useRef, useState } from 'react'
import { Container, Eyebrow } from './site'

const HEADER = '4.75rem'
const HERO_VIDEO = '/studio-hero.mp4'
const HERO_POSTER = '/studio-hero-poster.jpg'

const TITLE_LINES = ['Your product team.', 'From dayone.']

const lineMask: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}
const lineInner: Variants = {
  hidden: { y: '116%' },
  visible: {
    y: '0%',
    transition: { type: 'spring', damping: 26, stiffness: 90, mass: 1 },
  },
}
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ---------------------------------------------------------------- */
/*  Hero: the footage collapses into a circle as you scroll          */
/* ---------------------------------------------------------------- */

export function StudioHero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const P_END = 0.58
  const size = useTransform(scrollYProgress, [0, P_END], ['152vmax', '82vmax'])
  const radiusVmax = useTransform(scrollYProgress, [0, P_END], [76, 41])
  const txN = useTransform(scrollYProgress, [0, P_END], [0, 40])
  const x = useMotionTemplate`calc(-50% + ${txN}vw)`
  const radius = useTransform(scrollYProgress, [0.04, P_END - 0.06], ['1%', '50%'])
  const ringOpacity = useTransform(scrollYProgress, [0.18, 0.44], [0, 1])
  const clip = useMotionTemplate`circle(${radiusVmax}vmax at calc(50% + ${txN}vw) 50%)`

  if (reduce) return <ReducedHero />

  return (
    <section
      ref={ref}
      className="relative bg-canvas text-ink"
      style={{ marginTop: `-${HEADER}`, height: '260vh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 18% 24%, #fbf7f0 0%, #f6f1e9 52%, #efe7d9 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 560, height: 560, left: '-10%', top: '20%', opacity: 0.22 }} />
          <div className="blob blob-amber animate-blob" style={{ width: 440, height: 440, left: '20%', top: '-14%', opacity: 0.18, animationDelay: '4s' }} />
          <div className="blob blob-orange animate-blob" style={{ width: 500, height: 500, left: '2%', bottom: '-18%', opacity: 0.16, animationDelay: '8s' }} />
        </div>

        {/* the footage portal */}
        <motion.div
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius }}
          className="absolute left-1/2 top-1/2 overflow-hidden bg-night will-change-transform"
        >
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(14,10,6,0.5), rgba(14,10,6,0.32) 50%, rgba(14,10,6,0.55))' }}
          />
          <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </motion.div>

        <motion.div
          aria-hidden
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius, opacity: ringOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 border border-gold-soft/55"
        />

        <div className="absolute inset-0">
          <HeroCopy tone="dark" />
        </div>
        <motion.div aria-hidden style={{ clipPath: clip }} className="pointer-events-none absolute inset-0">
          <HeroCopy tone="light" />
        </motion.div>
      </div>
    </section>
  )
}

function HeroCopy({ tone }: { tone: 'dark' | 'light' }) {
  const light = tone === 'light'
  const eyebrow = light ? 'var(--color-gold-soft)' : 'var(--color-gold-deep)'
  const heading = light ? 'var(--color-canvas)' : 'var(--color-ink)'
  const HeadingTag: any = tone === 'dark' ? motion.h1 : motion.div

  return (
    <Container width="wide" className="flex h-full flex-col justify-center pt-[4.75rem]">
      <div className="max-w-3xl">
        <motion.p
          custom={0.05}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-7 font-sans uppercase"
          style={{ color: eyebrow, letterSpacing: '0.28em', fontSize: '0.72rem', fontWeight: 500 }}
        >
          Venture studio · Dedicated product teams
        </motion.p>

        <HeadingTag
          variants={lineMask}
          initial="hidden"
          animate="visible"
          className="font-display"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.25rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            fontWeight: 600,
            color: heading,
          }}
        >
          {TITLE_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineInner} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </HeadingTag>

        <motion.p
          custom={0.9}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 max-w-xl font-sans text-[1.1rem] leading-relaxed"
          style={{ color: light ? 'rgba(245,242,234,0.78)' : 'var(--color-ink-60)' }}
        >
          A product manager, engineers, a designer and a tester, working only
          on your product. Month to month. Working demos every week.
        </motion.p>

        <motion.div
          custom={1.15}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            tabIndex={light ? -1 : undefined}
            className={`btn arrow-link ${light ? 'btn-light' : 'btn-primary'}`}
          >
            Book a free scoping call <span className="arrow">→</span>
          </a>
          <a
            href="#checklist"
            tabIndex={light ? -1 : undefined}
            className={`btn ${light ? 'btn-ghost-light' : 'btn-ghost'}`}
          >
            Get the 12-question checklist
          </a>
        </motion.div>
      </div>
    </Container>
  )
}

function ReducedHero() {
  return (
    <section className="relative bg-canvas text-ink" style={{ marginTop: `-${HEADER}`, minHeight: '100svh' }}>
      <div className="absolute inset-y-0 right-0 hidden w-1/2 rounded-l-[3rem] md:block" style={{ background: 'radial-gradient(70% 70% at 50% 45%, #241a10 0%, #17120c 60%, #0e0a06 100%)' }} />
      <Container width="wide" className="relative flex min-h-[100svh] flex-col justify-center pt-[4.75rem]">
        <p className="eyebrow mb-6">Venture studio · Dedicated product teams</p>
        <h1 className="text-display-xl max-w-3xl">Your product team. From dayone.</h1>
        <p className="mt-8 max-w-xl font-sans text-[1.1rem] leading-relaxed text-ink-60">
          A product manager, engineers, a designer and a tester, working only on
          your product. Month to month. Working demos every week.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#contact" className="btn btn-primary">Book a free scoping call →</a>
          <a href="#checklist" className="btn btn-ghost">Get the 12-question checklist</a>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Stat block: one dominant number                                  */
/* ---------------------------------------------------------------- */

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

export function StudioStat({
  big,
  caption,
  secondary,
}: {
  big: string
  caption: string
  secondary: { value: string; line: string }[]
}) {
  return (
    <section className="border-t border-line bg-canvas">
      <Container width="wide" className="py-28 sm:py-40">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid items-center gap-y-16 md:grid-cols-12 md:gap-x-12"
        >
          <motion.div variants={item} className="md:col-span-7">
            <p className="mb-6 font-sans uppercase text-gold-deep" style={{ letterSpacing: '0.22em', fontSize: '0.78rem', fontWeight: 500 }}>
              The group behind your team
            </p>
            <div className="font-display text-ink" style={{ fontSize: 'clamp(4rem, 11vw, 11rem)', fontWeight: 500, lineHeight: 0.84, letterSpacing: '-0.04em' }}>
              {big}
            </div>
            <p className="mt-8 max-w-md font-sans text-[1.15rem] leading-relaxed text-ink-60">{caption}</p>
          </motion.div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {secondary.map((s) => (
                <motion.div key={s.value} variants={item} className="py-8">
                  <div className="font-display text-emerald" style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)', fontWeight: 500, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
                    {s.value}
                  </div>
                  <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-60">{s.line}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Aperture: hiring a team vs a Dayone pod                          */
/* ---------------------------------------------------------------- */

export function StudioAperture() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const r = useTransform(scrollYProgress, [0.06, 0.5], [0, 96])
  const clip = useMotionTemplate`circle(${r}% at 50% 50%)`
  const ringOpacity = useTransform(scrollYProgress, [0.06, 0.38, 0.5], [0, 0.9, 0])
  const baseOpacity = useTransform(scrollYProgress, [0.32, 0.46], [1, 0])
  const panelScale = useTransform(scrollYProgress, [0.06, 0.5], [1.14, 1])
  const podOpacity = useTransform(scrollYProgress, [0.26, 0.46], [0, 1])
  const podY = useTransform(scrollYProgress, [0.26, 0.5], ['12%', '0%'])

  if (reduce) {
    return (
      <section className="bg-night text-canvas">
        <Container className="py-28 text-center">
          <p className="eyebrow eyebrow-light">The Dayone way</p>
          <h3 className="mt-5 font-display" style={{ fontSize: 'clamp(1.8rem,3.6vw,3rem)', fontWeight: 500 }}>
            A pod that starts one week after you agree.
          </h3>
        </Container>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative bg-canvas-2" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 50% 50%, rgba(232,99,29,0.10) 0px, rgba(232,99,29,0.10) 1px, transparent 1px, transparent 46px)',
          }}
        />
        <motion.div style={{ opacity: baseOpacity }} className="absolute inset-0 flex items-center">
          <Container width="wide">
            <div className="max-w-xl">
              <p className="eyebrow" style={{ letterSpacing: '0.2em' }}>Hiring it yourself</p>
              <h2 className="text-display-lg mt-5 text-ink">Recruit, onboard, hope.</h2>
              <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Months of interviews before a line of code. The wrong hire
                costs another quarter, and the runway keeps burning.
              </p>
            </div>
          </Container>
        </motion.div>

        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: panelScale }} className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(70% 70% at 50% 45%, #241a10 0%, #17120c 60%, #0e0a06 100%)' }}
            />
            <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
          </motion.div>
          <motion.div style={{ opacity: podOpacity, y: podY }} className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-2xl">
              <p className="eyebrow eyebrow-light">The Dayone way</p>
              <h3 className="mt-5 font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,4.4vw,3.6rem)', fontWeight: 500, lineHeight: 1.1 }}>
                A full pod, one week after you agree.
              </h3>
              <p className="mx-auto mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/60">
                A working first slice in the first month. Code, cloud accounts
                and designs yours from the first day.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <motion.circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-gold-soft)" strokeWidth="0.15" style={{ opacity: ringOpacity }} />
        </svg>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Pinned stepper: how it works                                     */
/* ---------------------------------------------------------------- */

export type StudioStep = { n: string; title: string; output: string; body: string }

export function StudioSteps({ steps }: { steps: StudioStep[] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length + 0.0001))
    setActive(i < 0 ? 0 : i)
  })

  if (reduce) return <FlatSteps steps={steps} />

  return (
    <>
      <FlatSteps steps={steps} className="md:hidden" />
      <section
        ref={ref}
        className="relative hidden border-t border-line bg-canvas-2 text-ink md:block"
        style={{ height: `${steps.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(55% 60% at 82% 40%, rgba(232,99,29,0.09), rgba(246,241,233,0) 70%)' }}
          />
          <Container width="wide" className="relative w-full">
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-4">
                <Eyebrow>How it works</Eyebrow>
                <h2 className="mt-5 font-display text-ink" style={{ fontSize: 'clamp(1.6rem,2.4vw,2.1rem)', fontWeight: 500 }}>
                  Four steps. One working product.
                </h2>
                <ol className="mt-9 space-y-1">
                  {steps.map((s, i) => (
                    <li key={s.n} className="flex items-center gap-4 py-2">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-[0.72rem] transition-all duration-500"
                        style={{
                          borderColor: i <= active ? 'var(--color-emerald)' : 'var(--color-line-strong)',
                          color: i <= active ? 'var(--color-emerald-deep)' : 'var(--color-ink-45)',
                          background: i === active ? 'rgba(232,99,29,0.10)' : 'transparent',
                        }}
                      >
                        {s.n}
                      </span>
                      <span
                        className="font-display transition-colors duration-500"
                        style={{ fontSize: '1.25rem', fontWeight: 500, color: i === active ? 'var(--color-ink)' : 'var(--color-ink-45)' }}
                      >
                        {s.title}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 h-px w-full bg-line">
                  <Progress progress={scrollYProgress} />
                </div>
              </div>

              <div className="relative md:col-span-7 md:col-start-6">
                <div className="relative min-h-[22rem]">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.n}
                      aria-hidden={i !== active}
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        y: i === active ? 0 : 24,
                        filter: i === active ? 'blur(0px)' : 'blur(8px)',
                      }}
                      transition={{ type: 'spring', damping: 26, stiffness: 120 }}
                      className="absolute inset-0"
                      style={{ pointerEvents: i === active ? 'auto' : 'none' }}
                    >
                      <StepBody s={s} large />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  )
}

function Progress({ progress }: { progress: MotionValue<number> }) {
  const w = useTransform(progress, [0, 1], ['0%', '100%'])
  return <motion.div className="h-px bg-emerald" style={{ width: w }} />
}

function StepBody({ s, large }: { s: StudioStep; large?: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[0.85rem] text-gold-deep">{s.n}</span>
          <h3 className="font-display text-ink" style={{ fontSize: large ? 'clamp(2rem,4vw,3.2rem)' : 'clamp(1.6rem,2.4vw,2.1rem)', fontWeight: 500 }}>
            {s.title}
          </h3>
        </div>
        <span className="rounded-full border border-line-strong px-3 py-1.5 font-sans text-gold-deep" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Output · {s.output}
        </span>
      </div>
      <p className="mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">{s.body}</p>
    </>
  )
}

function FlatSteps({ steps, className = '' }: { steps: StudioStep[]; className?: string }) {
  return (
    <section className={`border-t border-line bg-canvas-2 ${className}`}>
      <Container className="py-20 sm:py-28">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="text-display-md mt-6">Four steps. One working product.</h2>
        <div className="mt-10 space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <StepBody s={s} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
