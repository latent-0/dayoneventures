import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react'
import { useRef } from 'react'
import { Container } from './site'

/* A circular aperture opens from the centre, replacing the "usual model"
   (ivory) with the "Dayone model" (vault). Distinct from a diagonal band. */
export function ApertureReveal() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Section is 260vh → the sticky child releases near progress 0.62, so the
  // whole reveal is timed to finish by ~0.5, then holds fully open.
  const r = useTransform(scrollYProgress, [0.06, 0.5], [0, 96])
  const clip = useMotionTemplate`circle(${r}% at 50% 50%)`
  const ringR = useTransform(scrollYProgress, [0.06, 0.5], [0, 96])
  const ringOpacity = useTransform(scrollYProgress, [0.06, 0.38, 0.5], [0, 0.9, 0])
  const baseOpacity = useTransform(scrollYProgress, [0.32, 0.46], [1, 0])
  const panelScale = useTransform(scrollYProgress, [0.06, 0.5], [1.14, 1])
  const dayOneOpacity = useTransform(scrollYProgress, [0.26, 0.46], [0, 1])
  const dayOneY = useTransform(scrollYProgress, [0.26, 0.5], ['12%', '0%'])

  if (reduce) {
    return (
      <section className="relative overflow-hidden bg-night text-canvas">
        <Container className="relative py-28 text-center">
          <p className="eyebrow eyebrow-light">The Dayone model</p>
          <h3 className="mt-5 font-display" style={{ fontSize: 'clamp(1.8rem,3.6vw,3rem)', fontWeight: 500 }}>
            An operating team that owns the outcome.
          </h3>
        </Container>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative bg-canvas-2" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* concentric guide rings */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 50% 50%, rgba(232,99,29,0.10) 0px, rgba(232,99,29,0.10) 1px, transparent 1px, transparent 46px)',
          }}
        />

        {/* base layer — the usual model, on ivory */}
        <motion.div style={{ opacity: baseOpacity }} className="absolute inset-0">
          <UsualLayer />
        </motion.div>

        {/* aperture layer — the Dayone model, on vault */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: panelScale }} className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 70% at 50% 45%, #241a10 0%, #17120c 60%, #0e0a06 100%)',
              }}
            />
            <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
          </motion.div>
          <motion.div style={{ opacity: dayOneOpacity, y: dayOneY }} className="absolute inset-0">
            <DayOneLayer />
          </motion.div>
        </motion.div>

        {/* the expanding ring edge */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <motion.circle
            cx="50"
            cy="50"
            r={ringR}
            fill="none"
            stroke="var(--color-gold-soft)"
            strokeWidth="0.15"
            style={{ opacity: ringOpacity }}
          />
        </svg>
      </div>
    </section>
  )
}

function UsualLayer() {
  return (
    <div className="flex h-full items-center">
      <Container width="wide">
        <div className="max-w-xl">
          <p className="eyebrow" style={{ letterSpacing: '0.2em' }}>
            The usual model
          </p>
          <h2 className="text-display-lg mt-5 text-ink">
            A deal team, a diligence binder, and a deck of advice.
          </h2>
          <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-ink-60">
            Underwrite, recommend, and hope the management team executes. The
            hardest part is handed to the people already running the business
            flat.
          </p>
        </div>
      </Container>
    </div>
  )
}

function DayOneLayer() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div className="max-w-2xl">
        <p className="eyebrow eyebrow-light">The Dayone model</p>
        <h3
          className="mt-5 font-display text-canvas"
          style={{ fontSize: 'clamp(1.9rem,4.4vw,3.6rem)', fontWeight: 500, lineHeight: 1.1 }}
        >
          One operating team that owns the outcome.
        </h3>
        <p className="mx-auto mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/60">
          The plan and the people who run it are the same. Accountable for the
          number from close to exit.
        </p>
      </div>
    </div>
  )
}
