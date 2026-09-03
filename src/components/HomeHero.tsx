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

/* Save the hero photograph here: public/hero.jpg (a dark night skyline works best) */
const HERO_IMAGE = '/hero.jpg'

const TITLE_LINES = ['Equity value is', 'engineered.', 'From dayone.']

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

  // The full-bleed photograph collapses into a circle that hugs the right edge.
  const P_END = 0.58
  const size = useTransform(scrollYProgress, [0, P_END], ['152vmax', '82vmax'])
  const radiusVmax = useTransform(scrollYProgress, [0, P_END], [76, 41])
  const txN = useTransform(scrollYProgress, [0, P_END], [0, 40]) // vw
  const x = useMotionTemplate`calc(-50% + ${txN}vw)`
  const radius = useTransform(scrollYProgress, [0.04, P_END - 0.06], ['1%', '50%'])
  const ringOpacity = useTransform(scrollYProgress, [0.18, 0.44], [0, 1])
  const imgScale = useTransform(scrollYProgress, [0, P_END], [1.06, 1.16])

  // Clip that matches the image circle. The white copy is clipped to it, so
  // wherever the photo sits, the copy reads white in real time.
  const clip = useMotionTemplate`circle(${radiusVmax}vmax at calc(50% + ${txN}vw) 50%)`

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
        {/* light paper ground */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 18% 24%, #fbf7f0 0%, #f6f1e9 52%, #efe7d9 100%)',
          }}
        />

        {/* noisy orange blobs, soft over the paper */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob blob-orange animate-blob" style={{ width: 560, height: 560, left: '-10%', top: '20%', opacity: 0.22 }} />
          <div className="blob blob-amber animate-blob" style={{ width: 440, height: 440, left: '20%', top: '-14%', opacity: 0.18, animationDelay: '4s' }} />
          <div className="blob blob-orange animate-blob" style={{ width: 500, height: 500, left: '2%', bottom: '-18%', opacity: 0.16, animationDelay: '8s' }} />
        </div>

        {/* the photographic portal (kept natural, no vignette) */}
        <motion.div
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius }}
          className="absolute left-1/2 top-1/2 overflow-hidden will-change-transform"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})`, scale: imgScale }}
            role="img"
            aria-label="Manhattan skyline at night"
          />
          <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        </motion.div>

        {/* the orange ring that forms around the portal */}
        <motion.div
          aria-hidden
          style={{ width: size, height: size, x, y: '-50%', borderRadius: radius, opacity: ringOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 border border-gold-soft/55"
        />

        {/* Copy — dark base (reads on paper) */}
        <div className="absolute inset-0">
          <HeroCopy tone="dark" />
        </div>
        {/* Copy — white layer clipped to the photo, recolors in real time */}
        <motion.div aria-hidden style={{ clipPath: clip }} className="pointer-events-none absolute inset-0">
          <HeroCopy tone="light" />
        </motion.div>
      </div>
    </section>
  )
}

function HeroCopy({ tone }: { tone: 'dark' | 'light' }) {
  const eyebrow = tone === 'light' ? 'var(--color-gold-soft)' : 'var(--color-gold-deep)'
  const heading = tone === 'light' ? 'var(--color-canvas)' : 'var(--color-ink)'
  const linkCls =
    tone === 'light' ? 'text-canvas hover:text-canvas' : 'text-ink-80 hover:text-ink'

  return (
    <Container
      width="wide"
      className="flex h-full flex-col justify-center pt-[4.75rem]"
    >
      <div className="max-w-2xl">
        <motion.p
          custom={0.05}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 font-sans uppercase"
          style={{ color: eyebrow, letterSpacing: '0.28em', fontSize: '0.72rem', fontWeight: 500 }}
        >
          Private equity · Operating partners
        </motion.p>

        <motion.h1
          variants={lineMask}
          initial="hidden"
          animate="visible"
          className="font-display"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            fontWeight: 500,
            color: heading,
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

        <motion.div
          custom={1.15}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <Link
            to="/framework"
            className={`arrow-link link-line font-sans ${linkCls}`}
            style={{ fontSize: '0.95rem', letterSpacing: '0.01em' }}
          >
            See how we build value <span className="arrow">→</span>
          </Link>
        </motion.div>
      </div>
    </Container>
  )
}

function ReducedHero() {
  return (
    <section
      className="relative bg-canvas text-ink"
      style={{ marginTop: `-${HEADER}`, minHeight: '100svh' }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-l-[3rem]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        </div>
      </div>
      <Container width="wide" className="relative flex min-h-[100svh] flex-col justify-center pt-[4.75rem]">
        <p className="mb-6 eyebrow">Private equity · Operating partners</p>
        <h1 className="text-display-xl max-w-3xl">Equity value is engineered. From dayone.</h1>
      </Container>
    </section>
  )
}
