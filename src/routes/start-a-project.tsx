import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal, Rosette } from '../components/site'
import { seo } from '../lib/seo'
import { submitProject, type ProjectInput } from '../lib/leads'

export const Route = createFileRoute('/start-a-project')({
  head: () =>
    seo({
      path: '/start-a-project',
      title: 'Start a Project · Dayone Ventures',
      description:
        'Tell us what you are building. A two-minute scope of your industry, budget, timeline and engagement model — no account, no long form.',
    }),
  component: StartAProjectPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'

/* ------------------------------------------------------------------ */
/*  Option sets                                                        */
/* ------------------------------------------------------------------ */

const INDUSTRIES = [
  'Healthtech', 'Fintech', 'Regtech', 'Legaltech', 'Traveltech', 'Pharma',
  'Medtech', 'Consulting', 'Blockchain / Web3', 'RPA / Automation', 'Other',
]
const GOALS = ['Build a new product', 'Upgrade an existing product', 'Both']
const BUILDING = [
  'Mobile app', 'Web app / SaaS', 'Data & analytics', 'AI / ML',
  'Automation / RPA', 'Platform / infrastructure', 'Other',
]
const BUDGETS = ['Under $50K', '$50K – $100K', '$100K – $250K', '$250K+', 'Not sure yet']
const START_WHEN = ['Now', 'Within a month', 'Next quarter', 'Just exploring']
const DELIVER_WHEN = ['ASAP', '1–3 months', '3–6 months', '6+ months', 'Flexible']
const FUNDING = [
  'Bootstrapped', 'Raised — Pre-seed / Seed', 'Raised — Series A or later', 'Prefer not to say',
]
const ENGAGEMENT = [
  'Fixed price', 'Offshore product development (dedicated team)',
  'Build, Operate & Transfer', 'Not sure yet', 'Other',
]

const EMPTY: ProjectInput = {
  industry: '', industryOther: '',
  goal: '',
  building: [], buildingOther: '',
  details: '',
  budget: '', budgetOther: '',
  startWhen: '', deliverWhen: '',
  funding: '',
  engagement: [], engagementOther: '',
  name: '', email: '', phone: '',
  company_website: '',
}

type Status = 'intro' | number | 'sending' | 'sent' | 'error'

const TOTAL_STEPS = 9

function StartAProjectPage() {
  const [form, setForm] = useState<ProjectInput>(EMPTY)
  const [status, setStatus] = useState<Status>('intro')
  const [errorMsg, setErrorMsg] = useState('')

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const toggle = (k: 'building' | 'engagement', opt: string) =>
    setForm((f) => {
      const cur = f[k]
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt]
      return { ...f, [k]: next }
    })

  const advance = () => setStatus((s) => (typeof s === 'number' ? Math.min(s + 1, TOTAL_STEPS - 1) : 0))
  const back = () => setStatus((s) => (typeof s === 'number' ? Math.max(s - 1, 0) : s))

  const pickSingle = (k: keyof ProjectInput, opt: string, auto = true) => {
    set(k, opt as never)
    if (auto && opt !== 'Other') setTimeout(advance, 160)
  }

  const submit = async () => {
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await submitProject({ data: form })
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
    <section className="relative min-h-[100svh] overflow-hidden bg-night text-canvas">
      <div
        aria-hidden
        className="animate-slow-spin pointer-events-none absolute -right-48 -top-40 hidden lg:block"
        style={{ opacity: 0.08 }}
      >
        <Rosette size={640} color="var(--color-gold-soft)" />
      </div>

      <Container width="narrow" className="relative py-24 sm:py-32">
        {status === 'intro' && (
          <Reveal>
            <Eyebrow className="eyebrow-light">Start a project</Eyebrow>
            <h1 className="text-display-lg mt-6 text-canvas">
              Tell us what you're building.
            </h1>
            <p className="mt-6 max-w-lg font-sans text-[1.05rem] leading-relaxed text-canvas/65">
              Nine quick clicks, under two minutes. No account, no long form —
              just enough for us to scope the build and get back to you with a
              real answer, not a form letter.
            </p>
            <button
              type="button"
              onClick={() => setStatus(0)}
              className="btn btn-light mt-9"
            >
              Get started →
            </button>
            <p className="mt-4 font-sans text-[0.82rem] text-canvas/40">
              Prefer email? Reach us at{' '}
              <a href={`mailto:${EMAIL}`} className="link-line text-canvas/60">{EMAIL}</a>.
            </p>
          </Reveal>
        )}

        {status === 'sent' && (
          <Reveal>
            <Eyebrow className="eyebrow-light">Received</Eyebrow>
            <h1 className="text-display-md mt-6 text-canvas">
              Thank you — we're on it.
            </h1>
            <p className="mt-6 max-w-lg font-sans text-[1.05rem] leading-relaxed text-canvas/65">
              We read every project brief ourselves and will reply to{' '}
              <span className="text-canvas">{form.email}</span> within two
              business days, usually sooner.
            </p>
          </Reveal>
        )}

        {typeof status === 'number' && (
          <div>
            <ProgressBar step={status} total={TOTAL_STEPS} />

            {/* honeypot */}
            <input
              aria-hidden
              tabIndex={-1}
              autoComplete="off"
              value={form.company_website}
              onChange={(e) => set('company_website', e.target.value)}
              className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 opacity-0"
            />

            {status === 0 && (
              <Step title="What industry are you in?">
                <ChoiceGrid
                  options={INDUSTRIES}
                  selected={form.industry ? [form.industry] : []}
                  onToggle={(opt) => pickSingle('industry', opt)}
                  otherValue={form.industryOther}
                  onOtherChange={(v) => set('industryOther', v)}
                />
                {form.industry === 'Other' && (
                  <NextButton disabled={!form.industryOther} onClick={advance} />
                )}
              </Step>
            )}

            {status === 1 && (
              <Step title="Are you building something new, or improving what you have?" onBack={back}>
                <ChoiceGrid
                  options={GOALS}
                  selected={form.goal ? [form.goal] : []}
                  onToggle={(opt) => pickSingle('goal', opt)}
                />
              </Step>
            )}

            {status === 2 && (
              <Step
                title="What are you building?"
                sub="Pick as many as apply."
                onBack={back}
              >
                <ChoiceGrid
                  options={BUILDING}
                  selected={form.building}
                  onToggle={(opt) => toggle('building', opt)}
                  otherValue={form.buildingOther}
                  onOtherChange={(v) => set('buildingOther', v)}
                />
                <NextButton disabled={form.building.length === 0} onClick={advance} />
              </Step>
            )}

            {status === 3 && (
              <Step
                title="Anything you want us to know?"
                sub="Optional — the problem you're solving, the opportunity you see. The more context, the better we can help."
                onBack={back}
              >
                <textarea
                  value={form.details}
                  onChange={(e) => set('details', e.target.value)}
                  rows={5}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. Our claims process is still manual and it's costing us renewals."
                />
                <NextButton onClick={advance} label="Continue" />
              </Step>
            )}

            {status === 4 && (
              <Step title="What's your budget range for this project?" onBack={back}>
                <ChoiceGrid
                  options={BUDGETS}
                  selected={form.budget ? [form.budget] : []}
                  onToggle={(opt) => pickSingle('budget', opt)}
                />
              </Step>
            )}

            {status === 5 && (
              <Step title="Timing" onBack={back}>
                <p className="font-sans text-[0.82rem] uppercase tracking-[0.1em] text-canvas/45">
                  When do you want to start?
                </p>
                <div className="mt-3">
                  <ChoiceGrid
                    options={START_WHEN}
                    selected={form.startWhen ? [form.startWhen] : []}
                    onToggle={(opt) => set('startWhen', opt)}
                  />
                </div>
                <p className="mt-7 font-sans text-[0.82rem] uppercase tracking-[0.1em] text-canvas/45">
                  When do you need it delivered?
                </p>
                <div className="mt-3">
                  <ChoiceGrid
                    options={DELIVER_WHEN}
                    selected={form.deliverWhen ? [form.deliverWhen] : []}
                    onToggle={(opt) => set('deliverWhen', opt)}
                  />
                </div>
                <NextButton
                  disabled={!form.startWhen || !form.deliverWhen}
                  onClick={advance}
                />
              </Step>
            )}

            {status === 6 && (
              <Step title="What's your funding status?" onBack={back}>
                <ChoiceGrid
                  options={FUNDING}
                  selected={form.funding ? [form.funding] : []}
                  onToggle={(opt) => pickSingle('funding', opt)}
                />
              </Step>
            )}

            {status === 7 && (
              <Step
                title="Which engagement model fits best?"
                sub="Pick as many as apply."
                onBack={back}
              >
                <ChoiceGrid
                  options={ENGAGEMENT}
                  selected={form.engagement}
                  onToggle={(opt) => toggle('engagement', opt)}
                  otherValue={form.engagementOther}
                  onOtherChange={(v) => set('engagementOther', v)}
                />
                <NextButton disabled={form.engagement.length === 0} onClick={advance} />
              </Step>
            )}

            {status === 8 && (
              <Step
                title="Last thing — where should we send our answer?"
                onBack={back}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={inputCls}
                    placeholder="Your name"
                  />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputCls}
                    placeholder="Work email"
                  />
                </div>
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={`${inputCls} mt-4`}
                  placeholder="Phone & country (optional)"
                />
                <button
                  type="button"
                  disabled={!form.name || !form.email}
                  onClick={submit}
                  className="btn btn-light mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send it →
                </button>
              </Step>
            )}
          </div>
        )}

        {status === 'sending' && (
          <div>
            <ProgressBar step={8} total={TOTAL_STEPS} />
            <Step title="Last thing — where should we send our answer?">
              <p className="font-sans text-[0.95rem] text-canvas/60">Sending…</p>
            </Step>
          </div>
        )}

        {status === 'error' && (
          <div>
            <ProgressBar step={8} total={TOTAL_STEPS} />
            <Step title="Last thing — where should we send our answer?" onBack={() => setStatus(8)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls}
                  placeholder="Your name"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={inputCls}
                  placeholder="Work email"
                />
              </div>
              <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 font-sans text-[0.85rem] text-red-200">
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={submit}
                className="btn btn-light mt-6 w-full"
              >
                Try again →
              </button>
            </Step>
          </div>
        )}
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step + 1) / total) * 100)
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between font-sans text-[0.72rem] uppercase tracking-[0.12em] text-canvas/40">
        <span>Step {step + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-night-line">
        <div
          className="h-full rounded-full bg-gold-soft transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Step({
  title,
  sub,
  onBack,
  children,
}: {
  title: string
  sub?: string
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <div key={title} className="reveal is-in">
      <h2 className="font-display text-canvas" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600 }}>
        {title}
      </h2>
      {sub && (
        <p className="mt-2 font-sans text-[0.92rem] text-canvas/55">{sub}</p>
      )}
      <div className="mt-6">{children}</div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="link-line mt-7 font-sans text-[0.82rem] text-canvas/45"
        >
          ← Back
        </button>
      )}
    </div>
  )
}

function ChoiceGrid({
  options,
  selected,
  onToggle,
  otherValue,
  onOtherChange,
}: {
  options: string[]
  selected: string[]
  onToggle: (opt: string) => void
  otherValue?: string
  onOtherChange?: (v: string) => void
}) {
  const hasOther = options.includes('Other')
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`rounded-xl border px-4 py-3.5 text-left font-sans text-[0.9rem] leading-snug transition-colors ${
                active
                  ? 'border-gold-soft bg-gold-soft/10 text-canvas'
                  : 'border-night-line bg-night text-canvas/75 hover:border-canvas/25'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {hasOther && selected.includes('Other') && (
        <input
          autoFocus
          value={otherValue || ''}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Tell us more"
          className={`${inputCls} mt-3`}
        />
      )}
    </>
  )
}

function NextButton({
  onClick,
  disabled,
  label = 'Continue',
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn btn-light mt-7 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label} →
    </button>
  )
}

const inputCls =
  'w-full rounded-md border border-night-line bg-night px-4 py-3 font-sans text-[0.95rem] text-canvas placeholder:text-canvas/30 outline-none transition-colors focus:border-gold-soft'
