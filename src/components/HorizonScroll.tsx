import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'

type Beat = {
  chapter: string
  text: string
  accent?: boolean
}

const BEATS: Beat[] = [
  { chapter: 'The problem', text: 'Most software is bought well, then run flat.' },
  { chapter: 'The trap', text: 'A strong entry multiple is not a return.' },
  { chapter: 'The truth', text: 'Value is made during the hold, or it is not made at all.' },
  { chapter: 'The difference', text: 'So we do not advise from the sidelines. We operate.' },
  { chapter: 'The promise', text: 'From dayone, we build the number.', accent: true },
]

const bg =
  'radial-gradient(130% 120% at 50% 10%, #241a10 0%, #17120c 55%, #0e0a06 100%)'

export function HorizonScroll() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const n = BEATS.length
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(n - 1) * 100}vw`])

  if (reduce) {
    return (
      <section className="text-canvas" style={{ background: bg }}>
        <div className="mx-auto max-w-4xl space-y-16 px-6 py-28">
          {BEATS.map((b, i) => (
            <div key={i}>
              <p className="eyebrow eyebrow-light">{`0${i + 1} · ${b.chapter}`}</p>
              <h2
                className={`mt-4 font-display ${b.accent ? 'text-gold-soft' : 'text-canvas'}`}
                style={{ fontSize: 'clamp(1.9rem,4vw,3.2rem)', fontWeight: 400, lineHeight: 1.14 }}
              >
                {b.text}
              </h2>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${n * 100}vh` }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden text-canvas"
        style={{ background: bg }}
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" />

        {/* progress rail */}
        <div className="absolute left-0 right-0 top-0 z-20 h-px bg-night-line">
          <ProgressBar progress={scrollYProgress} />
        </div>

        {/* horizontal track */}
        <motion.div style={{ x }} className="flex h-full w-max">
          {BEATS.map((b, i) => (
            <Panel key={i} index={i} total={n} beat={b} progress={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const w = useTransform(progress, [0, 1], ['0%', '100%'])
  return <motion.div className="h-px bg-gold-soft" style={{ width: w }} />
}

function Panel({
  index,
  total,
  beat,
  progress,
}: {
  index: number
  total: number
  beat: Beat
  progress: MotionValue<number>
}) {
  // Local progress: 0 as this panel enters center, 1 as it leaves.
  const seg = 1 / (total - 1)
  const center = index * seg
  const local = useTransform(
    progress,
    [center - seg, center, center + seg],
    [1, 0, -1],
  )
  // Statement drifts opposite to travel for depth.
  const textX = useTransform(local, [-1, 0, 1], [120, 0, -120])
  const opacity = useTransform(local, [-1, -0.5, 0, 0.5, 1], [0, 0.5, 1, 0.5, 0])

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center">
      <motion.div
        style={{ x: textX, opacity }}
        className="relative z-10 mx-auto w-full max-w-[76rem] px-6 sm:px-10 lg:px-16"
      >
        <p className="eyebrow eyebrow-light">{`0${index + 1} · ${beat.chapter}`}</p>
        <h2
          className={`mt-6 max-w-3xl font-display ${beat.accent ? 'text-gold-soft' : 'text-canvas'}`}
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 5.2rem)',
            fontWeight: 400,
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
          }}
        >
          {beat.text}
        </h2>
        <div className="mt-8 h-px w-24 bg-gold-soft/60" />
      </motion.div>
    </div>
  )
}
