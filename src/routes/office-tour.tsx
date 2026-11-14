import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { WalkVideo } from '../components/WalkVideo'
import { seo } from '../lib/seo'


export const Route = createFileRoute('/office-tour')({
  head: () =>
    seo({
      path: '/office-tour',
      title: 'Inside Dayone Ventures',
      description: 'A scroll-led arrival at Dayone Ventures.',
    }),
  component: OfficeTour,
})

function OfficeTour() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.16, 0.3], [1, 1, 0])
  const endOpacity = useTransform(scrollYProgress, [0.84, 0.96], [0, 1])

  return (
    <main className="bg-canvas text-ink">
      <section ref={ref} className="relative h-[520vh]">
        <div className="sticky top-[4.75rem] h-[calc(100svh-4.75rem)] overflow-hidden bg-[#17130f]">
          <WalkVideo progress={scrollYProgress} reduced={Boolean(reduce)} />

          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
          <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/10" />

          <motion.div
            className="absolute inset-x-0 top-0 z-10 flex justify-between p-6 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-canvas sm:p-9"
            style={{ opacity: introOpacity }}
          >
            <span>Dayone Ventures</span>
            <span>Scroll to enter</span>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 p-6 text-canvas sm:p-10 lg:p-14"
            style={{ opacity: introOpacity }}
          >
            <p className="max-w-4xl font-display text-[clamp(3.2rem,8vw,8rem)] font-light leading-[0.88] tracking-[-0.055em]">
              Come in.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-canvas/80 sm:text-base">
              Scroll to move from the street through the spaces where value gets built.
            </p>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-6 text-canvas sm:p-10 lg:p-14"
            style={{ opacity: endOpacity }}
          >
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-soft">07 — Boardroom</p>
              <p className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,7vw,6.8rem)] font-light leading-[0.9] tracking-[-0.05em]">
                Welcome in.
              </p>
            </div>
            <Link to="/contact" className="btn btn-light mb-1 shrink-0">
              Visit us <span className="arrow">→</span>
            </Link>
          </motion.div>

          <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-canvas/70 sm:flex">
            <span className="h-px w-12 bg-canvas/50" /> Scroll to enter
          </div>
        </div>
      </section>
    </main>
  )
}
