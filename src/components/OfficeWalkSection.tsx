import { useReducedMotion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { WalkVideo } from './WalkVideo'

/* Scroll-scrubbed walk from the street into the office. Picture only, no copy. */
export function OfficeWalkSection() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={ref}
      aria-label="A walk through the Dayone office"
      className="relative h-[480vh] bg-[#17130f]"
    >
      <div className="sticky top-[4.75rem] h-[calc(100svh-4.75rem)] overflow-hidden">
        <WalkVideo progress={scrollYProgress} reduced={Boolean(reduce)} />
      </div>
    </section>
  )
}
