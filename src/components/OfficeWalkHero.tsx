import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { WalkVideo } from './WalkVideo'

/* Landing hero: a scroll-scrubbed walk from the street into the office.
   The previous hero is saved as HomeHeroLegacy.tsx. */
export function OfficeWalkHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.16, 0.3], [1, 1, 0])
  const endOpacity = useTransform(scrollYProgress, [0.84, 0.96], [0, 1])

  return (
    <section ref={ref} className="relative h-[520vh] bg-canvas text-ink">
      <div className="sticky top-[4.75rem] h-[calc(100svh-4.75rem)] overflow-hidden bg-[#17130f]">
        <WalkVideo progress={scrollYProgress} reduced={Boolean(reduce)} />

        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <motion.div
          className="absolute inset-x-0 top-0 z-10 flex justify-between p-6 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-canvas sm:p-9"
          style={{ opacity: introOpacity }}
        >
          <span>Private equity · Operating partners</span>
          <span className="hidden sm:inline">Scroll to enter</span>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 p-6 text-canvas sm:p-10 lg:p-14"
          style={{ opacity: introOpacity }}
        >
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Equity value is engineered. From dayone.
          </h1>
          <p className="sr-only">
            Dayone Ventures is an operating-partner private equity firm for lower middle market software companies.
          </p>
          <Link to="/framework" className="arrow-link link-line mt-8 inline-flex text-base text-canvas hover:text-canvas">
            See how we build value <span className="arrow">→</span>
          </Link>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-6 text-canvas sm:p-10 lg:p-14"
          style={{ opacity: endOpacity }}
        >
          <p className="max-w-3xl font-display text-[clamp(2.4rem,6vw,5.6rem)] font-light leading-[0.95] tracking-[-0.045em]">
            Welcome in.
          </p>
          <Link to="/framework" className="btn btn-light mb-1 shrink-0">
            How we work <span className="arrow">→</span>
          </Link>
        </motion.div>

        <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-canvas/70 sm:flex">
          <span className="h-px w-12 bg-canvas/50" /> Scroll to enter
        </div>
      </div>
    </section>
  )
}
