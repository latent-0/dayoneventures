import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Container, Eyebrow } from '../components/site'

export const Route = createFileRoute('/thank-you')({
  head: () => ({
    meta: [
      { title: 'Thank you · Dayone Ventures' },
      {
        name: 'description',
        content: 'Your enquiry is with the Dayone Ventures team. We reply within one business day.',
      },
      // Post-submit page: keep it out of search and sitemaps.
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: ThankYouPage,
})

function ThankYouPage() {
  // Google Ads conversion — "Submit lead form".
  // The global gtag (AW-18530304117) loads in the root shell; this fires the
  // conversion event once the thank-you page loads.
  //
  // TODO (Kunal): in Google Ads → Goals → Conversions → Submit lead form →
  // Tag setup → "Install the tag yourself", copy the EVENT SNIPPET and replace
  // the send_to label below (AW-18530304117/XXXXXXXXXXX). Then verify with the
  // Tag Assistant Chrome extension that it fires on this page after a submit.
  useEffect(() => {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void }
    try {
      w.gtag?.('event', 'conversion', {
        send_to: 'AW-18530304117/REPLACE_WITH_CONVERSION_LABEL',
      })
    } catch {
      /* no-op */
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="blob blob-orange animate-blob"
          style={{ width: 560, height: 560, left: '50%', top: '-18%', opacity: 0.32 }}
        />
      </div>
      <Container className="relative flex min-h-[70svh] flex-col items-center justify-center py-28 text-center sm:py-36">
        <Eyebrow className="eyebrow-light justify-center inline-flex">Received</Eyebrow>
        <h1 className="text-display-lg mt-6 max-w-3xl text-canvas">
          Thank you. Your note is with us.
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/65">
          We read every enquiry ourselves and will reply within one business day,
          usually sooner, with times for a call and a one-page plan afterwards.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link to="/studio" className="btn btn-light">
            Back to the studio
          </Link>
          <Link to="/studio" hash="checklist" className="btn btn-ghost-light">
            Get the checklist
          </Link>
        </div>
      </Container>
    </section>
  )
}
