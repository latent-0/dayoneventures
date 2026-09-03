import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  Link,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { Header, Footer, Container } from '../components/site'

const SITE = {
  name: 'Dayone Ventures',
  url: 'https://www.dayoneventurepartners.com',
  description:
    'Dayone Ventures is a private equity operating firm for lower middle market software companies. We diagnose value leakage, deploy revenue, margin and product engines, and build exit readiness, and we do it hands on from dayone of ownership.',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'FinancialService'],
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: 'Dayone',
  description: SITE.description,
  disambiguatingDescription:
    'Dayone Ventures is a private equity operating firm that partners with sponsors and management teams of lower-middle-market ($5M–$40M ARR) software and tech-enabled businesses to expand EBITDA and multiple through a four-phase value-creation framework: Diagnose, Operate, Compound, Realize.',
  url: SITE.url,
  email: 'contact@dayoneventurepartners.com',
  slogan: 'Value, built from dayone.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '11 Broadway, Suite 615',
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  },
  areaServed: [{ '@type': 'Country', name: 'United States' }],
  knowsAbout: [
    'Private equity value creation',
    'Operating partner model',
    'Lower middle-market software',
    'EBITDA expansion',
    'Multiple expansion',
    'Go-to-market engineering',
    'Net revenue retention',
    'Exit readiness',
  ],
  serviceType: [
    'Value-creation operating partnership',
    'Operational due diligence',
    'Revenue operations',
    'Cost and margin transformation',
    'Exit preparation',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@id': `${SITE.url}/#organization` },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dayone Ventures · Operating-Partner Private Equity for Software' },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#17120c' },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'author', content: SITE.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: 'Dayone Ventures · Operating-Partner Private Equity' },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.url },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Dayone Ventures' },
      { name: 'twitter:description', content: SITE.description },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;450;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <Container className="py-32 text-center sm:py-44">
      <p className="eyebrow justify-center inline-flex">Error 404</p>
      <h1 className="text-display-lg mt-8">This page has moved on.</h1>
      <p className="mx-auto mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-ink-60">
        The page you were looking for is not here. Everything worth finding is a
        click away.
      </p>
      <div className="mt-9 flex justify-center">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </Container>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children ?? <Outlet />}</main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
