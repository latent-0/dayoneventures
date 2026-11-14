import { useMotionValueEvent, type MotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'

// walk-scrub.mp4 is the final walkthrough, re-encoded all-intra (every frame a
// keyframe) so seeking to any frame is instant and scrolling stays smooth.
const FPS = 24
const SMOOTH_TIME = 0.42 // seconds for the glide to settle after scrolling stops

export function WalkVideo({
  progress,
  reduced,
}: {
  progress: MotionValue<number>
  reduced: boolean
}) {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const target = useRef(0)

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    if (!a || !b || reduced) return
    let raf = 0
    let last = performance.now()
    let pos = target.current
    let vel = 0
    let lastA = -1
    let lastB = -1

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Critically damped spring: velocity carries through, so the video
      // decelerates into the stop instead of halting on a frame.
      const omega = 2 / SMOOTH_TIME
      const x = omega * dt
      const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
      const change = pos - target.current
      const temp = (vel + omega * change) * dt
      vel = (vel - omega * temp) * e
      pos = target.current + (change + temp) * e
      if (Math.abs(pos - target.current) < 1e-6 && Math.abs(vel) < 1e-6) {
        pos = target.current
        vel = 0
      }

      const dur = a.duration
      if (dur && Number.isFinite(dur)) {
        const f = Math.min(dur * FPS - 1.001, Math.max(0, pos * dur * FPS))
        const i = Math.floor(f)
        const frac = f - i
        if (i !== lastA && !a.seeking) {
          a.currentTime = i / FPS
          lastA = i
        }
        // Second video holds the next frame and is faded in by the fractional
        // position, so motion between whole frames is blended, not stepped.
        if (i + 1 !== lastB && !b.seeking) {
          b.currentTime = (i + 1) / FPS
          lastB = i + 1
        }
        b.style.opacity = lastB === i + 1 && lastA === i ? String(frac) : '0'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  useMotionValueEvent(progress, 'change', (v) => {
    target.current = v
  })

  const shared = {
    'aria-hidden': true,
    muted: true,
    playsInline: true,
    preload: 'auto' as const,
    src: '/office-walk/walk-scrub.mp4',
    className: 'absolute inset-0 h-full w-full object-cover',
  }

  return (
    <>
      <video ref={aRef} poster="/office-walk/poster.jpg" {...shared} />
      <video ref={bRef} style={{ opacity: 0 }} {...shared} />
    </>
  )
}
