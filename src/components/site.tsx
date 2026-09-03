import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  Layout primitives                                                  */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className = '',
  width = 'default',
}: {
  children: ReactNode
  className?: string
  width?: 'default' | 'narrow' | 'wide'
}) {
  const max =
    width === 'narrow'
      ? 'max-w-3xl'
      : width === 'wide'
        ? 'max-w-[88rem]'
        : 'max-w-[76rem]'
  return (
    <div className={`mx-auto w-full ${max} px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  line = true,
  className = '',
}: {
  children: ReactNode
  line?: boolean
  className?: string
}) {
  return (
    <p className={`eyebrow ${line ? 'eyebrow-line' : ''} ${className}`}>
      {children}
    </p>
  )
}

/* Fades child in on first scroll into view. Content is always in the DOM. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: any
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as any}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  Wordmark  ·  text lockup, no icon                                  */
/* ------------------------------------------------------------------ */

export function Wordmark({
  tone = 'ink',
  className = '',
}: {
  tone?: 'ink' | 'light'
  className?: string
}) {
  const color = tone === 'light' ? 'var(--color-canvas)' : 'var(--color-ink)'
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span
        className="font-display"
        style={{ color, fontSize: '1.28rem', fontWeight: 500, letterSpacing: '0.01em' }}
      >
        Dayone
      </span>
      <span
        className="font-display"
        style={{
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: tone === 'light' ? 'var(--color-gold-soft)' : 'var(--color-gold-deep)',
        }}
      >
        Ventures
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Header + Framework mega-menu                                       */
/* ------------------------------------------------------------------ */

const NAV = [
  { to: '/framework', label: 'Framework' },
  { to: '/platform', label: 'Platform' },
  { to: '/firm', label: 'The Firm' },
  { to: '/contact', label: 'Contact' },
] as const

export const PLATFORM_MENU = [
  {
    name: 'Dayone Technologies',
    role: 'Technology execution, owned',
    href: 'https://day1tech.com',
    display: 'day1tech.com',
  },
  {
    name: 'DayoneX',
    role: 'Enterprise AI & platform systems',
    href: 'https://dayonex.org',
    display: 'dayonex.org',
  },
]

type MenuLayer = {
  code: string
  name: string
  items?: string[]
  groups?: { g: string; items: string[] }[]
}

export const FRAMEWORK_MENU: MenuLayer[] = [
  {
    code: '01',
    name: 'Diagnose',
    items: [
      'GTM efficiency review',
      'Cost-to-serve teardown',
      'Product and roadmap gaps',
      'Data readiness',
      'Technical due diligence',
      'Retention and NRR drivers',
    ],
  },
  {
    code: '02',
    name: 'Operate',
    groups: [
      { g: 'Revenue engine', items: ['GTM build', 'Pricing and packaging', 'Expansion motion'] },
      { g: 'Cost engine', items: ['Offshore delivery', 'AI automation', 'Vendor consolidation'] },
      { g: 'Product engine', items: ['AI-native workflows', 'Data moat', 'Retention loops'] },
    ],
  },
  {
    code: '03',
    name: 'Compound',
    items: [
      'CFO-grade metrics',
      'NRR past 115%',
      'Retention systems',
      'Durable defensibility',
      'Reporting cadence',
    ],
  },
  {
    code: '04',
    name: 'Realize',
    items: [
      'Investor-grade data room',
      'The buyer story',
      'Management presentation',
      'A higher multiple',
    ],
  },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [fwOpen, setFwOpen] = useState(false)
  const [pltOpen, setPltOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hover-intent: keep the mega-menu open while the pointer travels the gap
  // between the trigger and the panel, and close on a short delay.
  const hoverOpen = (which: 'fw' | 'plt') => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setFwOpen(which === 'fw')
    setPltOpen(which === 'plt')
  }
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      setFwOpen(false)
      setPltOpen(false)
    }, 140)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  // The hero sits on a light paper ground, so the nav stays dark throughout.
  const light = false
  const barBg = light ? 'bg-canvas' : 'bg-ink'
  const linkCls = light
    ? 'text-canvas/80 hover:text-canvas'
    : 'text-ink-80 hover:text-ink'

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || fwOpen || pltOpen
          ? 'bg-canvas/90 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container width="wide">
        <div className="flex h-[4.75rem] items-center justify-between">
          <Link to="/" aria-label="Dayone Ventures, home" onClick={() => setOpen(false)}>
            <Wordmark tone={light ? 'light' : 'ink'} />
          </Link>

          <nav className="hidden items-center gap-9 self-stretch md:flex">
            {/* Framework — opens the mega-menu on hover */}
            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => hoverOpen('fw')}
              onMouseLeave={hoverClose}
            >
              <Link
                to="/framework"
                className={`flex items-center gap-1.5 font-sans text-[0.82rem] tracking-wide transition-colors ${linkCls}`}
                activeProps={{ className: light ? 'text-canvas' : 'text-ink' }}
                activeOptions={{ exact: false }}
              >
                Framework
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className={`transition-transform duration-300 ${fwOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </Link>
            </div>

            {/* Platform — opens the group mega-menu on hover */}
            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => hoverOpen('plt')}
              onMouseLeave={hoverClose}
            >
              <Link
                to="/platform"
                className={`flex items-center gap-1.5 font-sans text-[0.82rem] tracking-wide transition-colors ${linkCls}`}
                activeProps={{ className: light ? 'text-canvas' : 'text-ink' }}
                activeOptions={{ exact: false }}
              >
                Platform
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className={`transition-transform duration-300 ${pltOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </Link>
            </div>

            <Link
              to="/firm"
              className={`font-sans text-[0.82rem] tracking-wide transition-colors ${linkCls}`}
              activeProps={{ className: light ? 'text-canvas' : 'text-ink' }}
              activeOptions={{ exact: false }}
            >
              The Firm
            </Link>
            <Link
              to="/contact"
              className={`font-sans text-[0.82rem] tracking-wide transition-colors ${linkCls}`}
              activeProps={{ className: light ? 'text-canvas' : 'text-ink' }}
              activeOptions={{ exact: false }}
            >
              Contact
            </Link>
            <Link
              to="/contact"
              className={`btn !px-5 !py-2.5 text-[0.82rem] ${light ? 'btn-light' : 'btn-primary'}`}
            >
              Talk to us
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 transition-all duration-300 ${barBg} ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-6 transition-all duration-300 ${barBg} ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-px w-6 transition-all duration-300 ${barBg} ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </Container>

      {/* Framework mega-menu (desktop) */}
      <div
        className={`absolute inset-x-0 top-full hidden md:block ${fwOpen ? '' : 'pointer-events-none'}`}
        onMouseEnter={() => hoverOpen('fw')}
        onMouseLeave={hoverClose}
      >
        <div
          className={`origin-top border-b border-line bg-canvas/97 backdrop-blur-md transition-all duration-300 ${
            fwOpen ? 'opacity-100 translate-y-0' : '-translate-y-2 opacity-0'
          }`}
        >
          <Container width="wide" className="py-10">
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-5">
              {FRAMEWORK_MENU.map((layer) => (
                <div key={layer.code}>
                  <p className="flex items-baseline gap-2">
                    <span className="font-mono text-[0.72rem] text-gold-deep">{layer.code}</span>
                    <span className="font-display text-ink" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                      {layer.name}
                    </span>
                  </p>
                  {layer.items && (
                    <ul className="mt-4 space-y-2.5">
                      {layer.items.map((it) => (
                        <li key={it}>
                          <Link
                            to="/framework"
                            className="link-line font-sans text-[0.86rem] text-ink-60 hover:text-ink"
                          >
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {layer.groups && (
                    <div className="mt-4 space-y-4">
                      {layer.groups.map((grp) => (
                        <div key={grp.g}>
                          <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink">
                            {grp.g}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {grp.items.map((it) => (
                              <li key={it}>
                                <Link
                                  to="/framework"
                                  className="link-line font-sans text-[0.84rem] text-ink-60 hover:text-ink"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Teaser cell */}
              <div className="relative overflow-hidden rounded-xl border border-line bg-canvas-2 p-5">
                <div className="blob blob-orange absolute -right-6 -top-8" style={{ width: 150, height: 150, opacity: 0.5, filter: 'blur(36px)' }} />
                <p className="relative eyebrow">Four layers. One system.</p>
                <p className="relative mt-3 font-display text-ink" style={{ fontSize: '1.25rem', lineHeight: 1.2 }}>
                  Revenue, cost and product, rebuilt together.
                </p>
                <Link to="/framework" className="relative link-line mt-4 inline-block font-sans text-[0.82rem] text-gold-deep">
                  See the full framework
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Platform mega-menu (desktop) */}
      <div
        className={`absolute inset-x-0 top-full hidden md:block ${pltOpen ? '' : 'pointer-events-none'}`}
        onMouseEnter={() => hoverOpen('plt')}
        onMouseLeave={hoverClose}
      >
        <div
          className={`origin-top border-b border-line bg-canvas/97 backdrop-blur-md transition-all duration-300 ${
            pltOpen ? 'opacity-100 translate-y-0' : '-translate-y-2 opacity-0'
          }`}
        >
          <Container width="wide" className="py-10">
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              <div>
                <p className="eyebrow">The Dayone group</p>
                <ul className="mt-5 space-y-5">
                  {PLATFORM_MENU.map((c) => (
                    <li key={c.name}>
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <span className="font-display text-ink transition-colors group-hover:text-gold-deep" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                          {c.name}
                        </span>
                        <span className="mt-1 flex items-center gap-2 font-sans text-[0.84rem] text-ink-60">
                          {c.role}
                          <span className="text-ink-45">·</span>
                          <span className="text-gold-deep">{c.display} →</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-line bg-canvas-2 p-6">
                <div className="blob blob-orange absolute -right-6 -top-8" style={{ width: 160, height: 160, opacity: 0.5, filter: 'blur(38px)' }} />
                <p className="relative eyebrow">The build behind the buy</p>
                <p className="relative mt-3 font-display text-ink" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>
                  A captive technology group, deployed into every deal.
                </p>
                <Link to="/platform" className="relative link-line mt-4 inline-block font-sans text-[0.82rem] text-gold-deep">
                  Explore the platform
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line bg-canvas md:hidden transition-[max-height] duration-400 ease-out ${
          open ? 'max-h-96' : 'max-h-0 border-transparent'
        }`}
      >
        <Container>
          <nav className="flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl py-3 text-ink-80"
                activeProps={{ className: 'text-ink' }}
                activeOptions={{ exact: false }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full"
            >
              Talk to us
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-canvas">
      {/* Engraved rosette watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 hidden md:block"
        style={{ opacity: 0.06 }}
      >
        <Rosette size={480} color="var(--color-gold-soft)" />
      </div>
      <Container width="wide" className="relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-6 max-w-sm font-sans text-[0.95rem] leading-relaxed text-canvas/60">
              A private equity operating firm. We build equity value in lower
              middle market software companies, and we do the operating work
              ourselves from dayone of ownership.
            </p>
            <p className="equation mt-6 text-[0.82rem] text-gold-soft">
              Equity Value = Earnings × Multiple
            </p>
          </div>

          <div>
            <p className="eyebrow text-gold-soft">Navigate</p>
            <ul className="mt-5 space-y-3 font-sans text-[0.95rem] text-canvas/70">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-line" activeOptions={{ exact: false }}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/firm" hash="thesis" className="link-line">
                  Thesis
                </Link>
              </li>
              <li>
                <Link to="/framework" hash="fit" className="link-line">
                  Where we fit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-soft">Enquiries</p>
            <ul className="mt-5 space-y-3 font-sans text-[0.95rem] text-canvas/70">
              <li>
                <a href="mailto:contact@dayoneventurespartners.com" className="link-line">
                  contact@dayoneventurespartners.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="link-line"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
            <address className="mt-4 font-sans text-[0.9rem] not-italic leading-relaxed text-canvas/50">
              11 Broadway, Suite 615
              <br />
              New York, NY
            </address>
            <Link to="/contact" className="btn btn-light mt-6 !py-2.5 !px-5 text-[0.82rem]">
              Talk to us
            </Link>
          </div>
        </div>

        <hr className="mt-14 border-0 border-t border-night-line" />
        <div className="mt-6 flex flex-col justify-between gap-3 font-sans text-[0.78rem] text-canvas/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Dayone Ventures. All rights reserved.</p>
          <p className="tracking-wide">Diagnose · Operate · Compound · Realize</p>
        </div>
      </Container>
    </footer>
  )
}

/* Curved-geometric motif: a spirograph rose of rotated ellipses. Geometric
   construction, curved paths. Pair with `.animate-slow-spin` to rotate, and
   `draw` to trace the lines on. */
export function CurveMotif({
  size = 420,
  color = 'var(--color-gold-soft)',
  count = 10,
  draw = false,
  className = '',
}: {
  size?: number
  color?: string
  count?: number
  draw?: boolean
  className?: string
}) {
  const r2 = (v: number) => Math.round(v * 1000) / 1000
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={`${draw ? 'motif-draw' : ''} ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <ellipse
          key={`e${i}`}
          cx="100"
          cy="100"
          rx="86"
          ry="30"
          stroke={color}
          strokeWidth="0.5"
          transform={`rotate(${r2((180 / count) * i)} 100 100)`}
          style={draw ? { animationDelay: `${(i / count) * 2}s` } : undefined}
        />
      ))}
      <circle cx="100" cy="100" r="86" stroke={color} strokeWidth="0.4" opacity="0.5" />
    </svg>
  )
}

/* A concentric engraved rosette used as a quiet luxury motif. */
export function Rosette({
  size = 300,
  color = 'var(--color-gold)',
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) {
  const rings = [48, 42, 34, 24]
  const ticks = 60
  const r2 = (v: number) => Math.round(v * 1000) / 1000
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      {rings.map((r) => (
        <circle key={r} cx="50" cy="50" r={r} stroke={color} strokeWidth="0.3" />
      ))}
      {Array.from({ length: ticks }).map((_, i) => {
        const a = (i / ticks) * Math.PI * 2
        const inner = 42
        const outer = 48
        return (
          <line
            key={i}
            x1={r2(50 + Math.cos(a) * inner)}
            y1={r2(50 + Math.sin(a) * inner)}
            x2={r2(50 + Math.cos(a) * outer)}
            y2={r2(50 + Math.sin(a) * outer)}
            stroke={color}
            strokeWidth="0.3"
          />
        )
      })}
    </svg>
  )
}
