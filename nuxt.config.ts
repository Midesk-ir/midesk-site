// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css', 'apexcharts/dist/apexcharts.css'],

  runtimeConfig: {
    public: {
      apiBase: '/api/v1'
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

  routeRules: {
    '/': { prerender: true },
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/verify-otp': { ssr: false },
    '/onboarding': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/projects/**': { ssr: false },
    '/worklog/**': { ssr: false },
    '/calendar/**': { ssr: false },
    '/leave/**': { ssr: false },
    '/teams/**': { ssr: false },
    '/members/**': { ssr: false },
    '/settings/**': { ssr: false },
    '/notifications/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

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
