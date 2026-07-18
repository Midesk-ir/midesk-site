// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

const componentsDir = fileURLToPath(new URL('./app/components', import.meta.url))

export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      meta: [
        { name: 'theme-color', content: '#0f1117' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  },

  routeRules: {
    '/': { ssr: true, prerender: true },
    '/robots.txt': { prerender: true },
    '/sitemap.xml': { prerender: true }
  },

  nitro: {
    prerender: {
      routes: ['/', '/robots.txt', '/sitemap.xml']
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css', 'apexcharts/dist/apexcharts.css'],

  runtimeConfig: {
    backendApiUrl: process.env.NUXT_BACKEND_API_URL || 'http://localhost:8080/api/v1',
    captchaSecret: process.env.NUXT_CAPTCHA_SECRET || 'midesk-dev-captcha-secret',
    public: {
      apiBase: '/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || ''
    }
  },

  i18n: {
    locales: [
      { code: 'fa', language: 'fa-IR', file: 'fa.json', dir: 'rtl', name: 'فارسی' },
      { code: 'en', language: 'en-US', file: 'en.json', dir: 'ltr', name: 'English' }
    ],
    defaultLocale: 'fa',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    }
  },

  compatibilityDate: '2025-01-15',

  alias: {
    '/components': componentsDir
  },

  vite: {
    resolve: {
      alias: {
        '/components': componentsDir
      }
    }
  },

  icon: {
    provider: 'server',
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      sizeLimitKb: 768
    },
    serverBundle: 'local'
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
