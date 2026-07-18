export default defineNuxtPlugin({
  name: 'locale-direction',
  setup(nuxtApp) {
    const i18n = nuxtApp.$i18n as { locale: { value: string } }

    function applyDocumentDirection() {
      const code = i18n.locale.value
      const dir = code === 'en' ? 'ltr' : 'rtl'
      const lang = code === 'en' ? 'en' : 'fa'

      document.documentElement.setAttribute('dir', dir)
      document.documentElement.setAttribute('lang', lang)
      document.body?.setAttribute('dir', dir)
    }

    nuxtApp.hook('app:mounted', applyDocumentDirection)
    watch(() => i18n.locale.value, applyDocumentDirection)
  }
})
