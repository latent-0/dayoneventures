import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal, Rosette } from '../components/site'
import { seo } from '../lib/seo'
import { LEAD_ROLES, submitLead, type LeadInput } from '../lib/leads'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      path: '/contact',
      title: 'Contact · Dayone Ventures',
      description:
        'Bring us a company you own or are considering. The first conversation is a diagnostic, not a pitch. Reach Dayone Ventures at contact@dayoneventurepartners.com.',
    }),
  component: ContactPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY: LeadInput = {
  name: '',
  email: '',
  org: '',
  role: LEAD_ROLES[0],
  company: '',
  message: '',
  company_website: '',
}

function ContactPage() {
  const [form, setForm] = useState<LeadInput>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof LeadInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await submitLead({ data: form })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(res.error)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : `Something went wrong. Please email us directly at ${EMAIL}.`,
      )
    }
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
              {status === 'sent' ? (
                <div className="rounded-2xl border border-night-line bg-night-2 p-7 sm:p-9">
                  <p className="eyebrow text-gold-soft">Received</p>
                  <h2 className="mt-4 font-display text-canvas" style={{ fontSize: '1.6rem' }}>
                    Thank you — your note is with us.
                  </h2>
                  <p className="mt-4 font-sans text-[0.98rem] leading-relaxed text-canvas/65">
                    We read every enquiry ourselves and will reply to{' '}
                    <span className="text-canvas">{form.email}</span> within two
                    business days, usually sooner.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(EMPTY)
                      setStatus('idle')
                    }}
                    className="btn btn-light mt-7"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="relative rounded-2xl border border-night-line bg-night-2 p-7 sm:p-9"
                >
                  {/* Honeypot — hidden from people, catches bots */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label>
                      Company website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.company_website}
                        onChange={set('company_website')}
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name">
                      <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Partner" />
                    </Field>
                    <Field label="Work email">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        className={inputCls}
                        placeholder="jane@fund.com"
                      />
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Organisation">
                      <input value={form.org} onChange={set('org')} className={inputCls} placeholder="Fund or company" />
                    </Field>
                    <Field label="You are a">
                      <select value={form.role} onChange={set('role')} className={inputCls}>
                        {LEAD_ROLES.map((r) => (
                          <option key={r} value={r} style={{ color: '#16130c' }}>{r}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Company in question">
                      <input value={form.company} onChange={set('company')} className={inputCls} placeholder="Name / ARR band" />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="What are you seeing?">
                      <textarea
                        required
                        value={form.message}
                        onChange={set('message')}
                        rows={5}
                        className={`${inputCls} resize-none`}
                        placeholder="The situation, the levers you suspect, the timeline."
                      />
                    </Field>
                  </div>

                  {status === 'error' && (
                    <p className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 font-sans text-[0.85rem] text-red-200">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn btn-light mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="mt-4 text-center font-sans text-[0.78rem] text-canvas/40">
                    Goes straight to our team. We reply within two business days.
                  </p>
                </form>
              )}
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
