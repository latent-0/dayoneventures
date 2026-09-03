import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal, Rosette } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      path: '/contact',
      title: 'Contact · Dayone Ventures',
      description:
        'Bring us a company you own or are considering. The first conversation is a diagnostic, not a pitch. Reach Dayone Ventures at contact@dayoneventurespartners.com.',
    }),
  component: ContactPage,
})

const EMAIL = 'contact@dayoneventurespartners.com'

const ROLES = [
  'PE sponsor / fund',
  'Independent sponsor',
  'Founder / owner',
  'Advisor / intermediary',
  'Other',
]

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    org: '',
    role: ROLES[0],
    company: '',
    message: '',
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `Dayone enquiry: ${form.org || form.name || 'new'}`
    const body = [
      `Name: ${form.name}`,
      `Organisation: ${form.org}`,
      `Role: ${form.role}`,
      `Company in question: ${form.company}`,
      '',
      form.message,
    ].join('\n')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <div
        aria-hidden
        className="animate-slow-spin pointer-events-none absolute -left-48 top-1/3 hidden lg:block"
        style={{ opacity: 0.1 }}
      >
        <Rosette size={640} color="var(--color-gold-soft)" />
      </div>
      <Container className="relative py-24 sm:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          {/* Left — the pitch */}
          <div className="md:col-span-5">
            <Reveal>
              <Eyebrow className="eyebrow-light">Contact</Eyebrow>
              <h1 className="text-display-lg mt-6 text-canvas">
                A diagnostic, not a pitch.
              </h1>
              <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                Bring us a company you own, or one you are looking at. We will
                map where the value is leaking and what it would take to build it
                back, before anyone commits to anything.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10 space-y-5 border-t border-night-line pt-8">
                <div>
                  <p className="eyebrow text-gold-soft">Email</p>
                  <a href={`mailto:${EMAIL}`} className="link-line mt-2 inline-block font-display text-canvas" style={{ fontSize: '1.4rem' }}>
                    {EMAIL}
                  </a>
                </div>
                <div>
                  <p className="eyebrow text-gold-soft">Office</p>
                  <address className="mt-2 font-sans text-[0.98rem] not-italic leading-relaxed text-canvas/65">
                    11 Broadway, Suite 615
                    <br />
                    New York, NY
                  </address>
                </div>
                <div>
                  <p className="eyebrow text-gold-soft">Best for</p>
                  <p className="mt-2 font-sans text-[0.98rem] text-canvas/65">
                    Sponsors, independent sponsors, and founders of software
                    companies at $5–40M ARR.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — the form */}
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={90}>
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-night-line bg-night-2 p-7 sm:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name">
                    <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Partner" />
                  </Field>
                  <Field label="Organisation">
                    <input value={form.org} onChange={set('org')} className={inputCls} placeholder="Fund or company" />
                  </Field>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field label="You are a">
                    <select value={form.role} onChange={set('role')} className={inputCls}>
                      {ROLES.map((r) => (
                        <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Company in question">
                    <input value={form.company} onChange={set('company')} className={inputCls} placeholder="Name / ARR band" />
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="What are you seeing?">
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder="The situation, the levers you suspect, the timeline."
                    />
                  </Field>
                </div>
                <button type="submit" className="btn btn-light mt-7 w-full">
                  Compose enquiry
                </button>
                <p className="mt-4 text-center font-sans text-[0.78rem] text-canvas/40">
                  Opens your mail client, addressed to {EMAIL}. Nothing is sent
                  until you hit send.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

const inputCls =
  'w-full rounded-md border border-night-line bg-night px-4 py-3 font-sans text-[0.95rem] text-canvas placeholder:text-canvas/30 outline-none transition-colors focus:border-gold-soft'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[0.72rem] uppercase tracking-[0.14em] text-canvas/50">
        {label}
      </span>
      {children}
    </label>
  )
}
