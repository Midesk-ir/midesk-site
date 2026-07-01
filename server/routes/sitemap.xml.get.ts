export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string | undefined)?.replace(/\/$/, '') ?? 'https://midesk.io'
  const lastmod = new Date().toISOString().slice(0, 10)

  const urls = [
  { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${siteUrl}/register`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${siteUrl}/login`, changefreq: 'monthly', priority: '0.6' }
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="fa" href="${url.loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${url.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${url.loc}" />
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return body
})
