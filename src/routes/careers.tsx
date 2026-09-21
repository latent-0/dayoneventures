import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal, Rosette } from '../components/site'
import { seo } from '../lib/seo'
import { submitApplication, type ApplicationInput } from '../lib/leads'

export const Route = createFileRoute('/careers')({
  head: () =>
    seo({
      path: '/careers',
      title: 'Careers · Dayone Ventures',
      description:
        'We do not have a self-serve job board yet, but we keep every application on file. Tell us what you do and we will reach out when it fits.',
    }),
  component: CareersPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY: ApplicationInput = {
  name: '',
  email: '',
  area: '',
  link: '',
  message: '',
  company_website: '',
}

function CareersPage() {
  const [form, setForm] = useState<ApplicationInput>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (k: keyof ApplicationInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await submitApplication({ data: form })
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
              <Eyebrow className="eyebrow-light">Careers</Eyebrow>
              <h1 className="text-display-lg mt-6 text-canvas">
                No open roles posted right now.
              </h1>
              <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                We are a small operating team, so we hire in bursts rather
                than running a live board. Leave your details below and we
                will reach out directly if something opens up that fits.
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
                  <p className="eyebrow text-gold-soft">Best for</p>
                  <p className="mt-2 font-sans text-[0.98rem] text-canvas/65">
                    Operators, engineers and analysts who want to work inside
                    the companies we back, not on the sidelines of them.
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
                    Thanks — you're on file.
                  </h2>
                  <p className="mt-4 font-sans text-[0.98rem] leading-relaxed text-canvas/65">
                    We keep every application and reach out when something
                    fits. If it's urgent, email us directly at{' '}
                    <a href={`mailto:${EMAIL}`} className="link-line text-canvas">{EMAIL}</a>.
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
                      <input required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Doe" />
                    </Field>
                    <Field label="Email">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        className={inputCls}
                        placeholder="jane@email.com"
                      />
                    </Field>
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Area of interest">
                      <input
                        value={form.area}
                        onChange={set('area')}
                        className={inputCls}
                        placeholder="Engineering, operations, growth…"
                      />
                    </Field>
                    <Field label="LinkedIn or resume link">
                      <input
                        value={form.link}
                        onChange={set('link')}
                        className={inputCls}
                        placeholder="linkedin.com/in/…"
                      />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Anything else?">
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        rows={4}
                        className={`${inputCls} resize-none`}
                        placeholder="Optional — what you're looking for, what you've worked on."
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
                    {status === 'sending' ? 'Sending…' : 'Send application'}
                  </button>
                  <p className="mt-4 text-center font-sans text-[0.78rem] text-canvas/40">
                    We keep this on file and reach out when it fits.
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
