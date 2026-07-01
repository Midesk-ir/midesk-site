export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string | undefined)?.replace(/\/$/, '') ?? 'https://midesk.io'

  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /projects/
Disallow: /settings
Disallow: /super-admin/
Disallow: /chat/
Disallow: /finance/
Disallow: /hr/
Disallow: /onboarding

Sitemap: ${siteUrl}/sitemap.xml
`

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return body
})
