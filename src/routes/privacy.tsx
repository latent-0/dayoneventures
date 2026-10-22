import { createFileRoute } from '@tanstack/react-router'
import { Container, Eyebrow } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () =>
    seo({
      path: '/privacy',
      title: 'Privacy Policy · Dayone Ventures',
      description:
        'How Dayone Ventures collects, uses and protects the information you share through this website and its forms.',
    }),
  component: PrivacyPage,
})

const EMAIL = 'contact@dayoneventurepartners.com'
const UPDATED = '22 October 2026'

function PrivacyPage() {
  return (
    <section className="bg-canvas">
      <Container width="narrow" className="py-24 sm:py-32">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-display-lg mt-6">Privacy policy</h1>
        <p className="mt-4 font-sans text-[0.9rem] text-ink-45">Last updated {UPDATED}.</p>

        <div className="mt-12 space-y-10 font-sans text-[1rem] leading-relaxed text-ink-60">
          <Block title="Who we are">
            <p>
              This website is operated by DayOne Venture Partners, LLC (Dayone
              Ventures), part of Audiencetech Intelligence Private Limited. You can
              reach us at{' '}
              <a href={`mailto:${EMAIL}`} className="link-line text-ink">
                {EMAIL}
              </a>{' '}
              or at 2 Virginia Rd, Glassboro, NJ 08028, USA.
            </p>
          </Block>

          <Block title="What we collect">
            <p>We collect only what you choose to share and basic usage data:</p>
            <List
              items={[
                'Details you submit through our forms, such as your name, work email, company, website, country, role, stage, funding and the message you write.',
                'Your email address when you request the founder checklist.',
                'Basic campaign and referral data, such as UTM parameters, the referring page and the page you landed on, so we can understand which sources bring enquiries.',
                'Standard technical data your browser sends, and information from cookies and tags described below.',
              ]}
            />
          </Block>

          <Block title="How we use it">
            <List
              items={[
                'To reply to your enquiry and arrange a call.',
                'To send the checklist you asked for and, occasionally, a short follow-up. You can unsubscribe at any time.',
                'To measure and improve our advertising and website.',
              ]}
            />
            <p>We do not sell your personal information.</p>
          </Block>

          <Block title="Cookies and tracking">
            <p>
              We use Google Ads (including the Google tag, gtag.js) to measure
              conversions from our advertising, and we may use the LinkedIn Insight
              Tag for the same purpose. These set cookies that help attribute a
              form submission or download to an ad or source. You can control
              cookies in your browser settings and opt out of personalised Google
              advertising at{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-line text-ink"
              >
                adssettings.google.com
              </a>
              .
            </p>
          </Block>

          <Block title="Who we share it with">
            <p>
              Form submissions are delivered to our own inbox and stored in a
              private Google Sheet through a Google Apps Script service, so our
              team can respond and keep track of enquiries. We share data with
              service providers such as Google and LinkedIn only as described
              above, and when required by law.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              We keep enquiry and checklist data for as long as needed to respond
              and to maintain our records, and no longer than necessary for the
              purposes above or as the law requires.
            </p>
          </Block>

          <Block title="Your rights">
            <p>
              Depending on where you live, you may have the right to access,
              correct or delete the personal information we hold about you, or to
              object to certain processing. To make a request, email us at{' '}
              <a href={`mailto:${EMAIL}`} className="link-line text-ink">
                {EMAIL}
              </a>
              .
            </p>
          </Block>

          <Block title="Changes">
            <p>
              We may update this policy from time to time. The date at the top
              shows when it was last changed.
            </p>
          </Block>
        </div>
      </Container>
    </section>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-ink" style={{ fontSize: '1.4rem', fontWeight: 500 }}>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="relative pl-5">
          <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold" />
          {it}
        </li>
      ))}
    </ul>
  )
}
