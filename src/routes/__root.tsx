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
  legalName: 'DayOne Venture Partners, LLC',
  email: 'contact@dayoneventurepartners.com',
  telephone: '+1-856-653-8460',
  slogan: 'Value, built from dayone.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2 Virginia Rd',
    addressLocality: 'Glassboro',
    addressRegion: 'NJ',
    postalCode: '08028',
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
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'contact@dayoneventurepartners.com',
    telephone: '+1-856-653-8460',
    areaServed: 'US',
    availableLanguage: ['en'],
  },
  sameAs: [
    'https://day1tech.com',
    'https://dayonex.org',
    'https://www.linkedin.com/',
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Audiencetech Intelligence Private Limited',
  },
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Dayone Technologies',
      url: 'https://day1tech.com',
      description:
        'Technology operating partner that embeds senior execution leadership and ships AI, data, API, digital-twin and security platforms.',
    },
    {
      '@type': 'Organization',
      name: 'DayoneX',
      url: 'https://dayonex.org',
      description:
        'Enterprise AI and platform systems: machine learning, computer vision, NLP, digital twins and MLOps, with delivery across India and the United States.',
    },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE.url}/#service`,
  name: 'Operating-partner private equity for software',
  serviceType: 'Private equity value creation',
  provider: { '@id': `${SITE.url}/#organization` },
  areaServed: { '@type': 'Country', name: 'United States' },
  description:
    'Dayone Ventures buys lower middle market software companies and grows equity value by operating them directly, using a four-phase framework: Diagnose, Operate, Compound, Realize.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'How we partner',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Buyouts',
          description:
            'Acquire control of a single software business and run the value-creation plan from close to exit.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Minority and partnerships',
          description:
            'A structured position paired with hands-on operating for founders and holders who want the engine without a full sale.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Operating partner',
          description:
            "One operating standard applied across a sponsor's software portfolio.",
        },
      },
    ],
  },
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
      { name: 'theme-color', content: '#111111' },
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
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
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
        {/* Google tag (gtag.js) — Google Ads AW-18530304117. One global tag,
            loaded once in the shared shell so it is present on every page. */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18530304117"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18530304117');",
          }}
        />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
