const FAQ_KEYS = ['what', 'free', 'calendar', 'security', 'roadmap'] as const

const FEATURE_KEYS = [
  'kanban',
  'sprints',
  'worklog',
  'calendar',
  'teams',
  'dashboard',
  'hr',
  'finance',
  'crm',
  'chat',
  'ai',
  'reports'
] as const

export function buildLandingJsonLd(options: {
  siteUrl: string
  t: (key: string) => string
  locale: string
}) {
  const { siteUrl, t, locale } = options
  const homeUrl = `${siteUrl}/`
  const inLanguage = locale.startsWith('fa') ? 'fa-IR' : 'en-US'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${homeUrl}#organization`,
        name: t('app.name'),
        url: homeUrl,
        logo: `${siteUrl}/og-image.svg`,
        description: t('landing.seo.description')
      },
      {
        '@type': 'WebSite',
        '@id': `${homeUrl}#website`,
        url: homeUrl,
        name: t('app.name'),
        description: t('landing.seo.description'),
        inLanguage: ['fa-IR', 'en-US'],
        publisher: { '@id': `${homeUrl}#organization` }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${homeUrl}#software`,
        name: t('app.name'),
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: homeUrl,
        description: t('landing.seo.description'),
        inLanguage,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IRR',
          description: t('landing.pricingTiers.free.desc')
        },
        featureList: FEATURE_KEYS.map(key => t(`landing.featureItems.${key}.title`))
      },
      {
        '@type': 'FAQPage',
        '@id': `${homeUrl}#faq`,
        inLanguage,
        mainEntity: FAQ_KEYS.map(key => ({
          '@type': 'Question',
          name: t(`landing.faqItems.${key}.q`),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t(`landing.faqItems.${key}.a`)
          }
        }))
      }
    ]
  }
}
