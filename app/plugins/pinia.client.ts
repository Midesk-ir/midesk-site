import { setActivePinia } from 'pinia'

function activatePinia() {
  const nuxtApp = useNuxtApp()
  if (nuxtApp.$pinia) {
    setActivePinia(nuxtApp.$pinia)
  }
}

/**
 * @pinia/nuxt calls setActivePinia(undefined) in app:rendered.
 * Re-activate after that hook and on later navigation hooks (client-only app).
 */
export default defineNuxtPlugin({
  name: 'pinia-keep-active',
  enforce: 'post',
  setup(nuxtApp) {
    nuxtApp.hook('app:rendered', activatePinia)
    nuxtApp.hook('page:finish', activatePinia)
    nuxtApp.hook('app:mounted', activatePinia)
  }
})
