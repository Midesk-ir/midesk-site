import { buildLandingJsonLd } from '~/utils/landing-json-ld'

export function useLandingSeo() {
  const { t, locale } = useI18n()
  const siteUrl = useSiteUrl()
  const route = useRoute()

  const canonicalUrl = computed(() => `${siteUrl.value}${route.path === '/' ? '/' : route.path}`)
  const ogImageUrl = computed(() => `${siteUrl.value}/og-image.svg`)

  const title = computed(() => t('landing.seo.title'))
  const description = computed(() => t('landing.seo.description'))

  useSeoMeta({
    title,
    description,
    keywords: () => t('landing.seo.keywords'),
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage: ogImageUrl,
    ogImageAlt: () => t('landing.seo.ogImageAlt'),
    ogLocale: () => (locale.value === 'fa' ? 'fa_IR' : 'en_US'),
    ogSiteName: () => t('app.name'),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImageUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    author: 'Midesk',
    applicationName: () => t('app.name')
  })

  useHead({
    link: computed(() => [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'fa', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'en', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl.value }
    ]),
    script: computed(() => [
      {
        key: 'landing-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          buildLandingJsonLd({
            siteUrl: siteUrl.value,
            t,
            locale: locale.value
          })
        )
      }
    ])
  })
}
