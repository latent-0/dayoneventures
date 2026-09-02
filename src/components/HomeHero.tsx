import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { Container } from './site'

const HEADER = '4.75rem'

/* Save the hero photograph here: public/hero.jpg */
const HERO_IMAGE = '/hero.jpg'

const TITLE_LINES = ['Equity value is', 'engineered.', 'From day one.']

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

export function HomeHero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // The full-bleed photograph collapses into a circle that hugs the right
  // edge — cut off by the screen, so only its left half shows.
  const P_END = 0.58
  const size = useTransform(scrollYProgress, [0, P_END], ['152vmax', '82vmax'])
  const txN = useTransform(scrollYProgress, [0, P_END], [0, 40]) // vw
  const x = useMotionTemplate`calc(-50% + ${txN}vw)`
  const radius = useTransform(scrollYProgress, [0.04, P_END - 0.06], ['1%', '50%'])
  const ringOpacity = useTransform(scrollYProgress, [0.18, 0.44], [0, 1])
  const imgScale = useTransform(scrollYProgress, [0, P_END], [1.06, 1.16])

  // Copy stays on the paper ground as the portal recedes.
  const copyX = useTransform(scrollYProgress, [0, P_END], ['0%', '0%'])

  if (reduce) {
    return <ReducedHero />
  }

  return (
    <section
      ref={ref}
      className="relative bg-canvas text-ink"
      style={{ marginTop: `-${HEADER}`, height: '260vh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Paper ground remains visible throughout the portal animation. */}
        <div aria-hidden className="absolute inset-0 bg-canvas" />

        {/* the photographic portal */}
        <motion.div
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius }}
          className="absolute left-1/2 top-1/2 overflow-hidden will-change-transform"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})`, scale: imgScale }}
            role="img"
            aria-label="Looking up at glass office towers in the financial district"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 50% at 70% 12%, rgba(195,163,94,0.16), rgba(195,163,94,0) 60%)',
            }}
          />
          <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </motion.div>

        {/* the gold ring that forms around the portal */}
        <motion.div
          aria-hidden
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius, opacity: ringOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 border border-gold-soft/45"
        />

        {/* Paper panel keeps the copy legible without introducing a dark ground. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-2/3"
          style={{
            background:
              'linear-gradient(90deg, #f5f2ea 0%, #f5f2ea 56%, rgba(245,242,234,0) 100%)',
          }}
        />

        {/* Content */}
        <Container
          width="wide"
          className="relative flex h-full flex-col justify-center pt-[4.75rem]"
        >
          <motion.div style={{ x: copyX }} className="max-w-2xl">
            <motion.p
              custom={0.05}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 font-sans uppercase"
              style={{ color: 'var(--color-gold-deep)', letterSpacing: '0.24em', fontSize: '0.72rem', fontWeight: 500 }}
            >
              Private equity · Operating partners
            </motion.p>

            <motion.h1
              variants={lineMask}
              initial="hidden"
              animate="visible"
              className="font-display"
              style={{
                fontSize: 'clamp(2.9rem, 7.6vw, 6.6rem)',
                lineHeight: 1.03,
                letterSpacing: '-0.02em',
                fontWeight: 500,
                textShadow: 'none',
              }}
            >
              {TITLE_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span variants={lineInner} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              custom={1.05}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 max-w-md font-sans"
              style={{ color: 'var(--color-ink-80)', fontSize: '1.05rem', lineHeight: 1.55 }}
            >
              We take control of lower-middle-market software companies and grow
              what they are worth — operating the business ourselves, from the
              first day of ownership.
            </motion.p>

            <motion.div
              custom={1.25}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link to="/framework" className="btn btn-light arrow-link">
                See how we build value <span className="arrow">→</span>
              </Link>
              <Link
                to="/contact"
                className="btn btn-ghost"
              >
                Talk to us
              </Link>
            </motion.div>

            <motion.div
              custom={1.45}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10"
            >
              <span
                className="equation rounded-md border border-line bg-canvas/90 px-4 py-2.5 text-ink backdrop-blur-sm"
                style={{ fontSize: '0.84rem' }}
              >
                Equity Value = <span className="text-emerald-soft">Earnings</span> ×{' '}
                <span className="text-gold-soft">Multiple</span>
              </span>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}

function ReducedHero() {
  return (
    <section
      className="relative bg-canvas text-ink"
      style={{ marginTop: `-${HEADER}`, minHeight: '100svh' }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, #f5f2ea 0%, #f5f2ea 42%, rgba(245,242,234,0) 78%)' }}
        />
      </div>
      <Container width="wide" className="relative flex min-h-[100svh] flex-col justify-center pt-[4.75rem]">
        <p className="mb-6 eyebrow">Private equity · Operating partners</p>
        <h1 className="text-display-xl max-w-3xl">Equity value is engineered. From day one.</h1>
        <p className="mt-8 max-w-md font-sans text-[1.05rem] text-ink-80">
          We take control of lower-middle-market software companies and grow what
          they are worth — from the first day of ownership.
        </p>
      </Container>
    </section>
  )
}
